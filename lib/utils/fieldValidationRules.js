"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _validationConstants = require("../constants/validationConstants");

var _dateUtils = _interopRequireDefault(require("./dateUtils"));

var _dateConstants = require("../constants/dateConstants");

const global = str => new RegExp(str, 'g');

const RANGES = {
  symbol: 'A-Za-zА-Яа-яЁё',
  number: '0-9',
  symbolOrNumber: 'A-Za-zА-Яа-яЁё0-9',
  latinSymbolOrNumber: 'A-Za-z0-9'
};

const errorMessage = (isInvalid, message) => isInvalid ? message : null;

const valueGet = (values, valueOrPath) => _lodash.default.isString(valueOrPath) ? _lodash.default.get(values, valueOrPath) : valueOrPath;

const required = value => errorMessage(_lodash.default.isString(value) ? !_lodash.default.trim(value, ' ') : _lodash.default.isEmpty(value) && !_lodash.default.isNumber(value), 'Пожалуйста, заполните это поле');

const number = value => {
  if (!value) return null;
  const range = `[${RANGES.number}\\s]+`;
  const result = _lodash.default.isNumber(value) ? false : value.replace(global(range), '');
  return errorMessage(result.length, _validationConstants.ERROR_MESSAGES.incorrectValue);
};

const minValue = value => values => errorMessage(values && Number(values) < value, `Минимальное значение - ${value}`);

const maxValue = value => values => errorMessage(values && Number(values) > value, `Максимальное значение - ${value}`);

const minDate = limitDate => value => {
  if (!value || !limitDate) return null;

  const momentLimitDate = _dateUtils.default.moment(limitDate, _dateConstants.HANDBOOK_FORMAT);

  const momentValue = _dateUtils.default.moment(value.display);

  return errorMessage(!momentValue.isValid() || !momentValue.isSameOrAfter(momentLimitDate), _validationConstants.ERROR_MESSAGES.incorrectMinDate(momentLimitDate.format(_dateConstants.HANDBOOK_FORMAT)));
};

const maxDate = limitDate => value => {
  if (!value || !limitDate) return null;

  const momentLimitDate = _dateUtils.default.moment(limitDate, _dateConstants.HANDBOOK_FORMAT);

  const momentValue = _dateUtils.default.moment(value.display);

  return errorMessage(!momentValue.isValid() || !momentValue.isSameOrBefore(momentLimitDate), _validationConstants.ERROR_MESSAGES.incorrectMaxDate(momentLimitDate.format(_dateConstants.HANDBOOK_FORMAT)));
};

const date = value => {
  if (!value) return null;

  const momentValue = _dateUtils.default.moment(value.display);

  return errorMessage(!momentValue.isValid(), _validationConstants.ERROR_MESSAGES.incorrectValue);
};

const time = value => {
  if (!value) return null;

  const momentValue = _dateUtils.default.timeToMoment(value);

  return errorMessage(!momentValue.isValid(), _validationConstants.ERROR_MESSAGES.incorrectValue);
};

const afterSameDate = (dateOrPath, message) => (value, values) => {
  const dateValue = valueGet(values, dateOrPath);
  if (!value || !dateValue) return null;

  const momentValue = _dateUtils.default.moment(value.display);

  const momentDateValue = _dateUtils.default.moment(dateValue.display);

  return errorMessage(!momentValue.isValid() || !momentValue.isAfter(momentDateValue) && !momentValue.isSame(momentDateValue, 'day'), message || _validationConstants.ERROR_MESSAGES.incorrectValuem);
};

const beforeSameDate = (dateOrPath, message) => (value, values) => {
  const dateValue = valueGet(values, dateOrPath);
  if (!value || !dateValue) return null;

  const momentValue = _dateUtils.default.moment(value);

  const momentDateValue = _dateUtils.default.moment(dateValue);

  return errorMessage(!momentValue.isValid() || !momentValue.isBefore(momentDateValue) && !momentValue.isSame(momentDateValue, 'day'), message || _validationConstants.ERROR_MESSAGES.incorrectValue);
};

var _default = {
  afterSameDate,
  beforeSameDate,
  number,
  minValue,
  maxValue,
  required,
  minDate,
  maxDate,
  date,
  time
};
exports.default = _default;