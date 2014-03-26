#!/usr/bin/env node

var amqp = require('amqplib'),
    all = require('when').all,
    basename = require('path').basename;

var severities = process.argv.slice(2);

if (severities.length < 1) {
    console.warn('Usage: %s [info] [warning] [error]', basename(process.argv[1]));
    process.exit(1);
}

amqp.connect().then(function(connection) {
    process.once('SIGINT', function() {
        connection.close();
    });

    return connection.createChannel().then(function(channel) {
        var exchange = 'direct_logs';

        var ok = channel.assertExchange(exchange, 'direct', { durable: false });

        ok = ok.then(function() {
            return channel.assertQueue('', { exclusive: true });
        });

        ok = ok.then(function(queueOk) {
            var queue = queueOk.queue;

            return all(severities.map(function(sev) {
                channel.bindQueue(queue, exchange, sev);
            })).then(function() {
                    return queue;
                });
        });

        ok = ok.then(function(queue) {
            return channel.consume(queue, logMessage, { noAck: true });
        });

        return ok.then(function() {
            console.log(' [*] Waiting for logs. To exit press CTRL-C');
        });

        function logMessage(msg) {
            console.log(' [x] %s: %s', msg.fields.routingKey, msg.content.toString());
        }
    });
}).then(null, console.warn);
