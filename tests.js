'use strict';

const assert = require('assert');
const whatsappParser = require('./index');

describe('the Whatsapp parser', () => {
  describe('when the file does not exist', () => {
    it('should return an empty list', () => {
      whatsappParser
        .parseFile('')
        .then((messages) => {
          assert.deepEqual(messages, []);
        })
    });
  });

  describe('parsing a single message', () => {
    describe('the date', () => {
      it('should return a Date object', () => {
        let output = whatsappParser._parseLine('01-01-16 00:00:01: Niels Dequeker: Happy New Year!');
        assert.deepEqual(output.date, new Date(2016, 0, 1, 0, 0, 1));
      });

      it('should allow the dd-mm-yy hh:mm:ss format', () => {
        let output = whatsappParser._parseLine('30-01-16 12:51:20: Niels Dequeker: Test message content');
        assert.deepEqual(output.date, new Date(2016, 0, 30, 12, 51, 20));
      });

      it('should allow the dd/mm/yy hh:mm:ss format', () => {
        let output = whatsappParser._parseLine('30/01/16 12:51:20: Niels Dequeker: Test message content');
        assert.deepEqual(output.date, new Date(2016, 0, 30, 12, 51, 20));
      });

      it('should allow the [dd/mm/yyyy, hh:mm:ss] format', () => {
        let output = whatsappParser._parseLine('[30/01/2016, 12:51:20] Niels Dequeker: Test message content');
        assert.deepEqual(output.date, new Date(2016, 0, 30, 12, 51, 20));
      });
    });

    describe('the author', () => {
      it('should return the author', () => {
        let output = whatsappParser._parseLine('30/01/16 12:51:20: Niels Dequeker: Test message content');
        assert.equal(output.author, 'Niels Dequeker');
      });
    });

    describe('the content', () => {
      it('should return the content', () => {
        let output = whatsappParser._parseLine('30/01/16 12:51:20: Niels Dequeker: Test message content');
        assert.equal(output.content, 'Test message content');
      });
    });
  });

  describe('parsing an announcement', () => {
    it('should be ignored when adding a person', () => {
      let output = whatsappParser._parseLine('06-01-16 12:29:41: ‎Niels Dequeker heeft u toegevoegd');
      assert.deepEqual(output, null);
    });

    it('should work when the owner changes the image of the group', () => {
      let output = whatsappParser._parseLine('06-01-16 14:15:59: ‎U hebt de groepsafbeelding gewijzigd');
      assert.deepEqual(output, null);
    });


    it('should work when a member changes the image of the group', () => {
      let output = whatsappParser._parseLine('09-01-16 09:13:34: ‎Niels Dequeker heeft de groepsafbeelding gewijzigd');
      assert.deepEqual(output, null);
    });
  });

  describe('parsing multiple messages', () => {
    it('should return the user messages', (done) => {
      whatsappParser
        .parseFile('./example-input.txt')
        .then((messages) => {
          assert.deepEqual(messages.length, 2);
          done();
        });
    });
  })
});
