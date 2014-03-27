#!/usr/bin/env node

var amqp = require('amqplib');

amqp.connect().then(function(connection) {
    'use strict';

    process.once('SIGINT', function() {
        connection.close();
    });
    
    return connection.createChannel().then(function(channel) {
        var ok = channel.assertExchange('logs', 'fanout', { durable: false });

        // Create unnamed queue, delete when we disconnect (exclusive flag)
        ok = ok.then(function() {
            return channel.assertQueue('', { exclusive: true });
        });

        // Bind the new queue to the exchange in order to receive messages
        ok = ok.then(function(qok) {
            return channel.bindQueue(qok.queue, 'logs', '').then(function() {
                return qok.queue;
            });
        });
        
        ok = ok.then(function(queue) {
            return channel.consume(queue, logMessage, { noAck: true });
        });
        
        return ok.then(function() {
            console.log(' [*] Waiting for logs. To exit press CTRL-C');
        });
        
        function logMessage(msg) {
            console.log(' [x] "%s"', msg.content.toString());
        }
    });
}).then(null, console.warn);
