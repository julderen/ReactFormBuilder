"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _validationConstants = require("../constants/validationConstants");

var _dateUtils = _interopRequireDefault(require("./dateUtils"));

var _dateConstants = require("../constants/dateConstants");

var global = function global(str) {
  return new RegExp(str, 'g');
};

var RANGES = {
  symbol: 'A-Za-zА-Яа-яЁё',
  number: '0-9',
  symbolOrNumber: 'A-Za-zА-Яа-яЁё0-9',
  latinSymbolOrNumber: 'A-Za-z0-9'
};

var errorMessage = function errorMessage(isInvalid, message) {
  return isInvalid ? message : null;
};

var valueGet = function valueGet(values, valueOrPath) {
  return _lodash.default.isString(valueOrPath) ? _lodash.default.get(values, valueOrPath) : valueOrPath;
};

var required = function required(value) {
  return errorMessage(_lodash.default.isString(value) ? !_lodash.default.trim(value, ' ') : _lodash.default.isEmpty(value) && !_lodash.default.isNumber(value), 'Пожалуйста, заполните это поле');
};

var number = function number(value) {
  if (!value) return null;
  var range = "[" + RANGES.number + "\\s]+";
  var result = _lodash.default.isNumber(value) ? false : value.replace(global(range), '');
  return errorMessage(result.length, _validationConstants.ERROR_MESSAGES.incorrectValue);
};

var minValue = function minValue(value) {
  return function (values) {
    return errorMessage(values && Number(values) < value, "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 - " + value);
  };
};

var maxValue = function maxValue(value) {
  return function (values) {
    return errorMessage(values && Number(values) > value, "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 - " + value);
  };
};

var minDate = function minDate(limitDate) {
  return function (value) {
    if (!value || !limitDate) return null;

    var momentLimitDate = _dateUtils.default.moment(limitDate, _dateConstants.HANDBOOK_FORMAT);

    var momentValue = _dateUtils.default.moment(value.display);

    return errorMessage(!momentValue.isValid() || !momentValue.isSameOrAfter(momentLimitDate), _validationConstants.ERROR_MESSAGES.incorrectMinDate(momentLimitDate.format(_dateConstants.HANDBOOK_FORMAT)));
  };
};

var maxDate = function maxDate(limitDate) {
  return function (value) {
    if (!value || !limitDate) return null;

    var momentLimitDate = _dateUtils.default.moment(limitDate, _dateConstants.HANDBOOK_FORMAT);

    var momentValue = _dateUtils.default.moment(value.display);

    return errorMessage(!momentValue.isValid() || !momentValue.isSameOrBefore(momentLimitDate), _validationConstants.ERROR_MESSAGES.incorrectMaxDate(momentLimitDate.format(_dateConstants.HANDBOOK_FORMAT)));
  };
};

var date = function date(value) {
  if (!value) return null;

  var momentValue = _dateUtils.default.moment(value.display);

  return errorMessage(!momentValue.isValid(), _validationConstants.ERROR_MESSAGES.incorrectValue);
};

var time = function time(value) {
  if (!value) return null;

  var momentValue = _dateUtils.default.timeToMoment(value);

  return errorMessage(!momentValue.isValid(), _validationConstants.ERROR_MESSAGES.incorrectValue);
};

var afterSameDate = function afterSameDate(dateOrPath, message) {
  return function (value, values) {
    var dateValue = valueGet(values, dateOrPath);
    if (!value || !dateValue) return null;

    var momentValue = _dateUtils.default.moment(value.display);

    var momentDateValue = _dateUtils.default.moment(dateValue.display);

    return errorMessage(!momentValue.isValid() || !momentValue.isAfter(momentDateValue) && !momentValue.isSame(momentDateValue, 'day'), message || _validationConstants.ERROR_MESSAGES.incorrectValuem);
  };
};

var beforeSameDate = function beforeSameDate(dateOrPath, message) {
  return function (value, values) {
    var dateValue = valueGet(values, dateOrPath);
    if (!value || !dateValue) return null;

    var momentValue = _dateUtils.default.moment(value);

    var momentDateValue = _dateUtils.default.moment(dateValue);

    return errorMessage(!momentValue.isValid() || !momentValue.isBefore(momentDateValue) && !momentValue.isSame(momentDateValue, 'day'), message || _validationConstants.ERROR_MESSAGES.incorrectValue);
  };
};

var _default = {
  afterSameDate: afterSameDate,
  beforeSameDate: beforeSameDate,
  number: number,
  minValue: minValue,
  maxValue: maxValue,
  required: required,
  minDate: minDate,
  maxDate: maxDate,
  date: date,
  time: time
};
exports.default = _default;