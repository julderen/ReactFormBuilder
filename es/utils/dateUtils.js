import moment from 'moment';
import 'moment/locale/ru';
import { SERVER_FORMAT } from '../constants/dateConstants';
export default {
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