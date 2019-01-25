"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _lodash = _interopRequireDefault(require("lodash"));

var _dateUtils = _interopRequireDefault(require("./dateUtils"));

var _dateConstants = require("../constants/dateConstants");

var _fieldValidationRules = _interopRequireDefault(require("./fieldValidationRules"));

var _validationConstants = require("../constants/validationConstants");

const defineValue = value => {
  if (_lodash.default.isArray(value) && _lodash.default.get(_lodash.default.last(value), 'fileGuid')) {
    return value.map(val => val.fileGuid);
  }

  if (_dateUtils.default.isMoment(value)) {
    return value.format(_dateConstants.HANDBOOK_FORMAT);
  }

  if (_lodash.default.isPlainObject(value)) {
    return _lodash.default.reduce(value, (res, subValue, key) => Object.assign(res, {
      [key]: defineValue(subValue)
    }), {});
  }

  return value;
};

const ADDITIONAL_VALIDATION = {
  DatePicker: () => ({
    date: true
  }),
  TimePicker: () => ({
    time: true
  }),
  DateInterval: name => ({
    date: true,
    afterSameDate: [`${name}.startDate`, _validationConstants.ERROR_MESSAGES.incorrectInterval],
    beforeSameDate: [`${name}.endDate`, _validationConstants.ERROR_MESSAGES.incorrectInterval]
  })
};
var _default = {
  formatValidation(validation, type, name) {
    return (value, allValues, props) => {
      if (!validation) return '';
      const fullValidation = (0, _extends2.default)({}, ADDITIONAL_VALIDATION[type] && ADDITIONAL_VALIDATION[type](name), validation);

      const errorMessages = _lodash.default.map(fullValidation, (val, key) => {
        if (!_lodash.default.isFunction(_fieldValidationRules.default[key])) return null;

        if (_lodash.default.isBoolean(val)) {
          return val && _fieldValidationRules.default[key](value, allValues, props);
        }

        if (_lodash.default.isArray(val)) {
          return _fieldValidationRules.default[key](...val)(value, allValues, props);
        }

        return _fieldValidationRules.default[key](val)(value, allValues, props);
      });

      return _lodash.default.head(_lodash.default.compact(errorMessages));
    };
  },

  formatToServer(data) {
    return _lodash.default.reduce(data, (res, value, key) => Object.assign(res, {
      [key]: defineValue(value)
    }), {});
  }

};
exports.default = _default;