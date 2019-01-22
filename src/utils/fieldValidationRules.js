import _ from 'lodash';
import { ERROR_MESSAGES } from '../constants/validationConstants';
import DateUtils from './dateUtils';
import { HANDBOOK_FORMAT } from '../constants/dateConstants';

const global = str => new RegExp(str, 'g');
const RANGES = {
  symbol: 'A-Za-zА-Яа-яЁё',
  number: '0-9',
  symbolOrNumber: 'A-Za-zА-Яа-яЁё0-9',
  latinSymbolOrNumber: 'A-Za-z0-9',
};

const errorMessage = (isInvalid, message) => (isInvalid ? message : null);
const valueGet = (values, valueOrPath) => (
  _.isString(valueOrPath) ? _.get(values, valueOrPath) : valueOrPath
);

const required = value => errorMessage(_.isString(value) ? !_.trim(value, ' ') : _.isEmpty(value) && !_.isNumber(value), 'Пожалуйста, заполните это поле');

const number = (value) => {
  if (!value) return null;

  const range = `[${RANGES.number}\\s]+`;
  const result = _.isNumber(value) ? false : value.replace(global(range), '');

  return errorMessage(
    result.length,
    ERROR_MESSAGES.incorrectValue,
  );
};

const minValue = value => (
  values => (
    errorMessage(values && Number(values) < value, `Минимальное значение - ${value}`)
  )
);

const maxValue = value => (
  values => (
    errorMessage(values && Number(values) > value, `Максимальное значение - ${value}`)
  )
);

const minDate = limitDate => (value) => {
  if (!value || !limitDate) return null;

  const momentLimitDate = DateUtils.moment(limitDate, HANDBOOK_FORMAT);
  const momentValue = DateUtils.moment(value.display);

  return errorMessage(
    !momentValue.isValid() || !momentValue.isSameOrAfter(momentLimitDate),
    ERROR_MESSAGES.incorrectMinDate(momentLimitDate.format(HANDBOOK_FORMAT)),
  );
};

const maxDate = limitDate => (value) => {
  if (!value || !limitDate) return null;

  const momentLimitDate = DateUtils.moment(limitDate, HANDBOOK_FORMAT);
  const momentValue = DateUtils.moment(value.display);

  return errorMessage(
    !momentValue.isValid() || !momentValue.isSameOrBefore(momentLimitDate),
    ERROR_MESSAGES.incorrectMaxDate(momentLimitDate.format(HANDBOOK_FORMAT)),
  );
};

const date = (value) => {
  if (!value) return null;

  const momentValue = DateUtils.moment(value.display);

  return errorMessage(
    !momentValue.isValid(),
    ERROR_MESSAGES.incorrectValue,
  );
};

const time = (value) => {
  if (!value) return null;

  const momentValue = DateUtils.timeToMoment(value);

  return errorMessage(
    !momentValue.isValid(),
    ERROR_MESSAGES.incorrectValue,
  );
};

const afterSameDate = (dateOrPath, message) => (value, values) => {
  const dateValue = valueGet(values, dateOrPath);

  if (!value || !dateValue) return null;

  const momentValue = DateUtils.moment(value.display);
  const momentDateValue = DateUtils.moment(dateValue.display);

  return errorMessage(
    !momentValue.isValid()
    || (!momentValue.isAfter(momentDateValue)
    && !momentValue.isSame(momentDateValue, 'day')),
    message || ERROR_MESSAGES.incorrectValuem,
  );
};

const beforeSameDate = (dateOrPath, message) => (value, values) => {
  const dateValue = valueGet(values, dateOrPath);

  if (!value || !dateValue) return null;

  const momentValue = DateUtils.moment(value);
  const momentDateValue = DateUtils.moment(dateValue);

  return errorMessage(
    !momentValue.isValid()
    || (!momentValue.isBefore(momentDateValue)
    && !momentValue.isSame(momentDateValue, 'day')),
    message || ERROR_MESSAGES.incorrectValue,
  );
};

export default {
  afterSameDate,
  beforeSameDate,
  number,
  minValue,
  maxValue,
  required,
  minDate,
  maxDate,
  date,
  time,
};
