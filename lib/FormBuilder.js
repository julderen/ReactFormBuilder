"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _lodashEs = require("lodash-es");

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _formBuilderUtils = _interopRequireDefault(require("./utils/formBuilderUtils"));

var DynamicFormContainer =
/*#__PURE__*/
function (_PureComponent) {
  (0, _inheritsLoose2.default)(DynamicFormContainer, _PureComponent);

  function DynamicFormContainer(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this; // Функция адаптации формы для рендера

    _this.formatAdapterScheme = (0, _memoizeOne.default)(function (scheme, adapters) {
      return adapters.reduce(function (res, adapter) {
        return adapter(res);
      }, scheme);
    }, _lodashEs.isEqual);
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

    function recursingApplay(scheme, parentKey) {
      var _this2 = this;

      var formatKey = _formBuilderUtils.default.formatByParenKey(parentKey);

      scheme.map(function (_ref) {
        var type = _ref.type,
            key = _ref.key,
            children = _ref.children,
            defaultValue = _ref.defaultValue;

        if (containersList[type]) {
          return _this2.applyDefaultValue(children, initialValues, change, formatKey(key));
        }

        if (defaultValue && !(0, _lodashEs.get)(initialValues, formatKey(key), null)) {
          var adaptedValue = (0, _lodashEs.reduce)(specialDefaultValues.reverse(), function (res, adapter) {
            return adapter(defaultValue, type) || res;
          }, defaultValue);
          change(formatKey(key), adaptedValue);
        }

        return null;
      });
    }

    return recursingApplay(initialScheme);
  } // Рендерет форму по схеме ({ scheme, parentKey })
  ;

  _proto.renderSchemeToView = function renderSchemeToView() {
    var _this$props3 = this.props,
        initialScheme = _this$props3.scheme,
        adapters = _this$props3.adapters,
        filedsList = _this$props3.filedsList,
        containersList = _this$props3.containersList,
        containersProps = _this$props3.containersProps,
        filedsProps = _this$props3.filedsProps,
        validationsRules = _this$props3.validationsRules,
        defauleValidation = _this$props3.defauleValidation; // Функция рендера запоминает контекст и используется в рекурсии

    function rednderScheme(params) {
      var scheme = params.scheme,
          parentKey = params.parentKey;

      var formatKey = _formBuilderUtils.default.formatByParenKey(parentKey);

      return scheme.map(function (element) {
        var type = element.type,
            key = element.key,
            options = element.options;

        if (filedsList[type]) {
          var validation = element.validation,
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
  };

  _proto.render = function render() {
    var formWrapper = this.props.formWrapper;
    return _react.default.createElement(formWrapper, null, this.renderSchemeToView());
  };

  return DynamicFormContainer;
}(_react.PureComponent);

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