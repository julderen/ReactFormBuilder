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

var defineValue = function defineValue(value) {
  if (_lodash.default.isArray(value) && _lodash.default.get(_lodash.default.last(value), 'fileGuid')) {
    return value.map(function (val) {
      return val.fileGuid;
    });
  }

  if (_dateUtils.default.isMoment(value)) {
    return value.format(_dateConstants.HANDBOOK_FORMAT);
  }

  if (_lodash.default.isPlainObject(value)) {
    return _lodash.default.reduce(value, function (res, subValue, key) {
      var _Object$assign;

      return Object.assign(res, (_Object$assign = {}, _Object$assign[key] = defineValue(subValue), _Object$assign));
    }, {});
  }

  return value;
};

var ADDITIONAL_VALIDATION = {
  DatePicker: function DatePicker() {
    return {
      date: true
    };
  },
  TimePicker: function TimePicker() {
    return {
      time: true
    };
  },
  DateInterval: function DateInterval(name) {
    return {
      date: true,
      afterSameDate: [name + ".startDate", _validationConstants.ERROR_MESSAGES.incorrectInterval],
      beforeSameDate: [name + ".endDate", _validationConstants.ERROR_MESSAGES.incorrectInterval]
    };
  }
};
var _default = {
  formatValidation: function formatValidation(validation, type, name) {
    return function (value, allValues, props) {
      if (!validation) return '';
      var fullValidation = (0, _extends2.default)({}, ADDITIONAL_VALIDATION[type] && ADDITIONAL_VALIDATION[type](name), validation);

      var errorMessages = _lodash.default.map(fullValidation, function (val, key) {
        if (!_lodash.default.isFunction(_fieldValidationRules.default[key])) return null;

        if (_lodash.default.isBoolean(val)) {
          return val && _fieldValidationRules.default[key](value, allValues, props);
        }

        if (_lodash.default.isArray(val)) {
          return _fieldValidationRules.default[key].apply(_fieldValidationRules.default, val)(value, allValues, props);
        }

        return _fieldValidationRules.default[key](val)(value, allValues, props);
      });

      return _lodash.default.head(_lodash.default.compact(errorMessages));
    };
  },
  formatToServer: function formatToServer(data) {
    return _lodash.default.reduce(data, function (res, value, key) {
      var _Object$assign2;

      return Object.assign(res, (_Object$assign2 = {}, _Object$assign2[key] = defineValue(value), _Object$assign2));
    }, {});
  }
};
exports.default = _default;