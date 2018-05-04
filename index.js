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
      if (err.errno === -2) {
        return [];
      }

      debug(err.message);
    });
}

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data ? data.toString('utf8') : '');
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
    date: rawParts.version === 1 ?
      parseDateForFormatV1(rawParts.date) :
      parseDateForFormatV2(rawParts.date),
    author: parseAuthor(rawParts.author),
    content: parseContent(rawParts.content)
  };

  if (!result.content) {
    result = null;
  }

  return result;
}

function getParts(line) {
  return line.startsWith('[') ?
    getPartsFromLineInExportFormatV2(line) :
    getPartsFromLineInExportFormatV1(line);
}

function getPartsFromLineInExportFormatV1(line) {
  var splitted = line.split(': ');

  return {
    date: splitted[0],
    author: splitted[1],
    content: splitted[2],
    version: 1
  };
}

function getPartsFromLineInExportFormatV2(line) {
  var splitted = line.split('] ');
  var splittedSecondPart = splitted[1].split(': ');

  return {
    date: splitted[0].substr(1, 20),
    author: splittedSecondPart[0],
    content: splittedSecondPart[1],
    version: 2
  };
}

function parseDateForFormatV1(input) {
  return moment(input, 'DD-MM-YY HH:mm:ss').toDate();
}

function parseDateForFormatV2(input) {
  return moment(input, 'DD/MM/YYYY HH:mm:ss').toDate();
}

function parseAuthor(input) {
  return input;
}

function parseContent(input) {
  return input;
}
