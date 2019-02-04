import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _ from 'lodash';
import memoize from 'memoize-one';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateUtils from './utils/dateUtils';
import formBuilderUtils from './utils/fromBuilderUtils';

function applyDefaultValue(components, initialValues, change, CONTAINERS, parentKey) {
  const formatKey = formBuilderUtils.formatByParenKey(parentKey);
  components.map(({
    type,
    key,
    children,
    defaultValue
  }) => {
    if (_.includes(CONTAINERS, type)) {
      return applyDefaultValue(children, initialValues, change, formatKey(key));
    }

    if (type === 'DateInterval' && _.isObject(defaultValue) && !_.get(initialValues, formatKey(key), null)) {
      if (defaultValue.startDate === 'NOW') {
        return change(formatKey(key), {
          startDate: {
            display: DateUtils.now(),
            value: DateUtils.now().format()
          }
        });
      }

      if (defaultValue.endDate === 'NOW') {
        return change(formatKey(key), {
          endDate: {
            display: DateUtils.now(),
            value: DateUtils.now().format()
          }
        });
      }
    }

    if (defaultValue && !_.get(initialValues, formatKey(key), null)) {
      switch (defaultValue) {
        case 'NOW':
          change(formatKey(key), {
            display: DateUtils.now(),
            value: DateUtils.now().format()
          });
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
    super(props); // Адаптирует форму для рендера

    this.formatAdapterSheme = memoize((sheme, adapters) => adapters.reduce((res, adapter) => adapter(res), sheme), _.isEqual);
  }

  componentDidMount() {
    const {
      sheme,
      initialValues,
      change
    } = this.props;
    applyDefaultValue(sheme, initialValues, change);
  } // Рендерет форму по схеме ({ sheme, parentKey })


  renderShemeToView(entryParams) {
    const {
      filedsList,
      containersList,
      change
    } = this.props;

    function rednderSheme(params) {
      const {
        sheme,
        parentKey
      } = params;
      const formatKey = formBuilderUtils.formatByParenKey(parentKey);
      return sheme.map(element => {
        const {
          type,
          key,
          options
        } = element;

        if (filedsList[type]) {
          const {
            validation
          } = element,
                other = _objectWithoutPropertiesLoose(element, ["validation"]);

          return React.createElement(filedsList[type], _extends({}, other, options, validation, {
            name: formatKey(key),
            change,
            validate: formBuilderUtils.formatValidation(validation, type, formatKey(key))
          }));
        }

        if (containersList[type]) {
          return React.createElement(containersList[type], _extends({}, options, {
            key: formatKey(key),
            label: key
          }), rednderSheme({
            sheme: element.children,
            parentKey: formatKey(key)
          }));
        }

        return React.createElement("div", null, "\u0422\u0430\u043A\u043E\u0433\u043E \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u0430 \u043D\u0435\u0442");
      });
    }

    return rednderSheme(entryParams);
  }

  render() {
    const {
      formWrapper,
      sheme,
      adapters
    } = this.props;
    const adaptedSheme = this.formatAdapterSheme(sheme, adapters);
    return React.createElement(formWrapper, null, this.renderShemeToView({
      sheme: adaptedSheme
    }));
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
  initialValues: PropTypes.object
};
DynamicFormContainer.defaultProps = {
  initialValues: {},
  adapters: [],
  formWrapper: 'div'
};
export default DynamicFormContainer;