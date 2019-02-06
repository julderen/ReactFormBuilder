import _ from 'lodash';

export default {
  composeValidationRules(validation, type, name, defaultValidation) {
    return {
      ...(_.isFunction(defaultValidation[type])
        ? defaultValidation[type](name)
        : defaultValidation[type]
      ),
      ...validation,
    };
  },

  defineValidationFunction(validation, validationsRules) {
    return (value, allValues, props) => {
      if (!validation) return '';

      const errorMessages = _.map(validation, (val, key) => {
        if (!_.isFunction(validationsRules[key])) return null;

        if (_.isBoolean(val)) {
          return val && validationsRules[key](value, allValues, props);
        }

        if (_.isArray(val)) {
          return validationsRules[key](...val)(value, allValues, props);
        }

        return validationsRules[key](val)(value, allValues, props);
      });

      return _.head(_.compact(errorMessages));
    };
  },

  formatByParenKey(parentKey) {
    return function createKey(key) {
      return _.join(_.compact([parentKey, key]), '__');
    };
  },
};
