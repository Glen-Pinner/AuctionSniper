#!/usr/bin/env node

var amqp = require('amqplib');
var when = require('when');

amqp.connect().then(function(connection) {
    'use strict';

    return when(connection.createChannel().then(function(channel) {
        var exchange = 'logs';
        var ok = channel.assertExchange(exchange, 'fanout', { durable: false });

        var message = process.argv.slice(2).join(' ') || 'INFO: Hello, World!';

        return ok.then(function() {
            // Note no routing key ('') as not needed for fanout exchanges
            channel.publish(exchange, '', new Buffer(message));
            
            console.log(' [x] Sent "%s"', message);
            return channel.close();
        });
    })).ensure(function() {
            connection.close();
        });
}).then(null, console.warn);
