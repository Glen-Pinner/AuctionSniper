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
        passive: false,
        durable: true,
        autoDelete: false
    });

    connection.queue(HELLO_QUEUE, { durable: true }, function(queue) {
        queue.bind(HELLO_EXCHANGE, ROUTING_KEY);

        var msg = 'Hello, World!';
        var msgProperties = { contentType: 'text/plain'};

        exchange.publish(ROUTING_KEY, new Buffer(msg), msgProperties);

        console.log(' [x] Sent "%s"', msg);

        setTimeout(function () {
            connection.end();
        }, 1000);
    });
});

connection.on('error', function(ex) {
    'use strict';
    throw ex;
});

connection.on('close', function(ex) {
    'use strict';
    console.log('connection closed');
});

