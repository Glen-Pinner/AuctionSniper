#!/usr/bin/env node
/**
 * Created by Glen Pinner on 26/03/2014.
 */

var amqp = require('amqplib'),
    when = require('when');

var ADMIN_EXCHANGE   = 'admin',
    AUCTION_EXCHANGE = 'auction',
    ADMIN_QUEUE      = 'admin',
    COMMAND_QUEUE    = 'command';

(function () {
    'use strict';

    amqp.connect('amqp://localhost').then(function(connection) {

        return when(connection.createChannel().then(function(channel) {
            var ok = channel.assertExchange(ADMIN_EXCHANGE, 'direct', { autoDelete: false });

            ok = ok.then(function() {
                return channel.assertExchange(AUCTION_EXCHANGE, 'direct', { autoDelete: false });
            });

            // Create admin queue and bind it to exchange
            ok = ok.then(function() {
                return channel.assertQueue(ADMIN_QUEUE, {
                    autoDelete: false
                });
            });

            ok = ok.then(function(queueOk) {
                return channel.bindQueue(queueOk.queue, ADMIN_EXCHANGE, '').then(function() {
                    return queueOk.queue;
                })
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
                })
            });

            return ok.then(function() {
                var message = 'SOL Version: 1.1; Command: START_SELLING';

                // Publish message to exchange
//                channel.publish(ADMIN_EXCHANGE, '', new Buffer(message)); // WORKS

                // Send messages to specified queues
                channel.sendToQueue(ADMIN_QUEUE, new Buffer(message));
                console.log(' [x] Sent %s', message);

                message = 'SOL Version: 1.1; Command: JOIN';
                channel.sendToQueue(COMMAND_QUEUE, new Buffer(message));
                console.log(' [x] Sent %s', message);

                message = 'SOL Version: 1.1; Command: BID; Price: 199';
                channel.sendToQueue(COMMAND_QUEUE, new Buffer(message));
                console.log(' [x] Sent %s', message);

                return channel.close();
            });
        })).ensure(function() { connection.close(); });
    }).then(null, console.warn);

})();
