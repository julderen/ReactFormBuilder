"use strict";

exports.__esModule = true;
exports.ERROR_MESSAGES = void 0;
const ERROR_MESSAGES = {
  incorrectFormat: 'Некорректный формат',
  incorrectValue: 'Некорректное значение',
  incorrectInterval: 'Некорректный интервал',
  incorrectMinDate: date => `Минимальная дата ${date}`,
  incorrectMaxDate: date => `Максимальная дата ${date}`
};
exports.ERROR_MESSAGES = ERROR_MESSAGES;