
var amqp = require('amqplib'),
    when = require('when'),
    uuid = require('node-uuid');

var basename = require('path').basename,
    defer = when.defer;

var n = 11;

amqp.connect().then(function(connection) {

    return when(connection.createChannel().then(function(channel) {
        var answer = defer();
        var correlationId = uuid();
       
        function maybeAnswer(msg) {
            if (msg.properties.correlationId === correlationId) {
                answer.resolve(msg.content.toString());
            }
        }
       
        var ok = channel.assertQueue('', { exclusive: true })
            .then(function(qok) {
                return qok.queue;
            });
        
        ok = ok.then(function(queue) {
            return channel.consume(queue, maybeAnswer, { noAck: true })
                .then(function() {
                    return queue;
                });
        });
        
        ok = ok.then(function(queue) {
            console.log(' [x] Requesting fib(%d)', n);
            
            channel.sendToQueue('rpc_queue', new Buffer(n.toString()), {
                correlationId: correlationId,
                replyTo: queue
            });
            
            return answer.promise;
        });
        
        return ok.then(function(fibN) {
            console.log(' [.] Got %d', fibN);
        });
    })).ensure(function() {
        connection.close();
    });
}).then(null, console.warn);
