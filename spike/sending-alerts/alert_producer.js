#!/usr/bin/env node

var amqp = require('amqplib');
var when = require('when');

// TODO: add these constants into the code where necessary
var AMQP_SERVER = 'localhost',
    AMQP_USER   = 'alert_user',
    AMQP_PASSWORD = 'alertme',
    AMQP_VHOST    = '/',
    AMQP_EXCHANGE = 'alerts';

var args = process.argv.slice(2);
var alert = (args.length > 0) ? args[0] : 'info';
var message = args.slice(1).join(' ') || 'Hello, World!';

amqp.connect('amqp://guest:guest@localhost').then(function(connection) {

    return when(connection.createChannel().then(function(channel) {
        var ok = channel.assertExchange(AMQP_EXCHANGE, 'topic', { autoDelete: false });

        return ok.then(function() {
            channel.publish(AMQP_EXCHANGE, alert, new Buffer(message), {
                contentType: 'application/json'
            });

            console.log(' [x] Sent %s: %s', alert, message);

            return channel.close();
        })
    })).ensure(function() { connection.close(); });

}).then(null, console.warn);