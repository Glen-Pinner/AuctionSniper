#!/usr/bin/env node

var amqp = require('amqplib');
var when = require('when');

var args = process.argv.slice(2);
var severity = (args.length > 0) ? args[0] : 'info';
var message = args.slice(1).join(' ') || 'Hello, World!';

amqp.connect().then(function(connection) {

    return when(connection.createChannel().then(function(channel) {
        var exchange = 'direct_logs';
        var ok = channel.assertExchange(exchange, 'direct', { durable: false });

        return ok.then(function() {
            // Publish message to exchange with 'severity' as the routing key
            channel.publish(exchange, severity, new Buffer(message));
            console.log(' [x] Sent %s %s', severity, message);

            return channel.close();
        });
    })).ensure(function() {
            connection.close();
        });
}).then(null, console.warn);
