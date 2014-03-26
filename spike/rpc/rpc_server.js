
var amqp = require('amqplib');

function fibonacci(n) {
    if (n === 0) return 0;
    else if (n === 1) return 1;
    else return fibonacci(n - 1) + fibonacci(n - 2);
}

amqp.connect().then(function(connection) {
    process.once('SIGINT', function() {
        connection.close();
    });
    
    return connection.createChannel().then(function(channel) {
        var queue = 'rpc_queue';
        var ok = channel.assertQueue(queue, { durable: false });
        
        ok = ok.then(function() {
            channel.prefetch(1);
            return channel.consume(queue, reply);
        });
        
        return ok.then(function() {
            console.log(' [x] Awaiting RPC requests');

            // Added for Grunt to exit task otherwise server continues
            // process.emit('SIGINT');
        });
        
        function reply(msg) {
            var n = parseInt(msg.content.toString());
            console.log(' [.] fib(%d)', n);
            
            var response = fibonacci(n);
            channel.sendToQueue(msg.properties.replyTo,
                                new Buffer(response.toString()),
                                { correlationId: msg.properties.correlationId });
            channel.ack(msg);
        }
    });
}).then(null, console.warn);
