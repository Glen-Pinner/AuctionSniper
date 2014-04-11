

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
        },

        express: {
            auction: {
                options: {
                    script: 'spike/sniper/fake_auction/server.js',
                    debug: false
                }
            },
            sniper: {
                options: {
                    script: 'spike/sniper/auction_sniper/server.js',
                    debug: false
                }
            }
        },

        casperjs: {
            options: {
                path: 'spike/casper'
            },
            files: [
                'spike/test/acceptance_tests.js'
            ]
        }
    });
  
    // Load plugins
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-express-server");
    grunt.loadNpmTasks("grunt-casperjs");

    // Define tasks
    grunt.registerTask("default", ["producer", "consumer"]);

    grunt.registerTask('smoking', ['express:auction', 'express:sniper', 'casperjs']);

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
            module: true,

            // Node
            process: true,
            Buffer: true,
            setTimeout: true,
            __dirname: true,
            io: true,

            // Browser
            $: true,
            _: true,
            Backbone: true,
            Handlebars: true,

            // Test
            casper: true,

            // Debug
            console: true
        };

        options.ignores = [
            "spike/sniper/auction_sniper/public/js/vendor/**/*.js",
            "spike/sniper/fake_auction/public/js/vendor/**/*.js"
        ];

        return options;
    }
};
