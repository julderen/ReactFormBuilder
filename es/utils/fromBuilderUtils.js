import _extends from "@babel/runtime/helpers/esm/extends";
import _ from 'lodash';
import DateUtils from './dateUtils';
import { HANDBOOK_FORMAT } from '../constants/dateConstants';
import FieldValidationRules from './fieldValidationRules';
import { ERROR_MESSAGES } from '../constants/validationConstants';

const defineValue = value => {
  if (_.isArray(value) && _.get(_.last(value), 'fileGuid')) {
    return value.map(val => val.fileGuid);
  }

  if (DateUtils.isMoment(value)) {
    return value.format(HANDBOOK_FORMAT);
  }

  if (_.isPlainObject(value)) {
    return _.reduce(value, (res, subValue, key) => Object.assign(res, {
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
    afterSameDate: [`${name}.startDate`, ERROR_MESSAGES.incorrectInterval],
    beforeSameDate: [`${name}.endDate`, ERROR_MESSAGES.incorrectInterval]
  })
};
export default {
  formatValidation(validation, type, name) {
    return (value, allValues, props) => {
      if (!validation) return '';

      const fullValidation = _extends({}, ADDITIONAL_VALIDATION[type] && ADDITIONAL_VALIDATION[type](name), validation);

      const errorMessages = _.map(fullValidation, (val, key) => {
        if (!_.isFunction(FieldValidationRules[key])) return null;

        if (_.isBoolean(val)) {
          return val && FieldValidationRules[key](value, allValues, props);
        }

        if (_.isArray(val)) {
          return FieldValidationRules[key](...val)(value, allValues, props);
        }

        return FieldValidationRules[key](val)(value, allValues, props);
      });

      return _.head(_.compact(errorMessages));
    };
  },

  formatToServer(data) {
    return _.reduce(data, (res, value, key) => Object.assign(res, {
      [key]: defineValue(value)
    }), {});
  },

  formatByParenKey(parentKey) {
    return function createKey(key) {
      return _.join(_.compact([parentKey, key]), '__');
    };
  }

};