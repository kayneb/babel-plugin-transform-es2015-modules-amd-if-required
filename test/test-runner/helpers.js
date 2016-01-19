"use strict";

var _Object$getOwnPropertyNames = require("babel-runtime/core-js/object/get-own-property-names")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

exports.__esModule = true;
exports.assertNoOwnProperties = assertNoOwnProperties;
exports.assertHasOwnProperty = assertHasOwnProperty;
exports.assertLacksOwnProperty = assertLacksOwnProperty;
exports.multiline = multiline;

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

function assertNoOwnProperties(obj) {
  _assert2["default"].equal(_Object$getOwnPropertyNames(obj).length, 0);
}

function assertHasOwnProperty() {}

function assertLacksOwnProperty() {}

function multiline(arr) {
  return arr.join("\n");
}

var assertArrayEquals = _assert2["default"].deepEqual;
exports.assertArrayEquals = assertArrayEquals;