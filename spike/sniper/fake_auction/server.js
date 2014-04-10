/**
 * Created by Glen Pinner on 25/03/2014.
 */

(function () {
    'use strict';

    var http    = require('http'),
        express = require('express');

    var app = express();

    // Configure express
    app.set('port', 3009);
    app.set('IP', process.env.IP || '127.0.0.1');
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        cookie: null,   // null => browser session cookie
        secret: "anauctioneerslotisnotahappyone",
        store: new express.session.MemoryStore()
    }));
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);

    // Configure routes

    // Start server
    var server = http.createServer(app);
    var io = require('socket.io').listen(server, { log: false });

    server.listen(app.get('port'), function() {
        console.log("Fake Auction Server app started on port " + app.get('port'));

        connectToFakeAuctionServer(/*socket*/);
    });

    // Socket.IO Configuration
    io.sockets.on('connection', function(socket) {
        socket.emit('news', { hello: 'world'});

        // start sending date to client
        socket.on('my other event', function(data) {
//            console.log(data);

            /* global setInterval */
            setInterval(function () {
                console.log("Sending date to client...");
                socket.emit('my time', { the_time: new Date() });
            }, 1000);
        });

//        socket.on('join request', function() {
//            connectToFakeAuctionServer(socket);
//        });

//        socket.on('disconnect', function() {
//            console.log('Browser disconnected');
//        });
    });

    function connectToFakeAuctionServer(/*socket*/) {
        var amqp = require('amqplib');

        var ADMIN_EXCHANGE   = 'admin',
            AUCTION_EXCHANGE = 'auction',
            ADMIN_QUEUE      = 'admin',
            COMMAND_QUEUE    = 'command',
            EVENT_QUEUE      = 'event';

        amqp.connect('amqp://localhost').then(function(connection) {
            connection.once('SIGINT', function() { connection.close(); });

            return connection.createChannel().then(function (channel) {
                // Create admin exchange
                var ok = channel.assertExchange(ADMIN_EXCHANGE, 'direct', { autoDelete: false });

                ok = ok.then(function() {
                    return channel.assertExchange(AUCTION_EXCHANGE, 'direct', { autoDelete: false });
                });

                // Create admin queue and bind it to
                ok = ok.then(function() {
                    return channel.assertQueue(ADMIN_QUEUE, {
                        autoDelete: false,
                        noAck: true
                    });
                });

                ok = ok.then(function(queueOk) {
                    return channel.bindQueue(queueOk.queue, ADMIN_EXCHANGE, '').then(function() {
                        return queueOk.queue;
                    });
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
                    });
                });

                // Create event queue and bind it
                ok = ok.then(function() {
                    return channel.assertQueue(EVENT_QUEUE, {
                        autoDelete: false,
                        noAck: true
                    });
                });

                ok = ok.then(function(queueOk) {
                    return channel.bindQueue(queueOk.queue, AUCTION_EXCHANGE, '').then(function() {
                        return queueOk.queue;
                    });
                });

                // Process one message at a time - is this what we want?
//            ok = ok.then(function() {
//                channel.prefetch(1);
//            });

                ok = ok.then(function() {
                    channel.consume(ADMIN_QUEUE, doAdminWork, { noAck: true });
                    console.log('Fake Auction Server: waiting for admin messages. To exit press CTRL-C');
                });

                return ok.then(function() {
                    channel.consume(COMMAND_QUEUE, doCommandWork, { noAck: true });
                    console.log('Fake Auction Server: waiting for command messages. To exit press CTRL-C');
                });

                function doAdminWork(msg) {
                    var body = msg.content.toString();
                    console.log(' [x] Received admin command "%s"', body);
                }

                function doCommandWork(msg) {
                    var body = msg.content.toString();
                    console.log(' [x] Received auction command "%s"', body);

                    var message = 'SOL Version: 1.1; Event: CLOSE';
                    channel.sendToQueue(EVENT_QUEUE, new Buffer(message));
                    console.log(' [x] Sent %s', message);
                }
            });

        }).then(null, console.warn);

        console.log('Connected to RabbitMQ');
    }

})();
