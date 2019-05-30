import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import { isEqual, get, reduce } from "lodash-es";
import memoize from "memoize-one";
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import formBuilderUtils from "./utils/formBuilderUtils";

var DynamicFormContainer =
/*#__PURE__*/
function (_PureComponent) {
  _inheritsLoose(DynamicFormContainer, _PureComponent);

  function DynamicFormContainer(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this; // Функция адаптации формы для рендера

    _this.formatAdapterScheme = memoize(function (scheme, adapters) {
      return adapters.reduce(function (res, adapter) {
        return adapter(res);
      }, scheme);
    }, isEqual);
    return _this;
  }

  var _proto = DynamicFormContainer.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this$props = this.props,
        scheme = _this$props.scheme,
        initialValues = _this$props.initialValues,
        change = _this$props.change;
    this.applyDefaultValue(scheme, initialValues, change);
  } // Применяет дефолтные значения для полей
  ;

  _proto.applyDefaultValue = function applyDefaultValue() {
    var _this$props2 = this.props,
        initialScheme = _this$props2.scheme,
        specialDefaultValues = _this$props2.specialDefaultValues,
        initialValues = _this$props2.initialValues,
        change = _this$props2.change,
        containersList = _this$props2.containersList;

    function recurseApply(scheme, parentKey) {
      var formatKey = formBuilderUtils.formatByParenKey(parentKey);
      scheme.map(function (_ref) {
        var type = _ref.type,
            key = _ref.key,
            children = _ref.children,
            defaultValue = _ref.defaultValue;

        if (containersList[type]) {
          return recurseApply(children, formatKey(key));
        }

        if (defaultValue && !get(initialValues, formatKey(key), null)) {
          var adaptedValue = reduce(specialDefaultValues.reverse(), function (res, adapter) {
            return adapter(defaultValue, type) || res;
          }, defaultValue);
          change(formatKey(key), adaptedValue);
        }

        return null;
      });
    }

    return recurseApply(initialScheme);
  } // Рендерет форму по схеме ({ scheme, parentKey })
  ;

  _proto.renderSchemeToView = function renderSchemeToView() {
    var _this$props3 = this.props,
        initialScheme = _this$props3.scheme,
        adapters = _this$props3.adapters,
        fieldsList = _this$props3.fieldsList,
        containersList = _this$props3.containersList,
        containersProps = _this$props3.containersProps,
        fieldsProps = _this$props3.fieldsProps,
        validationsRules = _this$props3.validationsRules,
        defaultValidation = _this$props3.defaultValidation; // Функция рендера запоминает контекст и используется в рекурсии

    function renderScheme(params) {
      var scheme = params.scheme,
          parentKey = params.parentKey;
      var formatKey = formBuilderUtils.formatByParenKey(parentKey);
      return scheme.map(function (element) {
        var type = element.type,
            key = element.key,
            options = element.options;

        if (fieldsList[type]) {
          var validation = element.validation,
              other = _objectWithoutPropertiesLoose(element, ["validation"]); //  Рендер компонента


          return React.createElement(fieldsList[type], _extends({}, other, options, fieldsProps, {
            name: formatKey(key),
            validate: formBuilderUtils.defineValidationFunction(formBuilderUtils.composeValidationRules(validation, type, formatKey(key), defaultValidation), validationsRules)
          }));
        }

        if (containersList[type]) {
          //  Рендер контейнера
          return React.createElement(containersList[type], _extends({}, options, containersProps, {
            key: formatKey(key)
          }), renderScheme({
            scheme: element.children,
            parentKey: formatKey(key)
          }));
        } //  Рендер пустого компонента


        return React.createElement("div", null, "\u0422\u0430\u043A\u043E\u0433\u043E \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u0430 \u043D\u0435\u0442");
      });
    }

    return renderScheme({
      scheme: this.formatAdapterScheme(initialScheme, adapters)
    });
  };

  _proto.render = function render() {
    var formWrapper = this.props.formWrapper;
    return React.createElement(formWrapper, null, this.renderSchemeToView());
  };

  return DynamicFormContainer;
}(PureComponent);

DynamicFormContainer.propTypes = {
  // Список компонентов не содержащих в себе другие эдементы
  fieldsList: PropTypes.object.isRequired,
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
  // Объект содержащий в себе все возможные функции валидации,
  // которая должна возвращяать текст ошибки
  validationsRules: PropTypes.object,
  // Объект содержащий дефолтнаые валидации для определенных типов компонентов
  // ключ: навзвание компонента
  // значение: объект с валидациией или функция (name) возвращет объект валидации
  defaultValidation: PropTypes.object,
  containersProps: PropTypes.object,
  fieldsProps: PropTypes.object
};
DynamicFormContainer.defaultProps = {
  initialValues: {},
  containersProps: {},
  fieldsProps: {},
  defaultValidation: {},
  adapters: [],
  formWrapper: "div"
};
export default DynamicFormContainer;