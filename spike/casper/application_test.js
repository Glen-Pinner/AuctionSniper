/**
 * Created by Glen Pinner on 04/04/2014.
 */

(function () {
    'use strict';

    casper.test.begin('Sniper joins auction until auction closes', function(test) {

        casper.test.setUp(function(done) {
            done();
        });

        casper.test.tearDown(function(done) {
            done();
        });

        casper.start('http://localhost:3000', function() {
            console.log("Connected to Auction Sniper");
        });

        casper.then(function() {
            test.assertVisible('.container h1', 'Main header is visible');
            test.assertSelectorHasText('.container h1', 'Auction Sniper');
        });

        casper.run(function() {
            test.done();
        });
    });

})();
