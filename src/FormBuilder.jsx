import {
  isEqual, get, reduce,
} from 'lodash';
import memoize from 'memoize-one';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import formBuilderUtils from './utils/formBuilderUtils';

class DynamicFormContainer extends PureComponent {
  constructor(props) {
    super(props);

    // Функция адаптации формы для рендера
    this.formatAdapterScheme = memoize(
      (scheme, adapters) => adapters.reduce((res, adapter) => adapter(res), scheme),
      isEqual,
    );
  }

  componentDidMount() {
    const { scheme, initialValues, change } = this.props;

    this.applyDefaultValue(scheme, initialValues, change);
  }

  // Применяет дефолтные значения для полей

  applyDefaultValue() {
    const {
      scheme: initialScheme,
      specialDefaultValues,
      initialValues,
      change,
      containersList,
    } = this.props;

    function recursingApplay(scheme, parentKey) {
      const formatKey = formBuilderUtils.formatByParenKey(parentKey);

      scheme.map(({
        type, key, children, defaultValue,
      }) => {
        if (containersList[type]) {
          return this.applyDefaultValue(children, initialValues, change, formatKey(key));
        }

        if (defaultValue && !get(initialValues, formatKey(key), null)) {
          const adaptedValue = reduce(
            specialDefaultValues.reverse(),
            (res, adapter) => adapter(defaultValue, type) || res,
            defaultValue,
          );

          change(formatKey(key), adaptedValue);
        }

        return null;
      });
    }

    return recursingApplay(initialScheme);
  }

  // Рендерет форму по схеме ({ scheme, parentKey })

  renderSchemeToView() {
    const {
      scheme: initialScheme,
      adapters,
      filedsList,
      containersList,
      containersProps,
      filedsProps,
      validationsRules,
      defauleValidation,
    } = this.props;

    // Функция рендера запоминает контекст и используется в рекурсии
    function rednderScheme(params) {
      const { scheme, parentKey } = params;
      const formatKey = formBuilderUtils.formatByParenKey(parentKey);

      return scheme.map((element) => {
        const { type, key, options } = element;

        if (filedsList[type]) {
          const { validation, ...other } = element;

          //  Рендер компонента
          return React.createElement(filedsList[type], {
            ...other,
            ...options,
            ...filedsProps,
            name: formatKey(key),
            validate: formBuilderUtils.formatValidation(
              formBuilderUtils.composeValidationRules(validation, defauleValidation),
              validationsRules,
            ),
          });
        }

        if (containersList[type]) {
          //  Рендер контейнера
          return React.createElement(
            containersList[type],
            {
              ...options,
              ...containersProps,
              key: formatKey(key),
            },
            rednderScheme({ scheme: element.children, parentKey: formatKey(key) }),
          );
        }

        //  Рендер пустого компонента
        return <div>Такого компонента нет</div>;
      });
    }

    return rednderScheme({ scheme: this.formatAdapterScheme(initialScheme, adapters) });
  }

  render() {
    const { formWrapper } = this.props;

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
  // Объект содержащий в себе все возможные функции валидации,
  // которая должна возвращяать текст ошибки
  validationsRules: PropTypes.object,
  // Объект содержащий дефолтнаые валидации для определенных типов компонентов
  // ключ: навзвание компонента
  // значение: объект с валидациией или функция (name) возвращет объект валидации
  defauleValidation: PropTypes.object,
  containersProps: PropTypes.object,
  filedsProps: PropTypes.object,
};

DynamicFormContainer.defaultProps = {
  initialValues: {},
  containersProps: {},
  filedsProps: {},
  adapters: [],
  formWrapper: 'div',
};

export default DynamicFormContainer;
