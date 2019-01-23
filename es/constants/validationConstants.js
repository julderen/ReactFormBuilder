export var ERROR_MESSAGES = {
  incorrectFormat: 'Некорректный формат',
  incorrectValue: 'Некорректное значение',
  incorrectInterval: 'Некорректный интервал',
  incorrectMinDate: function incorrectMinDate(date) {
    return "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0434\u0430\u0442\u0430 " + date;
  },
  incorrectMaxDate: function incorrectMaxDate(date) {
    return "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0434\u0430\u0442\u0430 " + date;
  }
};