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
  now: () => (0, _moment.default)().startOf('day'),

  serverDate() {
    return _moment.default.utc().format(_dateConstants.SERVER_FORMAT);
  },

  toMoment(date, isServer) {
    const momentDate = this.isMoment(date) ? date : (0, _moment.default)(date);
    return isServer ? momentDate.subtract(this.utcOffset, 'm') : momentDate.add(this.utcOffset, 'm');
  },

  toServer(date) {
    return this.moment(date).format(_dateConstants.SERVER_FORMAT);
  },

  toClient(date, format) {
    return this.toMoment(date).format(format);
  },

  timeToMoment(time) {
    if (!time) return this.moment();
    const [hours, minutes] = time.split(':');
    return this.moment({
      hours,
      minutes
    });
  },

  isLastDay(date) {
    const now = this.moment();
    return !now.isSame(date, 'day') && now.isAfter(date);
  },

  clientTimezone() {
    return new Date().getTimezoneOffset();
  },

  toServerTimeInterval(startDate, endDate) {
    return {
      startDate: this.toServer(startDate),
      endDate: this.toServer(endDate.add(1, 'day').startOf('day'))
    };
  }

};
exports.default = _default;