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

        queue.subscribe(function(msg, headers, deliveryInfo, msgObj) {
            console.log(' [x] Received "%s"', msg.data.toString());

//            console.log('routing key', deliveryInfo.routingKey);
            console.log('deliveryInfo', deliveryInfo);
//            console.log('messageObject', msgObj);
//            msgObj.acknowledge(false);  // throws exception
        });
    });
});

connection.on('ack', function(ex) {
    'use strict';
    console.log('ACK: publish confirmed');
});

connection.on('error', function(ex) {
    'use strict';
    throw ex;
});

connection.on('close', function(ex) {
    'use strict';
    console.log('connection closed');
});


