"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

const containers = ({
  containersList,
  key,
  type,
  formatKey,
  callBack,
  children,
  complexFields,
  change
}) => {
  if (!containersList[type]) return null;
  return _react.default.createElement(containersList[type], {
    key: formatKey(key),
    label: key
  }, callBack(children, complexFields, change, formatKey(key)));
};

containers.propTypes = {
  type: _propTypes.default.string,
  containersList: _propTypes.default.object,
  key: _propTypes.default.string,
  formatKey: _propTypes.default.func,
  callBack: _propTypes.default.func,
  children: _propTypes.default.array,
  complexFields: _propTypes.default.object,
  change: _propTypes.default.func
};
var _default = containers;
exports.default = _default;