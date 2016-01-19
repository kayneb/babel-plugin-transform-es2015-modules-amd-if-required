/* global test */
/* global suite */

"use strict";

var _extends = require("babel-runtime/helpers/extends")["default"];

var _bind = require("babel-runtime/helpers/bind")["default"];

var _Object$keys = require("babel-runtime/core-js/object/keys")["default"];

var _Object$values = require("babel-runtime/core-js/object/values")["default"];

var _getIterator = require("babel-runtime/core-js/get-iterator")["default"];

var _interopRequireWildcard = require("babel-runtime/helpers/interop-require-wildcard")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

exports.__esModule = true;

var _babelCore = require("babel-core");

var babel = _interopRequireWildcard(_babelCore);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _babelHelperFixtures = require("babel-helper-fixtures");

var _babelHelperFixtures2 = _interopRequireDefault(_babelHelperFixtures);

var _sourceMap = require("source-map");

var _sourceMap2 = _interopRequireDefault(_sourceMap);

var _babelCodeFrame = require("babel-code-frame");

var _babelCodeFrame2 = _interopRequireDefault(_babelCodeFrame);

var _helpers = require("./helpers");

var helpers = _interopRequireWildcard(_helpers);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

require("babel-polyfill");

var _babelRegister = require("babel-register");

var _babelRegister2 = _interopRequireDefault(_babelRegister);

_babelRegister2["default"]({
  ignore: [_path2["default"].resolve(__dirname + "/../../.."), "node_modules"]
});

var babelHelpers = eval(_babelCore.buildExternalHelpers(null, "var"));

function wrapPackagesArray(type, names) {
  return (names || []).map(function (val) {
    if (typeof val === "string") val = [val];
    val[0] = __dirname + "/../../../babel-" + type + "-" + val[0];
    return val;
  });
}

function run(task) {
  var actual = task.actual;
  var expect = task.expect;
  var exec = task.exec;
  var opts = task.options;

  function getOpts(self) {
    var newOpts = _lodash2["default"].merge({
      filename: self.loc
    }, opts);

    newOpts.plugins = wrapPackagesArray("plugin", newOpts.plugins);
    newOpts.presets = wrapPackagesArray("preset", newOpts.presets).map(function (val) {
      return val[0];
    });

    return newOpts;
  }

  var execCode = exec.code;
  var result = undefined;

  if (execCode) {
    var execOpts = getOpts(exec);
    result = babel.transform(execCode, execOpts);
    execCode = result.code;

    try {
      runExec(exec.loc, execCode);
    } catch (err) {
      err.message = exec.loc + ": " + err.message;
      err.message += _babelCodeFrame2["default"](execCode);
      throw err;
    }
  }

  var actualCode = actual.code;
  var expectCode = expect.code;
  if (!execCode || actualCode) {
    result = babel.transform(actualCode, getOpts(actual));
    actualCode = result.code.trim();

    try {
      _chai2["default"].expect(actualCode).to.be.equal(expectCode, actual.loc + " !== " + expect.loc);
    } catch (err) {
      //require("fs").writeFileSync(expect.loc, actualCode);
      throw err;
    }
  }

  if (task.sourceMap) {
    _chai2["default"].expect(result.map).to.deep.equal(task.sourceMap);
  }

  if (task.sourceMappings) {
    (function () {
      var consumer = new _sourceMap2["default"].SourceMapConsumer(result.map);

      _lodash2["default"].each(task.sourceMappings, function (mapping) {
        var actual = mapping.original;

        var expect = consumer.originalPositionFor(mapping.generated);
        _chai2["default"].expect({ line: expect.line, column: expect.column }).to.deep.equal(actual);
      });
    })();
  }
}

function runExec(filename, execCode) {
  var sandbox = _extends({}, helpers, {
    babelHelpers: babelHelpers,
    assert: _chai2["default"].assert,
    transform: babel.transform,
    exports: {}
  });

  var fn = new (_bind.apply(Function, [null].concat(_Object$keys(sandbox), [execCode])))();
  return fn.apply(null, _Object$values(sandbox));
}

exports["default"] = function (fixturesLoc /*: string*/, name /*: string*/, suiteOpts, taskOpts, dynamicOpts /*:: ?: Function*/) {
  if (suiteOpts === undefined) suiteOpts = {};
  if (taskOpts === undefined) taskOpts = {};

  var suites = _babelHelperFixtures2["default"](fixturesLoc);


  var _loop = function () {
    if (_isArray) {
      if (_i >= _iterator.length) return "break";
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) return "break";
      _ref = _i.value;
    }

    var testSuite = _ref;

    if (_lodash2["default"].contains(suiteOpts.ignoreSuites, testSuite.title)) return "continue";

    suite(name + "/" + testSuite.title, function () {
      var _loop3 = function () {
        if (_isArray2) {
          if (_i2 >= _iterator2.length) return "break";
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) return "break";
          _ref2 = _i2.value;
        }

        var task = _ref2;

        if (_lodash2["default"].contains(suiteOpts.ignoreTasks, task.title) || _lodash2["default"].contains(suiteOpts.ignoreTasks, testSuite.title + "/" + task.title)) return "continue";

        test(task.title, !task.disabled && function () {
          function runTask() {
            run(task);
          }

          _lodash2["default"].defaults(task.options, {
            filenameRelative: task.expect.filename,
            sourceFileName: task.actual.filename,
            sourceMapTarget: task.expect.filename,
            suppressDeprecationMessages: true,
            babelrc: false,
            sourceMap: !!(task.sourceMappings || task.sourceMap)
          });

          _lodash2["default"].extend(task.options, taskOpts);

          if (dynamicOpts) dynamicOpts(task.options, task);

          var throwMsg = task.options.throws;
          if (throwMsg) {
            // internal api doesn't have this option but it's best not to pollute
            // the options object with useless options
            delete task.options.throws;

            _assert2["default"].throws(runTask, function (err) {
              return throwMsg === true || err.message.indexOf(throwMsg) >= 0;
            });
          } else {
            runTask();
          }
        });
      };

      _loop4: for (var _iterator2 = testSuite.tests, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _getIterator(_iterator2);;) {
        var _ref2;

        var _ret3 = _loop3();

        // istanbul ignore next

        switch (_ret3) {
          case "break":
            break _loop4;

          case "continue":
            continue;}
      }
    });
  };

  _loop2: for (var _iterator = suites, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
    var _ref;

    var _ret2 = _loop();

    // istanbul ignore next

    switch (_ret2) {
      case "break":
        break _loop2;

      case "continue":
        continue;}
  }
};

module.exports = exports["default"];