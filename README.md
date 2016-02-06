# node-whatsapp-parser
[WhatsApp Chat History](https://www.whatsapp.com/faq/en/s60/21055276) parser for Node.js

## Usage

    var parser = require('node-whatsapp-parser');
    
    parser
        .parseFile('whatsapp-chat-archive.txt')
        .then((messages) => {
            // process messages
        });
    });

## Output
The output is a list of messages containing the date, author and content.

    [{
        date: Wed Jan 06 2016 12:30:04 GMT+0100 (CET), // date-object
        author: 'Niels Dequeker',
        content: 'This is a test message'
    }, {
        date: Fri Jan 22 2016 20:36:43 GMT+0100 (CET), // date-object
        author: 'Jane Doe',
        content: 'This is a test reply'
    }]

## Related
This module is used in the [node-whatsapp-expenses](https://github.com/Voles/node-whatsapp-expenses) module to calculate expenses for the authors, grouped by month.
