import _extends from "@babel/runtime/helpers/esm/extends";
import { isFunction, isArray, isBoolean, map, head, compact, join } from 'lodash';
export default {
  composeValidationRules(validation, type, name, defaultValidation) {
    return _extends({}, isFunction(defaultValidation[type]) ? defaultValidation[type](name) : defaultValidation && defaultValidation[type], validation);
  },

  defineValidationFunction(validation, validationsRules) {
    return (value, allValues, props) => {
      if (!validation) return '';
      const errorMessages = map(validation, (val, key) => {
        if (!isFunction(validationsRules[key])) return null;

        if (isBoolean(val)) {
          return val && validationsRules[key](value, allValues, props);
        }

        if (isArray(val)) {
          return validationsRules[key](...val)(value, allValues, props);
        }

        return validationsRules[key](val)(value, allValues, props);
      });
      return head(compact(errorMessages));
    };
  },

  formatByParenKey(parentKey) {
    return function createKey(key) {
      return join(compact([parentKey, key]), '__');
    };
  }

};