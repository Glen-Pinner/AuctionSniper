/**
 * Created by Glen Pinner on 19/03/2014.
 */

var connection = require('amqp').createConnection();

connection.on('ready', function() {
    'use strict';

    var HELLO_EXCHANGE = 'hello-exchange',
        HELLO_QUEUE    = 'hello-queue',
        ROUTING_KEY    = 'hola';

    var exchange = connection.exchange(HELLO_EXCHANGE, {
        type: 'direct',
        confirm: true
//        passive: false,
//        durable: true,
//        autoDelete: false
    });

    connection.queue(HELLO_QUEUE, /*{ durable: true },*/ function(queue) {
        queue.bind(HELLO_EXCHANGE, ROUTING_KEY);

        var msg = 'Hello, World!';
        var msgProperties = { contentType: 'text/plain'};

        exchange.publish(ROUTING_KEY, new Buffer(msg), msgProperties, function(err) {
            console.log('Publish confirmed');
        });

        console.log(' [x] Sent "%s"', msg);

//        setTimeout(function () {
//            connection.end();
//        }, 1000);
    });
});

connection.on('error', function(ex) {
    throw ex;
});

connection.on('close', function(ex) {
    console.log('connection closed');
});
