

module.exports = function(grunt) {
    'use strict';

    // Project configuration
    grunt.initConfig({
        
        // Express server configured for test using CasperJS
        express: {
            producer: {
                options: {
                    script: 'Hello World/producer.js'
                }
            },
            consumer: {
                options: {
                    script: 'Hello World/consumer.js'
                }
            }
        }
    });
  
    // Load plugins
    grunt.loadNpmTasks('grunt-express-server');

    // Define tasks
    grunt.registerTask("default", ["producer", "consumer"]);
    grunt.registerTask("pub-sub", ["subscriber", "publisher"]);
    grunt.registerTask("rpc",     ["rpc-client", "rpc-server"]);

    grunt.registerTask("producer", "RabbitMQ Hello World producer", function() {
        var done = this.async();
        
        var options = {
            cmd: 'node',
            args: ['spike/hello-world/producer.js'],
            opts: { stdio: 'inherit' }
        };
        
        grunt.util.spawn(options, function(error, result, code) {
            console.log("\n** Exiting producer **");
            done();
        });
    });

    grunt.registerTask("consumer", "RabbitMQ Hello World consumer", function() {
        var done = this.async();
        
        var options = {
            cmd: 'node',
            args: ['spike/hello-world/consumer.js'],
            opts: { stdio: 'inherit' }
        };
        
        grunt.util.spawn(options, function(error, result, code) {
            console.log("\n** Exiting consumer **");
            done();
        });
    });

    grunt.registerTask("publisher", "RabbitMQ Pub/Sub publisher", function() {
        var done = this.async();

        var options = {
            cmd: 'node',
            args: ['spike/pub-sub/emit_log.js'],
            opts: { stdio: 'inherit' }
        };

        grunt.util.spawn(options, function(error, result, code) {
            console.log("\n** Exiting publisher **");
            done();
        });
    });

    grunt.registerTask("subscriber", "RabbitMQ Pub/Sub subscriber", function() {
        var done = this.async();

        var options = {
            cmd: 'node',
            args: ['spike/pub-sub/receive_logs.js'],
            opts: { stdio: 'inherit' }
        };

        grunt.util.spawn(options, function(error, result, code) {
            console.log("\n** Exiting subscriber **");
            done();
        });
    });

    grunt.registerTask("rpc-client", "RabbitMQ RPC client", function() {
        var done = this.async();

        var options = {
            cmd: 'node',
            args: ['spike/rpc/rpc_client.js'],
            opts: { stdio: 'inherit' }
        };

        grunt.util.spawn(options, function(error, result, code) {
            console.log("\n** Exiting RPC client **");
            done();
        });
    });

    grunt.registerTask("rpc-server", "RabbitMQ RPC server", function() {
        var done = this.async();

        var options = {
            cmd: 'node',
            args: ['spike/rpc/rpc_server.js'],
            opts: { stdio: 'inherit' }
        };

        grunt.util.spawn(options, function(error, result, code) {
            console.log("\n** Exiting RPC server **");
            done();
        });
    });
};
