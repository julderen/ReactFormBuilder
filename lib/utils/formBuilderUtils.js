"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _lodash = require("lodash");

var _default = {
  composeValidationRules(validation, type, name, defaultValidation) {
    return (0, _extends2.default)({}, (0, _lodash.isFunction)(defaultValidation[type]) ? defaultValidation[type](name) : defaultValidation[type], validation);
  },

  defineValidationFunction(validation, validationsRules) {
    return (value, allValues, props) => {
      if (!validation) return '';
      const errorMessages = (0, _lodash.map)(validation, (val, key) => {
        if (!(0, _lodash.isFunction)(validationsRules[key])) return null;

        if ((0, _lodash.isBoolean)(val)) {
          return val && validationsRules[key](value, allValues, props);
        }

        if ((0, _lodash.isArray)(val)) {
          return validationsRules[key](...val)(value, allValues, props);
        }

        return validationsRules[key](val)(value, allValues, props);
      });
      return (0, _lodash.head)((0, _lodash.compact)(errorMessages));
    };
  },

  formatByParenKey(parentKey) {
    return function createKey(key) {
      return (0, _lodash.join)((0, _lodash.compact)([parentKey, key]), '__');
    };
  }

};
exports.default = _default;