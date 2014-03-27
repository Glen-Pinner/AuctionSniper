
var amqp = require('amqplib');

amqp.connect().then(function(connection) {
    'use strict';

    process.once('SIGINT', function() {
        connection.close();
    });
    
    return connection.createChannel().then(function(channel) {
        var ok = channel.assertQueue('hello', { durable: false });
        
        ok = ok.then(function() {
            // Added to get publish confirms working
            channel.prefetch(1);

            return channel.consume('hello', function(msg) {
                console.log(' [x] Received "%s"', msg.content.toString());
            }, { noAck: true });
        });
        
        return ok.then(function(consumeOk) {
            console.log(' [*] Waiting for messages. To exit press CTRL-C');
        });
    });
}).then(null, console.warn);
