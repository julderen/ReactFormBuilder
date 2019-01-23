"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _extends3 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _lodash = _interopRequireDefault(require("lodash"));

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _dateUtils = _interopRequireDefault(require("./utils/dateUtils"));

var _statusConstants = require("./constants/statusConstants");

var _dynamicUtils = _interopRequireDefault(require("./utils/dynamicUtils"));

function applyDefaultValue(components, form, initialValues, change, CONTAINERS, parentKey) {
  var formatKey = function formatKey(key) {
    return parentKey ? parentKey + "__" + key : key;
  };

  components.map(function (_ref) {
    var type = _ref.type,
        key = _ref.key,
        children = _ref.children,
        defaultValue = _ref.defaultValue;

    if (_lodash.default.includes(CONTAINERS, type)) {
      return applyDefaultValue(children, form, initialValues, change, formatKey(key));
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

function formatFormToView(components, complexFields, form, change, DynamicComponents, containers, CONTAINERS, parentKey) {
  var formatKey = function formatKey(key) {
    return parentKey ? parentKey + "__" + key : key;
  };

  var Tabs = containers.Tabs,
      Tab = containers.Tab,
      DisplayControls = containers.DisplayControls,
      Row = containers.Row,
      Col = containers.Col,
      ExpandedBlock = containers.ExpandedBlock,
      FormSection = containers.FormSection;

  if (components[0].type === CONTAINERS.tab) {
    return _react.default.createElement(Tabs, {
      id: formatKey(components[0].key)
    }, components.map(function (_ref2) {
      var key = _ref2.key,
          children = _ref2.children,
          displayWhen = _ref2.displayWhen,
          other = (0, _objectWithoutPropertiesLoose2.default)(_ref2, ["key", "children", "displayWhen"]);
      return _react.default.createElement(Tab, (0, _extends3.default)({}, other, {
        eventKey: key,
        key: formatKey(key),
        name: key,
        title: key
      }), _react.default.createElement(DisplayControls, {
        form: form,
        displayWhen: displayWhen
      }, formatFormToView(children, complexFields, form, change, formatKey(key))));
    }));
  }

  return _react.default.createElement(Row, null, components.map(function (_ref3) {
    var type = _ref3.type,
        key = _ref3.key,
        width = _ref3.width,
        props = _ref3.props,
        displayWhen = _ref3.displayWhen,
        validation = _ref3.validation,
        children = _ref3.children,
        defaultValue = _ref3.defaultValue,
        other = (0, _objectWithoutPropertiesLoose2.default)(_ref3, ["type", "key", "width", "props", "displayWhen", "validation", "children", "defaultValue"]);

    switch (type) {
      case CONTAINERS.expandedBlock:
        return _react.default.createElement(Col, {
          key: formatKey(key),
          xs: 12
        }, _react.default.createElement(DisplayControls, {
          form: form,
          displayWhen: displayWhen
        }, _react.default.createElement(ExpandedBlock, {
          key: formatKey(key),
          label: key
        }, formatFormToView(children, complexFields, form, change, formatKey(key)))));

      case CONTAINERS.section:
        return _react.default.createElement(Col, {
          key: formatKey(key),
          xs: width
        }, _react.default.createElement(DisplayControls, {
          form: form,
          displayWhen: displayWhen
        }, _react.default.createElement(FormSection, {
          key: formatKey(key),
          label: key
        }, formatFormToView(children, complexFields, form, change, formatKey(key)))));

      default:
        {
          var textField = complexFields.find(function (field) {
            return field.key === formatKey(key);
          });

          var component = _react.default.createElement(DynamicComponents[type], (0, _extends3.default)({}, other, props && _lodash.default.reduce(props, function (result, prop) {
            return _lodash.default.assign(result, prop);
          }, {}), {
            form: form,
            validation: validation,
            name: formatKey(key),
            textField: textField && textField.observableFields,
            label: key,
            required: validation && validation.required,
            maxLength: validation && validation.maxLength,
            change: change,
            validate: _dynamicUtils.default.formatValidation(validation, type, formatKey(key))
          }));

          return _react.default.createElement(Col, {
            key: formatKey(key),
            xs: width
          }, !displayWhen ? component : _react.default.createElement(DisplayControls, {
            form: form,
            displayWhen: displayWhen
          }, component));
        }
    }
  }));
}

var DynamicFormContainer =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(DynamicFormContainer, _React$Component);

  function DynamicFormContainer() {
    var _this;

    _this = _React$Component.call(this) || this;
    _this.state = {
      status: null
    };
    return _this;
  }

  var _proto = DynamicFormContainer.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this$props = this.props,
        options = _this$props.options,
        formContextValues = _this$props.formContextValues,
        components = _this$props.components,
        initialValues = _this$props.initialValues,
        change = _this$props.change,
        form = _this$props.form;
    applyDefaultValue(components, form, initialValues, change);

    if (options) {
      this.applyOptions({
        options: options,
        formContextValues: formContextValues
      });
    }
  };

  _proto.componentWillReceiveProps = function componentWillReceiveProps(_ref4) {
    var formContextValues = _ref4.formContextValues,
        options = _ref4.options;
    var prevFormContextValues = this.props.formContextValues;

    if (formContextValues && options.repeatQuery && !_lodash.default.isEqual(formContextValues, prevFormContextValues)) {
      this.applyOptions({
        options: options,
        formContextValues: formContextValues
      });
    }
  };

  _proto.mappingField = function mappingField(map, response, initialValues, change) {
    var _this2 = this;

    _lodash.default.map(map, function (name, key) {
      if (_lodash.default.isObject(name)) {
        return _this2.mappingField(name, _lodash.default.get(response, key), initialValues, change);
      }

      if (!_lodash.default.get(initialValues, name, null)) {
        return change(name, _lodash.default.get(response, key));
      }

      return null;
    });
  };

  _proto.applyOptions = function applyOptions(_ref5) {
    var _this3 = this;

    var options = _ref5.options,
        urlConstants = _ref5.urlConstants,
        formContextValues = _ref5.formContextValues;
    var _this$props2 = this.props,
        initialValues = _this$props2.initialValues,
        change = _this$props2.change,
        HandbooksSource = _this$props2.HandbooksSource;
    var alias = options.alias,
        dynamicContext = options.dynamicContext,
        map = options.map,
        source = options.source,
        staticContext = options.staticContext;
    var context = (0, _extends3.default)({}, _lodash.default.reduce(dynamicContext, function (res, value) {
      var _extends2;

      return (0, _extends3.default)({}, res, (_extends2 = {}, _extends2[value] = _lodash.default.get(_this3.context, value, null), _extends2));
    }, {}), staticContext, formContextValues);
    HandbooksSource.getHandbookData(urlConstants[source + "_API_URL"] + "/" + alias, context).loading(function () {
      return _this3.setState({
        status: _statusConstants.STATUS_LOADING
      });
    }).then(function (_ref6) {
      var response = _ref6.response;

      _this3.setState({
        status: null
      });

      _this3.mappingField(map, response, initialValues, change);
    }).catch(function () {
      return _this3.setState({
        status: null
      });
    });
  };

  _proto.render = function render() {
    var _this$props3 = this.props,
        Form = _this$props3.Form,
        footer = _this$props3.footer,
        status = _this$props3.status,
        components = _this$props3.components,
        complexFields = _this$props3.complexFields,
        form = _this$props3.form,
        change = _this$props3.change,
        DynamicComponents = _this$props3.DynamicComponents,
        containers = _this$props3.containers,
        CONTAINERS = _this$props3.CONTAINERS,
        props = (0, _objectWithoutPropertiesLoose2.default)(_this$props3, ["Form", "footer", "status", "components", "complexFields", "form", "change", "DynamicComponents", "containers", "CONTAINERS"]);
    var stateStatus = this.state.status;
    return _react.default.createElement(Form, (0, _extends3.default)({}, props, {
      status: stateStatus || status
    }), formatFormToView(components, complexFields, form, change, DynamicComponents, containers, CONTAINERS), footer);
  };

  return DynamicFormContainer;
}(_react.default.Component);

DynamicFormContainer.propTypes = {
  DynamicComponents: _propTypes.default.object,
  HandbooksSource: _propTypes.default.object,
  Form: _propTypes.default.object,
  complexFields: _propTypes.default.array,
  containers: _propTypes.default.object,
  CONTAINERS: _propTypes.default.array,
  components: _propTypes.default.array,
  options: _propTypes.default.object,
  formContextValues: _propTypes.default.object,
  initialValues: _propTypes.default.object,
  form: _propTypes.default.string.isRequired,
  status: _propTypes.default.string,
  footer: _propTypes.default.node,
  change: _propTypes.default.func.isRequired
};
DynamicFormContainer.contextTypes = {
  attendanceGuid: _propTypes.default.string,
  patientGuid: _propTypes.default.string,
  patient: _propTypes.default.object,
  recordGuids: _propTypes.default.array,
  initialReviewGuid: _propTypes.default.string
};

var mapStateToProps = function mapStateToProps(state, _ref7) {
  var form = _ref7.form,
      options = _ref7.options,
      others = (0, _objectWithoutPropertiesLoose2.default)(_ref7, ["form", "options"]);
  var formContext = options && options.formContext;
  var formContextValues = null;

  if (formContext) {
    var values = _lodash.default.get(state, "form." + form + ".values") || {};
    formContextValues = _lodash.default.reduce(formContext, function (res, value) {
      var _DynamicUtils$formatT;

      return (0, _extends3.default)({}, res, _dynamicUtils.default.formatToServer((_DynamicUtils$formatT = {}, _DynamicUtils$formatT[value] = _lodash.default.get(values, value, ''), _DynamicUtils$formatT)));
    }, {});
  }

  return (0, _extends3.default)({}, others, {
    form: form,
    formContextValues: formContextValues,
    options: options
  });
};

var _default = (0, _reactRedux.connect)(mapStateToProps)(DynamicFormContainer);

exports.default = _default;