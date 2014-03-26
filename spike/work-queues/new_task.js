#!/usr/bin/env node

/**
 * Created by Glen Pinner on 21/03/2014.
 */

var amqp = require('amqplib');
var when = require('when');

amqp.connect().then(function(connection) {
    return when(connection.createChannel().then(function(channel) {
        var queue = 'task_queue';
        var ok = channel.assertQueue(queue, { durable: true });

        return ok.then(function() {
            var msg = process.argv.slice(2).join(' ') || 'Hello, World!';

            channel.sendToQueue(queue, new Buffer(msg), { deliveryMode: 2 });
            console.log(' [x] Sent "%s"', msg);

            return channel.close();
        });
    })).ensure(function() {
            return connection.close();
        });
}).then(null, console.warn);

