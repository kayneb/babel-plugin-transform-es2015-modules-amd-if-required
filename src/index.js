import template from "babel-template";

let buildDefine = template(`
  define(MODULE_NAME, [SOURCES], function (PARAMS) {
    BODY;
  });
`);

export default function ({ types: t }) {
  function isValidRequireCall(path) {
    if (!path.isCallExpression()) return false;
    if (!path.get("callee").isIdentifier({ name: "require" })) return false;
    if (path.scope.getBinding("require")) return false;

    let args = path.get("arguments");
    if (args.length !== 1) return false;

    let arg = args[0];
    if (!arg.isStringLiteral()) return false;

    return true;
  }

  function isValidDefine(path) {
    if (!path.isExpressionStatement()) return;

    let expr = path.get("expression");
    if (!expr.isCallExpression()) return false;
    if (!expr.get("callee").isIdentifier({ name: "define" }) &&
        !expr.get("callee").isIdentifier({ name: "require" })) return false;

    let args = expr.get("arguments");
    if (args.length === 3 && !args.shift().isStringLiteral()) return false;

    let firstArg = args.shift();
    if (firstArg.isArrayExpression()) {
      let secondArg = args.shift();
      if (secondArg.isFunctionExpression()) {
        return true;
      }
    } else if (firstArg.isFunctionExpression()) {
      return true;
    }

    return false;
  }

  function isValidRequireConfig(path) {
    if (!path.isExpressionStatement()) return;

    let expr = path.get("expression");
    if (!expr.isCallExpression()) return false;

    if (!expr.get("callee").get('object').isIdentifier({ name: "require" }) ||
      !expr.get("callee").get('property').isIdentifier({ name: "config" })) return false;

    return true;
  }

  let amdVisitor = {
    ReferencedIdentifier({ node, scope }) {
      if (node.name === "exports" && !scope.getBinding("exports")) {
        this.hasExports = true;
      }

      if (node.name === "module" && !scope.getBinding("module")) {
        this.hasModule = true;
      }
    },

    CallExpression(path) {
      if (!isValidRequireCall(path)) return;
      this.bareSources.push(path.node.arguments[0]);
      path.remove();
    },

    VariableDeclarator(path) {
      let id = path.get("id");
      if (!id.isIdentifier()) return;

      let init = path.get("init");
      if (!isValidRequireCall(init)) return;

      let source = init.node.arguments[0];
      this.sourceNames[source.value] = true;
      this.sources.push([id.node, source]);

      path.remove();
    }
  };

  return {
    inherits: require("babel-plugin-transform-es2015-modules-commonjs"),

    pre() {
      // source strings
      this.sources = [];
      this.sourceNames = Object.create(null);

      // bare sources
      this.bareSources = [];

      this.hasExports = false;
      this.hasModule = false;
    },

    visitor: {
      Program: {
        exit(path, state) {
          if (this.ran) return;
          this.ran = true;

          let body = path.get("body")
          let last = body[body.length - 1];
          for (var i = 0; i < body.length; i++) {
            if (isValidDefine(body[i]) || isValidRequireConfig(body[i])) return;
          }
          
          path.traverse(amdVisitor, this);

          let params = this.sources.map(source => source[0]);
          let sources = this.sources.map(source => source[1]);

          sources = sources.concat(this.bareSources.filter((str) => {
            return !this.sourceNames[str.value];
          }));

          let moduleName = this.getModuleName();
          if (moduleName) moduleName = t.stringLiteral(moduleName);

          if (this.hasExports) {
            sources.unshift(t.stringLiteral("exports"));
            params.unshift(t.identifier("exports"));
          }

          if (this.hasModule) {
            sources.unshift(t.stringLiteral("module"));
            params.unshift(t.identifier("module"));
          }

          path.node.body = [buildDefine({
            MODULE_NAME: moduleName,
            SOURCES: sources,
            PARAMS: params,
            BODY: path.node.body
          })];
        }
      }
    }
  };
}
