import _extends from "@babel/runtime/helpers/esm/extends";
import { isFunction, isArray, isBoolean, map, head, compact, join } from 'lodash-es';
export default {
  composeValidationRules: function composeValidationRules(validation, type, name, defaultValidation) {
    return _extends({}, isFunction(defaultValidation[type]) ? defaultValidation[type](name) : defaultValidation[type], validation);
  },
  defineValidationFunction: function defineValidationFunction(validation, validationsRules) {
    return function (value, allValues, props) {
      if (!validation) return '';
      var errorMessages = map(validation, function (val, key) {
        if (!isFunction(validationsRules[key])) return null;

        if (isBoolean(val)) {
          return val && validationsRules[key](value, allValues, props);
        }

        if (isArray(val)) {
          return validationsRules[key].apply(validationsRules, val)(value, allValues, props);
        }

        return validationsRules[key](val)(value, allValues, props);
      });
      return head(compact(errorMessages));
    };
  },
  formatByParenKey: function formatByParenKey(parentKey) {
    return function createKey(key) {
      return join(compact([parentKey, key]), '__');
    };
  }
};