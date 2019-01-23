import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DateUtils from './utils/dateUtils';
import { STATUS_LOADING } from './constants/statusConstants';
import DynamicUtils from './utils/dynamicUtils';

function applyDefaultValue(components, form, initialValues, change, CONTAINERS, parentKey) {
  var formatKey = function formatKey(key) {
    return parentKey ? parentKey + "__" + key : key;
  };

  components.map(function (_ref) {
    var type = _ref.type,
        key = _ref.key,
        children = _ref.children,
        defaultValue = _ref.defaultValue;

    if (_.includes(CONTAINERS, type)) {
      return applyDefaultValue(children, form, initialValues, change, formatKey(key));
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
    return React.createElement(Tabs, {
      id: formatKey(components[0].key)
    }, components.map(function (_ref2) {
      var key = _ref2.key,
          children = _ref2.children,
          displayWhen = _ref2.displayWhen,
          other = _objectWithoutPropertiesLoose(_ref2, ["key", "children", "displayWhen"]);

      return React.createElement(Tab, _extends({}, other, {
        eventKey: key,
        key: formatKey(key),
        name: key,
        title: key
      }), React.createElement(DisplayControls, {
        form: form,
        displayWhen: displayWhen
      }, formatFormToView(children, complexFields, form, change, formatKey(key))));
    }));
  }

  return React.createElement(Row, null, components.map(function (_ref3) {
    var type = _ref3.type,
        key = _ref3.key,
        width = _ref3.width,
        props = _ref3.props,
        displayWhen = _ref3.displayWhen,
        validation = _ref3.validation,
        children = _ref3.children,
        defaultValue = _ref3.defaultValue,
        other = _objectWithoutPropertiesLoose(_ref3, ["type", "key", "width", "props", "displayWhen", "validation", "children", "defaultValue"]);

    switch (type) {
      case CONTAINERS.expandedBlock:
        return React.createElement(Col, {
          key: formatKey(key),
          xs: 12
        }, React.createElement(DisplayControls, {
          form: form,
          displayWhen: displayWhen
        }, React.createElement(ExpandedBlock, {
          key: formatKey(key),
          label: key
        }, formatFormToView(children, complexFields, form, change, formatKey(key)))));

      case CONTAINERS.section:
        return React.createElement(Col, {
          key: formatKey(key),
          xs: width
        }, React.createElement(DisplayControls, {
          form: form,
          displayWhen: displayWhen
        }, React.createElement(FormSection, {
          key: formatKey(key),
          label: key
        }, formatFormToView(children, complexFields, form, change, formatKey(key)))));

      default:
        {
          var textField = complexFields.find(function (field) {
            return field.key === formatKey(key);
          });
          var component = React.createElement(DynamicComponents[type], _extends({}, other, props && _.reduce(props, function (result, prop) {
            return _.assign(result, prop);
          }, {}), {
            form: form,
            validation: validation,
            name: formatKey(key),
            textField: textField && textField.observableFields,
            label: key,
            required: validation && validation.required,
            maxLength: validation && validation.maxLength,
            change: change,
            validate: DynamicUtils.formatValidation(validation, type, formatKey(key))
          }));
          return React.createElement(Col, {
            key: formatKey(key),
            xs: width
          }, !displayWhen ? component : React.createElement(DisplayControls, {
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
  _inheritsLoose(DynamicFormContainer, _React$Component);

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

    if (formContextValues && options.repeatQuery && !_.isEqual(formContextValues, prevFormContextValues)) {
      this.applyOptions({
        options: options,
        formContextValues: formContextValues
      });
    }
  };

  _proto.mappingField = function mappingField(map, response, initialValues, change) {
    var _this2 = this;

    _.map(map, function (name, key) {
      if (_.isObject(name)) {
        return _this2.mappingField(name, _.get(response, key), initialValues, change);
      }

      if (!_.get(initialValues, name, null)) {
        return change(name, _.get(response, key));
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

    var context = _extends({}, _.reduce(dynamicContext, function (res, value) {
      var _extends2;

      return _extends({}, res, (_extends2 = {}, _extends2[value] = _.get(_this3.context, value, null), _extends2));
    }, {}), staticContext, formContextValues);

    HandbooksSource.getHandbookData(urlConstants[source + "_API_URL"] + "/" + alias, context).loading(function () {
      return _this3.setState({
        status: STATUS_LOADING
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
        props = _objectWithoutPropertiesLoose(_this$props3, ["Form", "footer", "status", "components", "complexFields", "form", "change", "DynamicComponents", "containers", "CONTAINERS"]);

    var stateStatus = this.state.status;
    return React.createElement(Form, _extends({}, props, {
      status: stateStatus || status
    }), formatFormToView(components, complexFields, form, change, DynamicComponents, containers, CONTAINERS), footer);
  };

  return DynamicFormContainer;
}(React.Component);

DynamicFormContainer.propTypes = {
  DynamicComponents: PropTypes.object,
  HandbooksSource: PropTypes.object,
  Form: PropTypes.object,
  complexFields: PropTypes.array,
  containers: PropTypes.object,
  CONTAINERS: PropTypes.array,
  components: PropTypes.array,
  options: PropTypes.object,
  formContextValues: PropTypes.object,
  initialValues: PropTypes.object,
  form: PropTypes.string.isRequired,
  status: PropTypes.string,
  footer: PropTypes.node,
  change: PropTypes.func.isRequired
};
DynamicFormContainer.contextTypes = {
  attendanceGuid: PropTypes.string,
  patientGuid: PropTypes.string,
  patient: PropTypes.object,
  recordGuids: PropTypes.array,
  initialReviewGuid: PropTypes.string
};

var mapStateToProps = function mapStateToProps(state, _ref7) {
  var form = _ref7.form,
      options = _ref7.options,
      others = _objectWithoutPropertiesLoose(_ref7, ["form", "options"]);

  var formContext = options && options.formContext;
  var formContextValues = null;

  if (formContext) {
    var values = _.get(state, "form." + form + ".values") || {};
    formContextValues = _.reduce(formContext, function (res, value) {
      var _DynamicUtils$formatT;

      return _extends({}, res, DynamicUtils.formatToServer((_DynamicUtils$formatT = {}, _DynamicUtils$formatT[value] = _.get(values, value, ''), _DynamicUtils$formatT)));
    }, {});
  }

  return _extends({}, others, {
    form: form,
    formContextValues: formContextValues,
    options: options
  });
};

export default connect(mapStateToProps)(DynamicFormContainer);