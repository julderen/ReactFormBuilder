import React from 'react';
import PropTypes from 'prop-types';

const containers = ({
  containersList,
  key,
  type,
  formatKey,
  callBack,
  children,
  complexFields,
  change
}) => {
  if (!containersList[type]) return null;
  return React.createElement(containersList[type], {
    key: formatKey(key),
    label: key
  }, callBack(children, complexFields, change, formatKey(key)));
};

containers.propTypes = {
  type: PropTypes.string,
  containersList: PropTypes.object,
  key: PropTypes.string,
  formatKey: PropTypes.func,
  callBack: PropTypes.func,
  children: PropTypes.array,
  complexFields: PropTypes.object,
  change: PropTypes.func
};
export default containers;