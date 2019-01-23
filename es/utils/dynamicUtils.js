import _extends from "@babel/runtime/helpers/esm/extends";
import _ from 'lodash';
import DateUtils from './dateUtils';
import { HANDBOOK_FORMAT } from '../constants/dateConstants';
import FieldValidationRules from './fieldValidationRules';
import { ERROR_MESSAGES } from '../constants/validationConstants';

var defineValue = function defineValue(value) {
  if (_.isArray(value) && _.get(_.last(value), 'fileGuid')) {
    return value.map(function (val) {
      return val.fileGuid;
    });
  }

  if (DateUtils.isMoment(value)) {
    return value.format(HANDBOOK_FORMAT);
  }

  if (_.isPlainObject(value)) {
    return _.reduce(value, function (res, subValue, key) {
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
      afterSameDate: [name + ".startDate", ERROR_MESSAGES.incorrectInterval],
      beforeSameDate: [name + ".endDate", ERROR_MESSAGES.incorrectInterval]
    };
  }
};
export default {
  formatValidation: function formatValidation(validation, type, name) {
    return function (value, allValues, props) {
      if (!validation) return '';

      var fullValidation = _extends({}, ADDITIONAL_VALIDATION[type] && ADDITIONAL_VALIDATION[type](name), validation);

      var errorMessages = _.map(fullValidation, function (val, key) {
        if (!_.isFunction(FieldValidationRules[key])) return null;

        if (_.isBoolean(val)) {
          return val && FieldValidationRules[key](value, allValues, props);
        }

        if (_.isArray(val)) {
          return FieldValidationRules[key].apply(FieldValidationRules, val)(value, allValues, props);
        }

        return FieldValidationRules[key](val)(value, allValues, props);
      });

      return _.head(_.compact(errorMessages));
    };
  },
  formatToServer: function formatToServer(data) {
    return _.reduce(data, function (res, value, key) {
      var _Object$assign2;

      return Object.assign(res, (_Object$assign2 = {}, _Object$assign2[key] = defineValue(value), _Object$assign2));
    }, {});
  }
};