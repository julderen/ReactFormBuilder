"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

require("moment/locale/ru");

var _dateConstants = require("../constants/dateConstants");

var _default = {
  utcOffset: (0, _moment.default)().utcOffset(),
  isMoment: _moment.default.isMoment,
  moment: _moment.default,
  now: function now() {
    return (0, _moment.default)().startOf('day');
  },
  serverDate: function serverDate() {
    return _moment.default.utc().format(_dateConstants.SERVER_FORMAT);
  },
  toMoment: function toMoment(date, isServer) {
    var momentDate = this.isMoment(date) ? date : (0, _moment.default)(date);
    return isServer ? momentDate.subtract(this.utcOffset, 'm') : momentDate.add(this.utcOffset, 'm');
  },
  toServer: function toServer(date) {
    return this.moment(date).format(_dateConstants.SERVER_FORMAT);
  },
  toClient: function toClient(date, format) {
    return this.toMoment(date).format(format);
  },
  timeToMoment: function timeToMoment(time) {
    if (!time) return this.moment();

    var _time$split = time.split(':'),
        hours = _time$split[0],
        minutes = _time$split[1];

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
exports.default = _default;