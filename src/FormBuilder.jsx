import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DateUtils from './utils/dateUtils';
import { STATUS_LOADING } from './constants/statusConstants';
import DynamicUtils from './utils/dynamicUtils';

function applyDefaultValue(components, form, initialValues, change, CONTAINERS, parentKey) {
  const formatKey = key => (parentKey ? `${parentKey}__${key}` : key);

  components.map(({
    type, key, children, defaultValue,
  }) => {
    if (_.includes(CONTAINERS, type)) {
      return applyDefaultValue(children, form, initialValues, change, formatKey(key));
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

function formatFormToView(
  components,
  complexFields,
  form,
  change,
  DynamicComponents,
  containers,
  CONTAINERS,
  parentKey,
) {
  const formatKey = key => (parentKey ? `${parentKey}__${key}` : key);
  const {
    Tabs, Tab, DisplayControls, Row, Col, ExpandedBlock, FormSection,
  } = containers;

  if (components[0].type === CONTAINERS.tab) {
    return (
      <Tabs id={formatKey(components[0].key)}>
        {components.map(({
          key, children, displayWhen, ...other
        }) => (
          <Tab {...other} eventKey={key} key={formatKey(key)} name={key} title={key}>
            <DisplayControls form={form} displayWhen={displayWhen}>
              {formatFormToView(children, complexFields, form, change, formatKey(key))}
            </DisplayControls>
          </Tab>
        ))}
      </Tabs>
    );
  }

  return (
    <Row>
      {components.map(
        ({
          type,
          key,
          width,
          props,
          displayWhen,
          validation,
          children,
          defaultValue,
          ...other
        }) => {
          switch (type) {
            case CONTAINERS.expandedBlock:
              return (
                <Col key={formatKey(key)} xs={12}>
                  <DisplayControls form={form} displayWhen={displayWhen}>
                    <ExpandedBlock key={formatKey(key)} label={key}>
                      {formatFormToView(children, complexFields, form, change, formatKey(key))}
                    </ExpandedBlock>
                  </DisplayControls>
                </Col>
              );

            case CONTAINERS.section:
              return (
                <Col key={formatKey(key)} xs={width}>
                  <DisplayControls form={form} displayWhen={displayWhen}>
                    <FormSection key={formatKey(key)} label={key}>
                      {formatFormToView(children, complexFields, form, change, formatKey(key))}
                    </FormSection>
                  </DisplayControls>
                </Col>
              );

            default: {
              const textField = complexFields.find(field => field.key === formatKey(key));

              const component = React.createElement(DynamicComponents[type], {
                ...other,
                ...(props && _.reduce(props, (result, prop) => _.assign(result, prop), {})),
                form,
                validation,
                name: formatKey(key),
                textField: textField && textField.observableFields,
                label: key,
                required: validation && validation.required,
                maxLength: validation && validation.maxLength,
                change,
                validate: DynamicUtils.formatValidation(validation, type, formatKey(key)),
              });

              return (
                <Col key={formatKey(key)} xs={width}>
                  {!displayWhen
                    ? component
                    : React.createElement(DisplayControls, { form, displayWhen }, component)}
                </Col>
              );
            }
          }
        },
      )}
    </Row>
  );
}

class DynamicFormContainer extends Component {
  constructor() {
    super();

    this.state = {
      status: null,
    };
  }

  componentDidMount() {
    const {
      options, formContextValues, components, initialValues, change, form,
    } = this.props;

    applyDefaultValue(components, form, initialValues, change);

    if (options) {
      this.applyOptions({ options, formContextValues });
    }
  }

  componentWillReceiveProps({ formContextValues, options }) {
    const { formContextValues: prevFormContextValues } = this.props;

    if (
      formContextValues
      && options.repeatQuery
      && !_.isEqual(formContextValues, prevFormContextValues)
    ) {
      this.applyOptions({ options, formContextValues });
    }
  }

  mappingField(map, response, initialValues, change) {
    _.map(map, (name, key) => {
      if (_.isObject(name)) {
        return this.mappingField(name, _.get(response, key), initialValues, change);
      }

      if (!_.get(initialValues, name, null)) {
        return change(name, _.get(response, key));
      }

      return null;
    });
  }

  applyOptions({ options, urlConstants, formContextValues }) {
    const { initialValues, change, HandbooksSource } = this.props;
    const {
      alias, dynamicContext, map, source, staticContext,
    } = options;
    const context = {
      ..._.reduce(
        dynamicContext,
        (res, value) => ({ ...res, [value]: _.get(this.context, value, null) }),
        {},
      ),
      ...staticContext,
      ...formContextValues,
    };

    HandbooksSource.getHandbookData(`${urlConstants[`${source}_API_URL`]}/${alias}`, context)
      .loading(() => this.setState({ status: STATUS_LOADING }))
      .then(({ response }) => {
        this.setState({ status: null });

        this.mappingField(map, response, initialValues, change);
      })
      .catch(() => this.setState({ status: null }));
  }

  render() {
    const {
      Form,
      footer,
      status,
      components,
      complexFields,
      form,
      change,
      DynamicComponents,
      containers,
      CONTAINERS,
      ...props
    } = this.props;
    const { status: stateStatus } = this.state;

    return (
      <Form {...props} status={stateStatus || status}>
        {formatFormToView(
          components,
          complexFields,
          form,
          change,
          DynamicComponents,
          containers,
          CONTAINERS,
        )}
        {footer}
      </Form>
    );
  }
}

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
  change: PropTypes.func.isRequired,
};

DynamicFormContainer.contextTypes = {
  attendanceGuid: PropTypes.string,
  patientGuid: PropTypes.string,
  patient: PropTypes.object,
  recordGuids: PropTypes.array,
  initialReviewGuid: PropTypes.string,
};

const mapStateToProps = (state, { form, options, ...others }) => {
  const formContext = options && options.formContext;
  let formContextValues = null;

  if (formContext) {
    const values = _.get(state, `form.${form}.values`) || {};

    formContextValues = _.reduce(
      formContext,
      (res, value) => ({
        ...res,
        ...DynamicUtils.formatToServer({ [value]: _.get(values, value, '') }),
      }),
      {},
    );
  }

  return {
    ...others,
    form,
    formContextValues,
    options,
  };
};

export default connect(mapStateToProps)(DynamicFormContainer);
