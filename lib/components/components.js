"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _lodash = _interopRequireDefault(require("lodash"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _dynamicUtils = _interopRequireDefault(require("../utils/dynamicUtils"));

const components = ({
  complexFields,
  type,
  formatKey,
  key,
  filedsList,
  other,
  props,
  validation,
  change
}) => {
  if (!filedsList[type]) return null;
  const textField = complexFields.find(field => field.key === formatKey(key));
  return _react.default.createElement(filedsList[type], (0, _extends2.default)({}, other, props && _lodash.default.reduce(props, (result, prop) => _lodash.default.assign(result, prop), {}), {
    validation,
    name: formatKey(key),
    textField: textField && textField.observableFields,
    label: key,
    required: validation && validation.required,
    maxLength: validation && validation.maxLength,
    change,
    validate: _dynamicUtils.default.formatValidation(validation, type, formatKey(key))
  }));
};

components.propTypes = {
  complexFields: _propTypes.default.array,
  type: _propTypes.default.string,
  formatKey: _propTypes.default.func,
  key: _propTypes.default.func,
  filedsList: _propTypes.default.object,
  other: _propTypes.default.array,
  props: _propTypes.default.object,
  validation: _propTypes.default.object,
  change: _propTypes.default.func
};
var _default = components;
exports.default = _default;