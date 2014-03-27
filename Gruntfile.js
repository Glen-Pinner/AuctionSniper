

module.exports = function(grunt) {
    'use strict';

    // Project configuration
    grunt.initConfig({

        // Lint source files
        jshint: {
            spike: {
                options: spikeLintOptions(),
                files: {
                    src: "spike/**/*.js"
                }
            }
        }
    });
  
    // Load plugins
    grunt.loadNpmTasks("grunt-contrib-jshint");

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

    // Helper functions
    function globalLintOptions() {
        return {
            bitwise: true,
            curly: false,
            eqeqeq: true,
            forin: true,
            immed: true,
            latedef: "nofunc",
            newcap: true,
            noarg: true,
            noempty: true,
            nonew: true,
            regexp: true,
            undef: true,
            strict: true,
            trailing: true
         };
    }

    function spikeLintOptions() {
        var options = globalLintOptions();

        // for now
        options.globals = {
            // CommonJS
            require: true,

            // Node
            process: true,
            Buffer: true,
            setTimeout: true,
            __dirname: true,
            io: true,

            // Broswer
            $: true,
            _: true,
            Backbone: true,
            Handlebars: true,


            // Debug
            console: true
        };

        options.ignores = ["spike/sniper/auction_sniper/public/js/vendor/**/*.js"];

        return options;
    }
};
