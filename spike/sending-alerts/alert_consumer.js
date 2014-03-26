#!/usr/bin/env node

var amqp = require('amqplib'),
    all = require('when').all;

// TODO: add these constants into the code where necessary
var AMQP_SERVER = 'localhost',
    AMQP_USER   = 'alert_user',
    AMQP_PASSWORD = 'alertme',
    AMQP_VHOST    = '/',
    AMQP_EXCHANGE = 'alerts';

amqp.connect('amqp://guest:guest@localhost').then(function(connection) {

    return connection.createChannel().then(function(channel) {
        // set durable => false too?
        var ok = channel.assertExchange(AMQP_EXCHANGE, 'topic', { autoDelete: false });

//        ok = ok.then(function() {
//            return channel.assertQueue('', { exclusive: true });
//        });
//
//        var bindingKeys = ['critical', 'rate_limit'];
//
//        ok = ok.then(function(queueOk) {
//            var queue = queueOk.queue;
//
//            return all(bindingKeys.map(function(key) {
//                channel.bindQueue(queue, AMQP_EXCHANGE, key);
//            })).then(function() { return queue; });
//        });

        // Create and bind queues individually. N.B. Code above is taken from
        // the npm module topics example and is more complex. Keep it simple for
        // now.
        var CRITICAL_QUEUE = 'critical',
            RATE_LIMIT_QUEUE = 'rate_limit';

        ok = ok.then(function() {
            // set exclusive => true?
            return channel.assertQueue(CRITICAL_QUEUE, { autoDelete: false });
        });

        ok = ok.then(function(queueOk) {
            return channel.bindQueue(queueOk.queue, AMQP_EXCHANGE, 'critical.*').then(function() {
                return queueOk.queue;
            })
        });

        ok = ok.then(function() {
            // set exclusive => true?
            return channel.assertQueue(RATE_LIMIT_QUEUE, { autoDelete: false });
        });

        ok = ok.then(function(queueOk) {
            return channel.bindQueue(RATE_LIMIT_QUEUE, AMQP_EXCHANGE, '*.rate_limit').then(function() {
                return queueOk.queue;
            });
        });

        // Service each queue as alerts come in
        ok = ok.then(function() {
            return channel.consume(CRITICAL_QUEUE, critical_notify, {
                noAck: false,
                consumerTag: 'critical'
            });
        });

        ok = ok.then(function() {
            return channel.consume(RATE_LIMIT_QUEUE, rate_limit_notify, {
                noAck: false,
                consumerTag: 'rate_limit'
            });
        });

        return ok.then(function() {
            console.log(' [*] Waiting for alerts. To exit press CTRL-C');
        });

        // Handle each message according to topic
        function critical_notify(msg) {
            console.log(' [critical_notify] %s: "%s"', msg.fields.routingKey, msg.content.toString());
            channel.ack(msg);
        }

        function rate_limit_notify(msg) {
            console.log(' [rate_limit_notify] %s: "%s"', msg.fields.routingKey, msg.content.toString());
            channel.ack(msg);
        }

    });

}).then(null, console.warn);