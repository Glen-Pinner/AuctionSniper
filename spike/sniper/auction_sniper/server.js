/**
 * Created by Glen Pinner on 25/03/2014.
 */

(function () {
    'use strict';

    var http    = require('http'),
        express = require('express');

    var app = module.exports = express();

    // Configure express
    app.set('port', process.env.PORT || 3000);
    app.set('IP', process.env.IP || '127.0.0.1');
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);

    // Configure routes

    // Start server
    var server = http.createServer(app);

    server.listen(app.get('port'), function() {
        console.log("Express app started on port " + app.get('port'));
    });

})();
