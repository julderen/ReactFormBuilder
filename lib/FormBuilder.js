"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _lodash = _interopRequireDefault(require("lodash"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _dateUtils = _interopRequireDefault(require("./utils/dateUtils"));

var _components = _interopRequireDefault(require("./components/components"));

var _containers = _interopRequireDefault(require("./components/containers"));

function applyDefaultValue(components, initialValues, change, CONTAINERS, parentKey) {
  const formatKey = key => parentKey ? `${parentKey}__${key}` : key;

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

function formatFormToView(components, complexFields, change, filedsList, containersList, parentKey) {
  const formatKey = key => parentKey ? `${parentKey}__${key}` : key;

  return components.map((_ref) => {
    let {
      key
    } = _ref,
        other = (0, _objectWithoutPropertiesLoose2.default)(_ref, ["type", "key", "width", "props", "displayWhen", "validation", "children", "defaultValue"]);
    return _react.default.createElement(_containers.default, (0, _extends2.default)({}, other, {
      containersList: containersList,
      key: key,
      formatKey: formatKey,
      callBack: formatFormToView,
      complexFields: complexFields,
      change: change
    })) || _react.default.createElement(_components.default, {
      complexFields: complexFields,
      formatKey: formatKey,
      key: key,
      filedsList: filedsList,
      change: change
    }) || _react.default.createElement("div", null, "\u0422\u0430\u043A\u043E\u0433\u043E \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u0430 \u043D\u0435\u0442");
  });
}

class DynamicFormContainer extends _react.Component {
  componentDidMount() {
    const {
      components,
      initialValues,
      change
    } = this.props;
    applyDefaultValue(components, initialValues, change);
  }

  mappingField(map, response, initialValues, change) {
    _lodash.default.map(map, (name, key) => {
      if (_lodash.default.isObject(name)) {
        return this.mappingField(name, _lodash.default.get(response, key), initialValues, change);
      }

      if (!_lodash.default.get(initialValues, name, null)) {
        return change(name, _lodash.default.get(response, key));
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
      containersList
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
  filedsList: _propTypes.default.object.isRequired,
  // Список компонентов не содержащих в себе другие эдементы
  containersList: _propTypes.default.object.isRequired,
  // Список компонентов содержащие в себе другие эдементы
  change: _propTypes.default.func.isRequired,
  // Функция с 2 параметрами (имя компонента, новое значение)
  complexFields: _propTypes.default.array,
  components: _propTypes.default.array,
  initialValues: _propTypes.default.object
};
DynamicFormContainer.defaultProps = {};
var _default = DynamicFormContainer;
exports.default = _default;