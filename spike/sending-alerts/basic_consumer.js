#!/usr/bin/env node

var amqp = require('amqplib');

amqp.connect('amqp://guest:guest@localhost').then(function(connection) {
    'use strict';

    process.once('SIGINT', function() { connection.close(); });

    return connection.createChannel().then(function(channel) {
        var exchange = 'alerts';

        var ok = channel.assertExchange(exchange, 'topic', { autoDelete: false });

        ok = ok.then(function() {
            return channel.assertQueue('critical', { autoDelete: false });
        });

        ok = ok.then(function(queueOk) {
            var queue = queueOk.queue;

            return channel.bindQueue(queue, exchange, 'critical.*').then(function() {
                return queue;
            });
        });

        ok = ok.then(function(queue) {
            channel.consume('critical', function(msg) {
                console.log('Received message: %s "%s"', msg.fields.routingKey, msg.content.toString());
            }, { noAck: true });

            console.log('Waiting for messages');
        });

        return ok;
    });

}).then(null, console.warn);
