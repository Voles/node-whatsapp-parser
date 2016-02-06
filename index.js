'use strict';

const fs = require('fs');
const moment = require('moment');
const debug = require('debug')('whatsapp-parser');

module.exports.parseFile = parseFile;
module.exports._parseLine = parseLine;

function parseFile(filepath) {
  return readFile(filepath)
    .then(splitLines)
    .then(parseLines)
    .then(filterMessagesWithoutContent)
    .catch((err) => {
      debug(err.message);
    });
}

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data.toString('utf8'));
    });
  });
}

function splitLines(input) {
  return input.split('\n');
}

function parseLines(lines) {
  return lines.map(parseLine);
}

function filterMessagesWithoutContent(messages) {
  return messages.filter((message) => {
    return !!message;
  });
}

function parseLine(line) {
  var rawParts = getParts(line);

  var result = {
    date: parseDate(rawParts.date),
    author: parseAuthor(rawParts.author),
    content: parseContent(rawParts.content)
  };

  if (!result.content) {
    result = null;
  }

  return result;
}

function getParts(line) {
  var splited = line.split(': ');
  return {
    date: splited[0],
    author: splited[1],
    content: splited[2]
  };
}

function parseDate(input) {
  return moment(input, 'DD-MM-YY HH:mm:ss').toDate();
}

function parseAuthor(input) {
  return input;
}

function parseContent(input) {
  return input;
}
