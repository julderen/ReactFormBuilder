import _ from 'lodash';
import memoize from 'memoize-one';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateUtils from './utils/dateUtils';
import dynamicUtils from './utils/dynamicUtils';

function applyDefaultValue(components, initialValues, change, CONTAINERS, parentKey) {
  const formatKey = dynamicUtils.formatByParenKey(parentKey);

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

class DynamicFormContainer extends Component {
  constructor(props) {
    super(props);

    this.formatAdapterSheme = memoize((sheme, adapters) => (
      console.log('DynamicFormContainer counter')
      || adapters.reduce((res, adapter) => adapter(res), sheme)
    ));
  }

  componentDidMount() {
    const { sheme, initialValues, change } = this.props;

    applyDefaultValue(sheme, initialValues, change);
  }

  // Рендерет форму по схеме ({ sheme, parentKey })

  renderShemeToView(params) {
    const { sheme, parentKey } = params;
    const { filedsList, containersList, change } = this.props;
    const formatKey = dynamicUtils.formatByParenKey(parentKey);

    return sheme.map((element) => {
      const { type, key, options } = element;

      if (filedsList[type]) {
        const {
          width, props, displayWhen, validation, children, defaultValue, ...other
        } = element;

        return React.createElement(filedsList[type], {
          ...other,
          ...options,
          validation,
          name: formatKey(key),
          change,
          validate: dynamicUtils.formatValidation(validation, type, formatKey(key)),
        });
      }

      if (containersList[type]) {
        return React.createElement(
          containersList[type],
          { ...options, key: formatKey(key), label: key },
          this.formatShemeToView({ ...params, parentKey: formatKey(key) }),
        );
      }

      return <div>Такого компонента нет</div>;
    });
  }

  render() {
    const { formWrapper, sheme, adapters } = this.props;
    const adaptedSheme = this.formatAdapterSheme(sheme, adapters);

    return React.createElement(formWrapper, null, this.formatShemeToView({ sheme: adaptedSheme }));
  }
}

DynamicFormContainer.propTypes = {
  // Список компонентов не содержащих в себе другие эдементы
  filedsList: PropTypes.object.isRequired,
  // Список компонентов содержащие в себе другие эдементы
  containersList: PropTypes.object.isRequired,
  // Функция с 2 параметрами (имя компонента, новое значение)
  change: PropTypes.func.isRequired,
  // Компонент обертка для всей формы
  formWrapper: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  // Схема компонентов
  sheme: PropTypes.array.isRequired,
  adapters: PropTypes.arrayOf(PropTypes.func),
  // Начальные значения для компонентов
  initialValues: PropTypes.object,
};

DynamicFormContainer.defaultProps = {
  initialValues: {},
  adapters: [],
  formWrapper: 'div',
};

export default DynamicFormContainer;
