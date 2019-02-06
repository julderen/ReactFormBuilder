"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _lodash = require("lodash");

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _formBuilderUtils = _interopRequireDefault(require("./utils/formBuilderUtils"));

class DynamicFormContainer extends _react.PureComponent {
  constructor(props) {
    super(props); // Функция адаптации формы для рендера

    this.formatAdapterScheme = (0, _memoizeOne.default)((scheme, adapters) => adapters.reduce((res, adapter) => adapter(res), scheme), _lodash.isEqual);
  }

  componentDidMount() {
    const {
      scheme,
      initialValues,
      change
    } = this.props;
    this.applyDefaultValue(scheme, initialValues, change);
  } // Применяет дефолтные значения для полей


  applyDefaultValue() {
    const {
      scheme: initialScheme,
      specialDefaultValues,
      initialValues,
      change,
      containersList
    } = this.props;

    function recursingApplay(scheme, parentKey) {
      const formatKey = _formBuilderUtils.default.formatByParenKey(parentKey);

      scheme.map(({
        type,
        key,
        children,
        defaultValue
      }) => {
        if (containersList[type]) {
          return this.applyDefaultValue(children, initialValues, change, formatKey(key));
        }

        if (defaultValue && !(0, _lodash.get)(initialValues, formatKey(key), null)) {
          const adaptedValue = (0, _lodash.reduce)(specialDefaultValues.reverse(), (res, adapter) => adapter(defaultValue, type) || res, defaultValue);
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
      filedsProps,
      validationsRules,
      defauleValidation
    } = this.props; // Функция рендера запоминает контекст и используется в рекурсии

    function rednderScheme(params) {
      const {
        scheme,
        parentKey
      } = params;

      const formatKey = _formBuilderUtils.default.formatByParenKey(parentKey);

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
                other = (0, _objectWithoutPropertiesLoose2.default)(element, ["validation"]); //  Рендер компонента

          return _react.default.createElement(filedsList[type], (0, _extends2.default)({}, other, options, filedsProps, {
            name: formatKey(key),
            validate: _formBuilderUtils.default.defineValidationFunction(_formBuilderUtils.default.composeValidationRules(validation, type, formatKey(key), defauleValidation), validationsRules)
          }));
        }

        if (containersList[type]) {
          //  Рендер контейнера
          return _react.default.createElement(containersList[type], (0, _extends2.default)({}, options, containersProps, {
            key: formatKey(key)
          }), rednderScheme({
            scheme: element.children,
            parentKey: formatKey(key)
          }));
        } //  Рендер пустого компонента


        return _react.default.createElement("div", null, "\u0422\u0430\u043A\u043E\u0433\u043E \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u0430 \u043D\u0435\u0442");
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
    return _react.default.createElement(formWrapper, null, this.renderSchemeToView());
  }

}

DynamicFormContainer.propTypes = {
  // Список компонентов не содержащих в себе другие эдементы
  filedsList: _propTypes.default.object.isRequired,
  // Список компонентов содержащие в себе другие эдементы
  containersList: _propTypes.default.object.isRequired,
  // Функция с 2 параметрами (имя компонента, новое значение)
  change: _propTypes.default.func.isRequired,
  // Компонент обертка для всей формы
  formWrapper: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.node]),
  // Схема компонентов
  scheme: _propTypes.default.array.isRequired,
  // Массив функций предназанченных для последовательного изменеия схемы (schem)
  adapters: _propTypes.default.arrayOf(_propTypes.default.func),
  // Начальные значения для компонентов
  initialValues: _propTypes.default.object,
  // Массив функций предназанченных для специфичных значений формы
  specialDefaultValues: _propTypes.default.arrayOf(_propTypes.default.func),
  // Объект содержащий в себе все возможные функции валидации,
  // которая должна возвращяать текст ошибки
  validationsRules: _propTypes.default.object,
  // Объект содержащий дефолтнаые валидации для определенных типов компонентов
  // ключ: навзвание компонента
  // значение: объект с валидациией или функция (name) возвращет объект валидации
  defauleValidation: _propTypes.default.object,
  containersProps: _propTypes.default.object,
  filedsProps: _propTypes.default.object
};
DynamicFormContainer.defaultProps = {
  initialValues: {},
  containersProps: {},
  filedsProps: {},
  defauleValidation: {},
  adapters: [],
  formWrapper: 'div'
};
var _default = DynamicFormContainer;
exports.default = _default;