/**
 * Created by Glen Pinner on 25/03/2014.
 */

(function () {
    'use strict';

    var http    = require('http'),
        express = require('express');

    var app = express();

    // Configure express
    app.set('port', process.env.PORT || 3000);
    app.set('IP', process.env.IP || '127.0.0.1');
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        cookie: null,   // null => browser session cookie
        secret: "akjdkfjoeiuroieupeiurieure",
        store: new express.session.MemoryStore()
    }));
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);

    // Configure routes

    // Start server
    var server = http.createServer(app);
    var io = require('socket.io').listen(server, { log: false });

    server.listen(app.get('port'), function() {
        console.log("Auction Sniper started on port " + app.get('port'));
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

        socket.on('join request', function() {
            connectToFakeAuctionServer(socket);
        });

//        socket.on('disconnect', function() {
//            console.log('Browser disconnected');
//        });
    });

    function connectToFakeAuctionServer(socket) {
        var amqp = require('amqplib');

        var ADMIN_EXCHANGE   = 'admin',
            AUCTION_EXCHANGE = 'auction',
            ADMIN_QUEUE      = 'admin',
            COMMAND_QUEUE    = 'command',
            EVENT_QUEUE      = 'event';

        amqp.connect('amqp://localhost').then(function(connection) {
            connection.once('SIGINT', function() { connection.close(); });

            return connection.createChannel().then(function(channel) {
                var ok = channel.assertExchange(ADMIN_EXCHANGE, 'direct', { autoDelete: false });

                ok = ok.then(function() {
                    return channel.assertExchange(AUCTION_EXCHANGE, 'direct', { autoDelete: false });
                });

                // Create admin queue and bind it to exchange
                ok = ok.then(function() {
                    return channel.assertQueue(ADMIN_QUEUE, {
                        autoDelete: false
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

                ok = ok.then(function() {
                    var message = 'SOL Version: 1.1; Command: START_SELLING';
                    channel.sendToQueue(ADMIN_QUEUE, new Buffer(message));
                    console.log(' [x] Sent %s', message);

                    message = 'SOL Version: 1.1; Command: JOIN';
                    channel.sendToQueue(COMMAND_QUEUE, new Buffer(message));
                    console.log(' [x] Sent %s', message);

                    message = 'SOL Version: 1.1; Command: BID; Price: 199';
                    channel.sendToQueue(COMMAND_QUEUE, new Buffer(message));
                    console.log(' [x] Sent %s', message);
                });

                return ok.then(function() {
                    channel.consume(EVENT_QUEUE, receiveEvent, { noAck: true });
                    console.log('Auction Sniper waiting for evert messages');
                });

                function receiveEvent(msg) {
                    var body = msg.content.toString();
                    console.log(' [x] Received auction event "%s"', body);

                    // emit join event for browser - need reference to a socket
                    socket.emit('join event', { status: 'CLOSED' });
                }
            });
        }).then(null, console.warn);

        console.log('Connected to Fake Auction Server');
    }

})();
