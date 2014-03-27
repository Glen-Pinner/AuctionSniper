/**
 * Created by Glen Pinner on 19/03/2014.
 */

var amqp = require('amqplib');
var when = require('when');

amqp.connect().then(function(connection) {
    'use strict';

    connection.createConfirmChannel().then(function(channel) {
        var queue = 'hello';
        var msg   = 'Hello, World!';

//        var ok = channel.assertQueue(queue, { durable: false });

        channel.sendToQueue(queue, new Buffer(msg), {}, function(err, ok) {
            console.log('publish confirmed');
            console.log('  err', err);
            console.log('  ok', ok);

            if (err !== null) {
                console.warn("Message NACKed");
            } else {
                console.log("Message ACKed");
            }
        });

//        console.log(' [x] Sent "%s"', msg);
    });
}).then(null, console.warn);
