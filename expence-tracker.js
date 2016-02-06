var whatsappParser = require('./index');

module.exports.expenses = expenses;
module.exports._numbersFromString = numbersFromString;

var authors = {};

function expenses() {
  return whatsappParser
    .parseFile('costs.txt')
    .then(function (messages) {
      messages.forEach((message) => {
        authors[message.author] = authors[message.author] || 0;
        authors[message.author] += sum(numbersFromString(message.content));
      });

      return authors;
    });
}

var regex = /[+-]?\d+(\.\d+)?/g;

function numbersFromString(input) {
  input = input.replace('.', '');
  input = input.replace(',', '.');

  var res = input.match(regex);
  res = res || [];

  return res.map((value) => {
    return (value);
  });
}

function sum(values) {
  values = values || [];
  var res = 0;

  values.forEach((value) => {
    res += value;
  });

  return res;
}
