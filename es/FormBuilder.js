import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _ from 'lodash';
import memoize from 'memoize-one';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formBuilderUtils from './utils/formBuilderUtils';

class DynamicFormContainer extends Component {
  constructor(props) {
    super(props); // Функция адаптации формы для рендера

    this.formatAdapterScheme = memoize((scheme, adapters) => adapters.reduce((res, adapter) => adapter(res), scheme), _.isEqual);
  }

  componentDidMount() {
    const {
      scheme,
      initialValues,
      change
    } = this.props;
    this.applyDefaultValue(scheme, initialValues, change);
  }

  applyDefaultValue() {
    const {
      scheme: initialScheme,
      specialDefaultValues,
      initialValues,
      change,
      containersList
    } = this.props;

    function recursingApplay(scheme, parentKey) {
      const formatKey = formBuilderUtils.formatByParenKey(parentKey);
      scheme.map(({
        type,
        key,
        children,
        defaultValue
      }) => {
        if (containersList[type]) {
          return this.applyDefaultValue(children, initialValues, change, formatKey(key));
        }

        if (defaultValue && !_.get(initialValues, formatKey(key), null)) {
          const adaptedValue = _.reduce(specialDefaultValues.reverse(), (res, adapter) => adapter(defaultValue, type) || res, defaultValue);

          change(formatKey(key), adaptedValue);
        }

        return null;
      });
    }

    return recursingApplay(initialScheme);
  } // Рендерет форму по схеме ({ scheme, parentKey })


  renderSchemeToView() {
    const {
      scheme: initialScheme,
      adapters,
      filedsList,
      containersList,
      containersProps,
      filedsProps
    } = this.props; // Функция рендера запоминает контекст и используется в рекурсии

    function rednderScheme(params) {
      const {
        scheme,
        parentKey
      } = params;
      const formatKey = formBuilderUtils.formatByParenKey(parentKey);
      return scheme.map(element => {
        const {
          type,
          key,
          options
        } = element;

        if (filedsList[type]) {
          const {
            validation
          } = element,
                other = _objectWithoutPropertiesLoose(element, ["validation"]); //  Рендер компонента


          return React.createElement(filedsList[type], _extends({}, other, options, filedsProps, {
            name: formatKey(key),
            validate: formBuilderUtils.formatValidation(validation, type, formatKey(key))
          }));
        }

        if (containersList[type]) {
          //  Рендер контейнера
          return React.createElement(containersList[type], _extends({}, options, containersProps, {
            key: formatKey(key)
          }), rednderScheme({
            scheme: element.children,
            parentKey: formatKey(key)
          }));
        } //  Рендер пустого компонента


        return React.createElement("div", null, "\u0422\u0430\u043A\u043E\u0433\u043E \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u0430 \u043D\u0435\u0442");
      });
    }

    return rednderScheme({
      scheme: this.formatAdapterScheme(initialScheme, adapters)
    });
  }

  render() {
    const {
      formWrapper
    } = this.props;
    return React.createElement(formWrapper, null, this.renderSchemeToView());
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
  scheme: PropTypes.array.isRequired,
  // Массив функций предназанченных для последовательного изменеия схемы (schem)
  adapters: PropTypes.arrayOf(PropTypes.func),
  // Начальные значения для компонентов
  initialValues: PropTypes.object,
  // Массив функций предназанченных для специфичных значений формы
  specialDefaultValues: PropTypes.arrayOf(PropTypes.func),
  //
  containersProps: PropTypes.object,
  filedsProps: PropTypes.object
};
DynamicFormContainer.defaultProps = {
  initialValues: {},
  containersProps: {},
  filedsProps: {},
  adapters: [],
  formWrapper: 'div'
};
export default DynamicFormContainer;