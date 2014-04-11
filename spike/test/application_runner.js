/**
 * Created by Glen Pinner on 08/04/2014.
 */

(function () {
    'use strict';

    var ApplicationRunner = module.exports = function() {

        var URL = 'http://localhost:3000';

        ApplicationRunner.prototype.startBiddingIn = function(test, auction) {
            casper.thenOpen(URL);

            casper.then(function() {
                test.assertVisible('.container h1', 'Main header is visible');
                test.assertSelectorHasText('.container h1', 'Auction Sniper');
            });
        };

        ApplicationRunner.prototype.showsSniperHasLostAuction = function(test) {
            casper.thenOpen(URL);

            casper.then(function() {
                test.assertVisible('.container .lots', 'Status is visible');
                test.assertSelectorHasText('.container .lots p span', 'Not available');
            });

        };
    };

})();
