"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _lodash = _interopRequireDefault(require("lodash"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _dateUtils = _interopRequireDefault(require("./utils/dateUtils"));

var _fromBuilderUtils = _interopRequireDefault(require("./utils/fromBuilderUtils"));

function applyDefaultValue(components, initialValues, change, CONTAINERS, parentKey) {
  const formatKey = _fromBuilderUtils.default.formatByParenKey(parentKey);

  components.map(({
    type,
    key,
    children,
    defaultValue
  }) => {
    if (_lodash.default.includes(CONTAINERS, type)) {
      return applyDefaultValue(children, initialValues, change, formatKey(key));
    }

    if (type === 'DateInterval' && _lodash.default.isObject(defaultValue) && !_lodash.default.get(initialValues, formatKey(key), null)) {
      if (defaultValue.startDate === 'NOW') {
        return change(formatKey(key), {
          startDate: {
            display: _dateUtils.default.now(),
            value: _dateUtils.default.now().format()
          }
        });
      }

      if (defaultValue.endDate === 'NOW') {
        return change(formatKey(key), {
          endDate: {
            display: _dateUtils.default.now(),
            value: _dateUtils.default.now().format()
          }
        });
      }
    }

    if (defaultValue && !_lodash.default.get(initialValues, formatKey(key), null)) {
      switch (defaultValue) {
        case 'NOW':
          change(formatKey(key), {
            display: _dateUtils.default.now(),
            value: _dateUtils.default.now().format()
          });
          break;

        case 'TIME_NOW':
          change(formatKey(key), _dateUtils.default.moment().format('HH:mm'));
          break;

        default:
          change(formatKey(key), defaultValue);
      }
    }

    return null;
  });
}

class DynamicFormContainer extends _react.Component {
  constructor(props) {
    super(props); // Адаптирует форму для рендера

    this.formatAdapterSheme = (0, _memoizeOne.default)((sheme, adapters) => adapters.reduce((res, adapter) => adapter(res), sheme), _lodash.default.isEqual);
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

      const formatKey = _fromBuilderUtils.default.formatByParenKey(parentKey);

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
                other = (0, _objectWithoutPropertiesLoose2.default)(element, ["validation"]);
          return _react.default.createElement(filedsList[type], (0, _extends2.default)({}, other, options, validation, {
            name: formatKey(key),
            change,
            validate: _fromBuilderUtils.default.formatValidation(validation, type, formatKey(key))
          }));
        }

        if (containersList[type]) {
          return _react.default.createElement(containersList[type], (0, _extends2.default)({}, options, {
            key: formatKey(key),
            label: key
          }), rednderSheme({
            sheme: element.children,
            parentKey: formatKey(key)
          }));
        }

        return _react.default.createElement("div", null, "\u0422\u0430\u043A\u043E\u0433\u043E \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u0430 \u043D\u0435\u0442");
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
    return _react.default.createElement(formWrapper, null, this.renderShemeToView({
      sheme: adaptedSheme
    }));
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
  sheme: _propTypes.default.array.isRequired,
  adapters: _propTypes.default.arrayOf(_propTypes.default.func),
  // Начальные значения для компонентов
  initialValues: _propTypes.default.object
};
DynamicFormContainer.defaultProps = {
  initialValues: {},
  adapters: [],
  formWrapper: 'div'
};
var _default = DynamicFormContainer;
exports.default = _default;