#!/usr/bin/env node

var amqp = require('amqplib'),
    all = require('when').all,
    basename = require('path').basename;

var keys = process.argv.slice(2);

if (keys.length < 1) {
    console.warn('Usage: %s pattern [pattern...]', basename(process.argv[1]));
    process.exit(1);
}

amqp.connect().then(function(connection) {
    'use strict';

    process.once('SIGINT', function() { connection.close(); });

    return connection.createChannel().then(function(channel) {
        // Name the exchange
        var exchange = 'topic_logs';

        // Create promise and attempt to create topic exchange
        var ok = channel.assertExchange(exchange, 'topic', { durable: false });

        ok = ok.then(function() {
            // Promise fulfilled. Successfully created exchange and attempt
            // to create randomly-named (by RabbitMQ) queue
            return channel.assertQueue('', { exclusive: true });
        });

        ok = ok.then(function(queueOk) {
            // Promise fulfilled. We have a queue
            var queue = queueOk.queue;

            // For all elements in keys array we attempt to bind a queue using
            // the element as the routing key. When all queues are successfully
            // bound to the exchange the promise is fulfilled.
            // N.B. The routing key is what the publisher uses for each message
            // while consumers use corresponding binding keys to match each
            // routing key. Term is used interchangeably here.
            return all(keys.map(function(routingKey) {
                channel.bindQueue(queue, exchange, routingKey);
            })).then(function() { return queue; });
        });

        // When all bound promises are fulfilled, i.e. we create an exchange,
        // queues and bind the queues to the exchange, we can read messages
        // according to the binding keys, aka topics
        ok = ok.then(function(queue) {
            // Promise fulfilled. All queues are successfully bound to the
            // exchange the promise.
            return channel.consume(queue, logMessage, { noAck: true });
        });

        return ok.then(function() {
            // By the time we reach here we have bound a number of callbacks
            // to the ok promise and we state we are waiting for messages.
            console.log(' [*] Waiting for logs. To exit press CTRL-C');
        });

        function logMessage(msg) {
            console.log(' [x] %s: "%s"', msg.fields.routingKey, msg.content.toString());
        }
    });

}).then(null, console.warn);