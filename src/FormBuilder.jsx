import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateUtils from './utils/dateUtils';
import Components from './components/components';
import Containers from './components/containers';

function applyDefaultValue(components, initialValues, change, CONTAINERS, parentKey) {
  const formatKey = key => (parentKey ? `${parentKey}__${key}` : key);

  components.map(({
    type, key, children, defaultValue,
  }) => {
    if (_.includes(CONTAINERS, type)) {
      return applyDefaultValue(children, initialValues, change, formatKey(key));
    }

    if (
      type === 'DateInterval'
      && _.isObject(defaultValue)
      && !_.get(initialValues, formatKey(key), null)
    ) {
      if (defaultValue.startDate === 'NOW') {
        return change(formatKey(key), {
          startDate: { display: DateUtils.now(), value: DateUtils.now().format() },
        });
      }

      if (defaultValue.endDate === 'NOW') {
        return change(formatKey(key), {
          endDate: { display: DateUtils.now(), value: DateUtils.now().format() },
        });
      }
    }

    if (defaultValue && !_.get(initialValues, formatKey(key), null)) {
      switch (defaultValue) {
        case 'NOW':
          change(formatKey(key), { display: DateUtils.now(), value: DateUtils.now().format() });
          break;
        case 'TIME_NOW':
          change(formatKey(key), DateUtils.moment().format('HH:mm'));
          break;
        default:
          change(formatKey(key), defaultValue);
      }
    }

    return null;
  });
}

function formatFormToView(
  components,
  complexFields,
  change,
  filedsList,
  containersList,
  parentKey,
) {
  const formatKey = key => (parentKey ? `${parentKey}__${key}` : key);

  return components.map(
    ({
      type, key, width, props, displayWhen, validation, children, defaultValue, ...other
    }) => (
      <Containers
        {...other}
        containersList={containersList}
        key={key}
        formatKey={formatKey}
        callBack={formatFormToView}
        complexFields={complexFields}
        change={change}
      />
    ) || (
    <Components
      complexFields={complexFields}
      formatKey={formatKey}
      key={key}
      filedsList={filedsList}
      change={change}
    />
    ) || <div>Такого компонента нет</div>,
  );
}

class DynamicFormContainer extends Component {
  componentDidMount() {
    const {
      components, initialValues, change,
    } = this.props;

    applyDefaultValue(components, initialValues, change);
  }

  mappingField(map, response, initialValues, change) {
    _.map(map, (name, key) => {
      if (_.isObject(name)) {
        return this.mappingField(name, _.get(response, key), initialValues, change);
      }

      if (!_.get(initialValues, name, null)) {
        return change(name, _.get(response, key));
      }

      return null;
    });
  }

  render() {
    const {
      components,
      complexFields,
      change,
      filedsList,
      containersList,
    } = this.props;

    return formatFormToView(components, complexFields, change, filedsList, containersList);
  }
}
/*
  Список компонетов
  Список контейнеров
  Валидация кастомная
  Обретка для формы
*/

DynamicFormContainer.propTypes = {
  filedsList: PropTypes.object.isRequired,
  // Список компонентов не содержащих в себе другие эдементы
  containersList: PropTypes.object.isRequired,
  // Список компонентов содержащие в себе другие эдементы
  change: PropTypes.func.isRequired, // Функция с 2 параметрами (имя компонента, новое значение)
  complexFields: PropTypes.array,
  components: PropTypes.array,
  initialValues: PropTypes.object,
};

DynamicFormContainer.defaultProps = {
};

export default DynamicFormContainer;
