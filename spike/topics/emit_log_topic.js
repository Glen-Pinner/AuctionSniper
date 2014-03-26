#!/usr/bin/env node

var amqp = require('amqplib');
var when = require('when');

var args = process.argv.slice(2);
var key = (args.length > 0) ? args[0] : 'info';
var message = args.slice(1).join(' ') || 'Hello, World!';

amqp.connect().then(function(connection) {

    return when(connection.createChannel().then(function(channel) {
        var exchange = 'topic_logs';
        var ok = channel.assertExchange(exchange, 'topic', { durable: false });

        return ok.then(function() {
            channel.publish(exchange, key, new Buffer(message));

            console.log(' [x] Sent %s: %s', key, message);

            return channel.close();
        })
    })).ensure(function() { connection.close(); });

}).then(null, console.log);