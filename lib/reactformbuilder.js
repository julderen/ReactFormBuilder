'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _ = _interopDefault(require('lodash'));
var React = require('react');
var React__default = _interopDefault(React);
var reactRedux = require('react-redux');
var PropTypes = _interopDefault(require('prop-types'));
var moment = _interopDefault(require('moment'));

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

//! moment.js locale configuration

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' && typeof require === 'function' ? factory(require('../moment')) : typeof define === 'function' && define.amd ? define(['../moment'], factory) : factory(global.moment);
})(undefined, function (moment$$1) {

  function plural(word, num) {
    var forms = word.split('_');
    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2];
  }

  function relativeTimeWithPlural(number, withoutSuffix, key) {
    var format = {
      'ss': withoutSuffix ? 'секунда_секунды_секунд' : 'секунду_секунды_секунд',
      'mm': withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
      'hh': 'час_часа_часов',
      'dd': 'день_дня_дней',
      'MM': 'месяц_месяца_месяцев',
      'yy': 'год_года_лет'
    };

    if (key === 'm') {
      return withoutSuffix ? 'минута' : 'минуту';
    } else {
      return number + ' ' + plural(format[key], +number);
    }
  }

  var monthsParse = [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[йя]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i]; // http://new.gramota.ru/spravka/rules/139-prop : § 103
  // Сокращения месяцев: http://new.gramota.ru/spravka/buro/search-answer?s=242637
  // CLDR data:          http://www.unicode.org/cldr/charts/28/summary/ru.html#1753

  var ru = moment$$1.defineLocale('ru', {
    months: {
      format: 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_'),
      standalone: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_')
    },
    monthsShort: {
      // по CLDR именно "июл." и "июн.", но какой смысл менять букву на точку ?
      format: 'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'.split('_'),
      standalone: 'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split('_')
    },
    weekdays: {
      standalone: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
      format: 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_'),
      isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/
    },
    weekdaysShort: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
    weekdaysMin: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
    monthsParse: monthsParse,
    longMonthsParse: monthsParse,
    shortMonthsParse: monthsParse,
    // полные названия с падежами, по три буквы, для некоторых, по 4 буквы, сокращения с точкой и без точки
    monthsRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,
    // копия предыдущего
    monthsShortRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,
    // полные названия с падежами
    monthsStrictRegex: /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,
    // Выражение, которое соотвествует только сокращённым формам
    monthsShortStrictRegex: /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
    longDateFormat: {
      LT: 'H:mm',
      LTS: 'H:mm:ss',
      L: 'DD.MM.YYYY',
      LL: 'D MMMM YYYY г.',
      LLL: 'D MMMM YYYY г., H:mm',
      LLLL: 'dddd, D MMMM YYYY г., H:mm'
    },
    calendar: {
      sameDay: '[Сегодня, в] LT',
      nextDay: '[Завтра, в] LT',
      lastDay: '[Вчера, в] LT',
      nextWeek: function (now) {
        if (now.week() !== this.week()) {
          switch (this.day()) {
            case 0:
              return '[В следующее] dddd, [в] LT';

            case 1:
            case 2:
            case 4:
              return '[В следующий] dddd, [в] LT';

            case 3:
            case 5:
            case 6:
              return '[В следующую] dddd, [в] LT';
          }
        } else {
          if (this.day() === 2) {
            return '[Во] dddd, [в] LT';
          } else {
            return '[В] dddd, [в] LT';
          }
        }
      },
      lastWeek: function (now) {
        if (now.week() !== this.week()) {
          switch (this.day()) {
            case 0:
              return '[В прошлое] dddd, [в] LT';

            case 1:
            case 2:
            case 4:
              return '[В прошлый] dddd, [в] LT';

            case 3:
            case 5:
            case 6:
              return '[В прошлую] dddd, [в] LT';
          }
        } else {
          if (this.day() === 2) {
            return '[Во] dddd, [в] LT';
          } else {
            return '[В] dddd, [в] LT';
          }
        }
      },
      sameElse: 'L'
    },
    relativeTime: {
      future: 'через %s',
      past: '%s назад',
      s: 'несколько секунд',
      ss: relativeTimeWithPlural,
      m: relativeTimeWithPlural,
      mm: relativeTimeWithPlural,
      h: 'час',
      hh: relativeTimeWithPlural,
      d: 'день',
      dd: relativeTimeWithPlural,
      M: 'месяц',
      MM: relativeTimeWithPlural,
      y: 'год',
      yy: relativeTimeWithPlural
    },
    meridiemParse: /ночи|утра|дня|вечера/i,
    isPM: function (input) {
      return /^(дня|вечера)$/.test(input);
    },
    meridiem: function (hour, minute, isLower) {
      if (hour < 4) {
        return 'ночи';
      } else if (hour < 12) {
        return 'утра';
      } else if (hour < 17) {
        return 'дня';
      } else {
        return 'вечера';
      }
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(й|го|я)/,
    ordinal: function (number, period) {
      switch (period) {
        case 'M':
        case 'd':
        case 'DDD':
          return number + '-й';

        case 'D':
          return number + '-го';

        case 'w':
        case 'W':
          return number + '-я';

        default:
          return number;
      }
    },
    week: {
      dow: 1,
      // Monday is the first day of the week.
      doy: 4 // The week that contains Jan 4th is the first week of the year.

    }
  });
  return ru;
});

var SERVER_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';
var HANDBOOK_FORMAT = 'DD.MM.YYYY';

var DateUtils = {
  utcOffset: moment().utcOffset(),
  isMoment: moment.isMoment,
  moment: moment,
  now: function now() {
    return moment().startOf('day');
  },
  serverDate: function serverDate() {
    return moment.utc().format(SERVER_FORMAT);
  },
  toMoment: function toMoment(date, isServer) {
    var momentDate = this.isMoment(date) ? date : moment(date);
    return isServer ? momentDate.subtract(this.utcOffset, 'm') : momentDate.add(this.utcOffset, 'm');
  },
  toServer: function toServer(date) {
    return this.moment(date).format(SERVER_FORMAT);
  },
  toClient: function toClient(date, format) {
    return this.toMoment(date).format(format);
  },
  timeToMoment: function timeToMoment(time) {
    if (!time) return this.moment();

    var _time$split = time.split(':'),
        _time$split2 = _slicedToArray(_time$split, 2),
        hours = _time$split2[0],
        minutes = _time$split2[1];

    return this.moment({
      hours: hours,
      minutes: minutes
    });
  },
  isLastDay: function isLastDay(date) {
    var now = this.moment();
    return !now.isSame(date, 'day') && now.isAfter(date);
  },
  clientTimezone: function clientTimezone() {
    return new Date().getTimezoneOffset();
  },
  toServerTimeInterval: function toServerTimeInterval(startDate, endDate) {
    return {
      startDate: this.toServer(startDate),
      endDate: this.toServer(endDate.add(1, 'day').startOf('day'))
    };
  }
};

var STATUS_LOADING = 'STATUS_LOADING';

var ERROR_MESSAGES = {
  incorrectFormat: 'Некорректный формат',
  incorrectValue: 'Некорректное значение',
  incorrectInterval: 'Некорректный интервал',
  incorrectMinDate: function incorrectMinDate(date) {
    return "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0434\u0430\u0442\u0430 ".concat(date);
  },
  incorrectMaxDate: function incorrectMaxDate(date) {
    return "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0434\u0430\u0442\u0430 ".concat(date);
  }
};

var global = function global(str) {
  return new RegExp(str, 'g');
};

var RANGES = {
  symbol: 'A-Za-zА-Яа-яЁё',
  number: '0-9',
  symbolOrNumber: 'A-Za-zА-Яа-яЁё0-9',
  latinSymbolOrNumber: 'A-Za-z0-9'
};

var errorMessage = function errorMessage(isInvalid, message) {
  return isInvalid ? message : null;
};

var valueGet = function valueGet(values, valueOrPath) {
  return _.isString(valueOrPath) ? _.get(values, valueOrPath) : valueOrPath;
};

var required = function required(value) {
  return errorMessage(_.isString(value) ? !_.trim(value, ' ') : _.isEmpty(value) && !_.isNumber(value), 'Пожалуйста, заполните это поле');
};

var number = function number(value) {
  if (!value) return null;
  var range = "[".concat(RANGES.number, "\\s]+");
  var result = _.isNumber(value) ? false : value.replace(global(range), '');
  return errorMessage(result.length, ERROR_MESSAGES.incorrectValue);
};

var minValue = function minValue(value) {
  return function (values) {
    return errorMessage(values && Number(values) < value, "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 - ".concat(value));
  };
};

var maxValue = function maxValue(value) {
  return function (values) {
    return errorMessage(values && Number(values) > value, "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 - ".concat(value));
  };
};

var minDate = function minDate(limitDate) {
  return function (value) {
    if (!value || !limitDate) return null;
    var momentLimitDate = DateUtils.moment(limitDate, HANDBOOK_FORMAT);
    var momentValue = DateUtils.moment(value.display);
    return errorMessage(!momentValue.isValid() || !momentValue.isSameOrAfter(momentLimitDate), ERROR_MESSAGES.incorrectMinDate(momentLimitDate.format(HANDBOOK_FORMAT)));
  };
};

var maxDate = function maxDate(limitDate) {
  return function (value) {
    if (!value || !limitDate) return null;
    var momentLimitDate = DateUtils.moment(limitDate, HANDBOOK_FORMAT);
    var momentValue = DateUtils.moment(value.display);
    return errorMessage(!momentValue.isValid() || !momentValue.isSameOrBefore(momentLimitDate), ERROR_MESSAGES.incorrectMaxDate(momentLimitDate.format(HANDBOOK_FORMAT)));
  };
};

var date = function date(value) {
  if (!value) return null;
  var momentValue = DateUtils.moment(value.display);
  return errorMessage(!momentValue.isValid(), ERROR_MESSAGES.incorrectValue);
};

var time = function time(value) {
  if (!value) return null;
  var momentValue = DateUtils.timeToMoment(value);
  return errorMessage(!momentValue.isValid(), ERROR_MESSAGES.incorrectValue);
};

var afterSameDate = function afterSameDate(dateOrPath, message) {
  return function (value, values) {
    var dateValue = valueGet(values, dateOrPath);
    if (!value || !dateValue) return null;
    var momentValue = DateUtils.moment(value.display);
    var momentDateValue = DateUtils.moment(dateValue.display);
    return errorMessage(!momentValue.isValid() || !momentValue.isAfter(momentDateValue) && !momentValue.isSame(momentDateValue, 'day'), message || ERROR_MESSAGES.incorrectValuem);
  };
};

var beforeSameDate = function beforeSameDate(dateOrPath, message) {
  return function (value, values) {
    var dateValue = valueGet(values, dateOrPath);
    if (!value || !dateValue) return null;
    var momentValue = DateUtils.moment(value);
    var momentDateValue = DateUtils.moment(dateValue);
    return errorMessage(!momentValue.isValid() || !momentValue.isBefore(momentDateValue) && !momentValue.isSame(momentDateValue, 'day'), message || ERROR_MESSAGES.incorrectValue);
  };
};

var FieldValidationRules = {
  afterSameDate: afterSameDate,
  beforeSameDate: beforeSameDate,
  number: number,
  minValue: minValue,
  maxValue: maxValue,
  required: required,
  minDate: minDate,
  maxDate: maxDate,
  date: date,
  time: time
};

var defineValue = function defineValue(value) {
  if (_.isArray(value) && _.get(_.last(value), 'fileGuid')) {
    return value.map(function (val) {
      return val.fileGuid;
    });
  }

  if (DateUtils.isMoment(value)) {
    return value.format(HANDBOOK_FORMAT);
  }

  if (_.isPlainObject(value)) {
    return _.reduce(value, function (res, subValue, key) {
      return Object.assign(res, _defineProperty({}, key, defineValue(subValue)));
    }, {});
  }

  return value;
};

var ADDITIONAL_VALIDATION = {
  DatePicker: function DatePicker() {
    return {
      date: true
    };
  },
  TimePicker: function TimePicker() {
    return {
      time: true
    };
  },
  DateInterval: function DateInterval(name) {
    return {
      date: true,
      afterSameDate: ["".concat(name, ".startDate"), ERROR_MESSAGES.incorrectInterval],
      beforeSameDate: ["".concat(name, ".endDate"), ERROR_MESSAGES.incorrectInterval]
    };
  }
};
var DynamicUtils = {
  formatValidation: function formatValidation(validation, type, name) {
    return function (value, allValues, props) {
      if (!validation) return '';

      var fullValidation = _objectSpread({}, ADDITIONAL_VALIDATION[type] && ADDITIONAL_VALIDATION[type](name), validation);

      var errorMessages = _.map(fullValidation, function (val, key) {
        if (!_.isFunction(FieldValidationRules[key])) return null;

        if (_.isBoolean(val)) {
          return val && FieldValidationRules[key](value, allValues, props);
        }

        if (_.isArray(val)) {
          return FieldValidationRules[key].apply(FieldValidationRules, _toConsumableArray(val))(value, allValues, props);
        }

        return FieldValidationRules[key](val)(value, allValues, props);
      });

      return _.head(_.compact(errorMessages));
    };
  },
  formatToServer: function formatToServer(data) {
    return _.reduce(data, function (res, value, key) {
      return Object.assign(res, _defineProperty({}, key, defineValue(value)));
    }, {});
  }
};

function applyDefaultValue(components, form, initialValues, change, CONTAINERS, parentKey) {
  var formatKey = function formatKey(key) {
    return parentKey ? "".concat(parentKey, "__").concat(key) : key;
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
    return parentKey ? "".concat(parentKey, "__").concat(key) : key;
  };

  var Tabs = containers.Tabs,
      Tab = containers.Tab,
      DisplayControls = containers.DisplayControls,
      Row = containers.Row,
      Col = containers.Col,
      ExpandedBlock = containers.ExpandedBlock,
      FormSection = containers.FormSection;

  if (components[0].type === CONTAINERS.tab) {
    return React__default.createElement(Tabs, {
      id: formatKey(components[0].key)
    }, components.map(function (_ref2) {
      var key = _ref2.key,
          children = _ref2.children,
          displayWhen = _ref2.displayWhen,
          other = _objectWithoutProperties(_ref2, ["key", "children", "displayWhen"]);

      return React__default.createElement(Tab, _extends({}, other, {
        eventKey: key,
        key: formatKey(key),
        name: key,
        title: key
      }), React__default.createElement(DisplayControls, {
        form: form,
        displayWhen: displayWhen
      }, formatFormToView(children, complexFields, form, change, formatKey(key))));
    }));
  }

  return React__default.createElement(Row, null, components.map(function (_ref3) {
    var type = _ref3.type,
        key = _ref3.key,
        width = _ref3.width,
        props = _ref3.props,
        displayWhen = _ref3.displayWhen,
        validation = _ref3.validation,
        children = _ref3.children,
        defaultValue = _ref3.defaultValue,
        other = _objectWithoutProperties(_ref3, ["type", "key", "width", "props", "displayWhen", "validation", "children", "defaultValue"]);

    switch (type) {
      case CONTAINERS.expandedBlock:
        return React__default.createElement(Col, {
          key: formatKey(key),
          xs: 12
        }, React__default.createElement(DisplayControls, {
          form: form,
          displayWhen: displayWhen
        }, React__default.createElement(ExpandedBlock, {
          key: formatKey(key),
          label: key
        }, formatFormToView(children, complexFields, form, change, formatKey(key)))));

      case CONTAINERS.section:
        return React__default.createElement(Col, {
          key: formatKey(key),
          xs: width
        }, React__default.createElement(DisplayControls, {
          form: form,
          displayWhen: displayWhen
        }, React__default.createElement(FormSection, {
          key: formatKey(key),
          label: key
        }, formatFormToView(children, complexFields, form, change, formatKey(key)))));

      default:
        {
          var textField = complexFields.find(function (field) {
            return field.key === formatKey(key);
          });
          var component = React__default.createElement(DynamicComponents[type], _objectSpread({}, other, props && _.reduce(props, function (result, prop) {
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
          return React__default.createElement(Col, {
            key: formatKey(key),
            xs: width
          }, !displayWhen ? component : React__default.createElement(DisplayControls, {
            form: form,
            displayWhen: displayWhen
          }, component));
        }
    }
  }));
}

var DynamicFormContainer =
/*#__PURE__*/
function (_Component) {
  _inherits(DynamicFormContainer, _Component);

  function DynamicFormContainer() {
    var _this;

    _classCallCheck(this, DynamicFormContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DynamicFormContainer).call(this));
    _this.state = {
      status: null
    };
    return _this;
  }

  _createClass(DynamicFormContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
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
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(_ref4) {
      var formContextValues = _ref4.formContextValues,
          options = _ref4.options;
      var prevFormContextValues = this.props.formContextValues;

      if (formContextValues && options.repeatQuery && !_.isEqual(formContextValues, prevFormContextValues)) {
        this.applyOptions({
          options: options,
          formContextValues: formContextValues
        });
      }
    }
  }, {
    key: "mappingField",
    value: function mappingField(map, response, initialValues, change) {
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
    }
  }, {
    key: "applyOptions",
    value: function applyOptions(_ref5) {
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

      var context = _objectSpread({}, _.reduce(dynamicContext, function (res, value) {
        return _objectSpread({}, res, _defineProperty({}, value, _.get(_this3.context, value, null)));
      }, {}), staticContext, formContextValues);

      HandbooksSource.getHandbookData("".concat(urlConstants["".concat(source, "_API_URL")], "/").concat(alias), context).loading(function () {
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
    }
  }, {
    key: "render",
    value: function render() {
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
          props = _objectWithoutProperties(_this$props3, ["Form", "footer", "status", "components", "complexFields", "form", "change", "DynamicComponents", "containers", "CONTAINERS"]);

      var stateStatus = this.state.status;
      return React__default.createElement(Form, _extends({}, props, {
        status: stateStatus || status
      }), formatFormToView(components, complexFields, form, change, DynamicComponents, containers, CONTAINERS), footer);
    }
  }]);

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
      others = _objectWithoutProperties(_ref7, ["form", "options"]);

  var formContext = options && options.formContext;
  var formContextValues = null;

  if (formContext) {
    var values = _.get(state, "form.".concat(form, ".values")) || {};
    formContextValues = _.reduce(formContext, function (res, value) {
      return _objectSpread({}, res, DynamicUtils.formatToServer(_defineProperty({}, value, _.get(values, value, ''))));
    }, {});
  }

  return _objectSpread({}, others, {
    form: form,
    formContextValues: formContextValues,
    options: options
  });
};

var FormBuilder = reactRedux.connect(mapStateToProps)(DynamicFormContainer);

module.exports = FormBuilder;
