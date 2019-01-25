import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import dynamicUtils from '../utils/dynamicUtils';

const components = ({
  complexFields,
  type,
  formatKey,
  key,
  filedsList,
  other,
  props,
  validation,
  change,
}) => {
  if (!filedsList[type]) return null;

  const textField = complexFields.find(field => field.key === formatKey(key));

  return React.createElement(filedsList[type], {
    ...other,
    ...(props && _.reduce(props, (result, prop) => _.assign(result, prop), {})),
    validation,
    name: formatKey(key),
    textField: textField && textField.observableFields,
    label: key,
    required: validation && validation.required,
    maxLength: validation && validation.maxLength,
    change,
    validate: dynamicUtils.formatValidation(validation, type, formatKey(key)),
  });
};

components.propTypes = {
  complexFields: PropTypes.array,
  type: PropTypes.string,
  formatKey: PropTypes.func,
  key: PropTypes.func,
  filedsList: PropTypes.object,
  other: PropTypes.array,
  props: PropTypes.object,
  validation: PropTypes.object,
  change: PropTypes.func,
};

export default components;
