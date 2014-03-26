
var amqp = require('amqplib');
var when = require('when');

amqp.connect().then(function(connection) {
    return when(connection.createChannel().then(function(channel) {
        var queue = 'hello';
        var msg   = 'Hello, World!';
        
        var ok = channel.assertQueue(queue, { durable: false });
        
        return ok.then(function() {
            channel.sendToQueue(queue, new Buffer(msg));
            console.log(' [x] Sent "%s"', msg);
            return channel.close();
        });
    })).ensure(function() {
            connection.close();
        });
}).then(null, console.warn);
