#!/usr/bin/env node
/**
 * Created by Glen Pinner on 26/03/2014.
 */

var amqp = require('amqplib');

var ADMIN_EXCHANGE   = 'admin',
    AUCTION_EXCHANGE = 'auction',
    ADMIN_QUEUE      = 'admin',
    COMMAND_QUEUE    = 'command',
    EVENT_QUEUE      = 'event';

(function () {
    'use strict';

    amqp.connect('amqp://localhost').then(function(connection) {
        connection.once('SIGINT', function() { connection.close(); });

        return connection.createChannel().then(function (channel) {
            // Create admin exchange
            var ok = channel.assertExchange(ADMIN_EXCHANGE, 'direct', { autoDelete: false });

            ok = ok.then(function() {
                return channel.assertExchange(AUCTION_EXCHANGE, 'direct', { autoDelete: false });
            });

            // Create admin queue and bind it to
            ok = ok.then(function() {
                return channel.assertQueue(ADMIN_QUEUE, {
                    autoDelete: false,
                    noAck: true
                });
            });

            ok = ok.then(function(queueOk) {
                return channel.bindQueue(queueOk.queue, ADMIN_EXCHANGE, '').then(function() {
                    return queueOk.queue;
                });
            });

            // Create command queue and bind it
            ok = ok.then(function() {
                return channel.assertQueue(COMMAND_QUEUE, {
                    autoDelete: false,
                    noAck: true
                });
            });

            ok = ok.then(function(queueOk) {
                return channel.bindQueue(queueOk.queue, AUCTION_EXCHANGE, '').then(function() {
                    return queueOk.queue;
                });
            });

            // Create event queue and bind it
            ok = ok.then(function() {
                return channel.assertQueue(EVENT_QUEUE, {
                    autoDelete: false,
                    noAck: true
                });
            });

            ok = ok.then(function(queueOk) {
                return channel.bindQueue(queueOk.queue, AUCTION_EXCHANGE, '').then(function() {
                    return queueOk.queue;
                });
            });

            // Process one message at a time - is this what we want?
//            ok = ok.then(function() {
//                channel.prefetch(1);
//            });

            ok = ok.then(function() {
                channel.consume(ADMIN_QUEUE, doAdminWork, { noAck: true });
                console.log('Fake Auction Server: waiting for admin messages. To exit press CTRL-C');
            });

            return ok.then(function() {
                channel.consume(COMMAND_QUEUE, doCommandWork, { noAck: true });
                console.log('Fake Auction Server: waiting for command messages. To exit press CTRL-C');
            });

            function doAdminWork(msg) {
                var body = msg.content.toString();
                console.log(' [x] Received admin command "%s"', body);
            }

            function doCommandWork(msg) {
                var body = msg.content.toString();
                console.log(' [x] Received auction command "%s"', body);

                var message = 'SOL Version: 1.1; Event: CLOSE';
                channel.sendToQueue(EVENT_QUEUE, new Buffer(message));
                console.log(' [x] Sent %s', message);
            }
        });

    }).then(null, console.warn);

})();
