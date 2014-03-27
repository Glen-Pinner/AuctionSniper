#!/usr/bin/env node

/**
 * Created by Glen Pinner on 21/03/2014.
 */

var amqp = require('amqplib');

amqp.connect().then(function(connection) {
    'use strict';

    connection.once('SIGINT', function() {
        connection.close();
    });

    return connection.createChannel().then(function(channel) {
        var ok = channel.assertQueue('task_queue', { durable: true });

        // Process one message at a time
        ok = ok.then(function() {
            channel.prefetch(1);
        });

        ok = ok.then(function() {
            channel.consume('task_queue', doWork, { noAck: false });
            console.log(' [x] Waiting for messages. To exit press CTRL-C');
        });

        return ok;

        function doWork(msg) {
            var body = msg.content.toString();

            console.log(' [x] Received "%s"', body);

            var secs = body.split('.').length - 1;

            setTimeout(function() {
                console.log(' [x] Done');

                channel.ack(msg);
            }, secs * 1000);
        }
    });
}).then(null, console.warn);
