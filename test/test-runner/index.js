"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

exports.__esModule = true;

var _babelHelperTransformFixtureTestRunner = require("./babel-helper-transform-fixture-test-runner");

var _babelHelperTransformFixtureTestRunner2 = _interopRequireDefault(_babelHelperTransformFixtureTestRunner);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

exports["default"] = function (loc) {
  var name = _path2["default"].basename(_path2["default"].dirname(loc));
  _babelHelperTransformFixtureTestRunner2["default"](loc + "/fixtures", name);
};

module.exports = exports["default"];