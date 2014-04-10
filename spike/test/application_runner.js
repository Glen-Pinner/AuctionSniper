/**
 * Created by Glen Pinner on 08/04/2014.
 */

(function () {
    'use strict';

//    var child_process = require('child_process');

    var ApplicationRunner = module.exports = function() {

        var URL = 'http://localhost:3000';

        ApplicationRunner.prototype.startBiddingIn = function(test, auction) {
//            console.log('ApplicationRunner.startBiddingIn:', auction.getItem());
            casper.thenOpen(URL);

            casper.then(function() {
                test.assertVisible('.container h1', 'Main header is visible');
                test.assertSelectorHasText('.container h1', 'Auction Sniper');
            });
//            fakeAuctionServerProcess = auction;
        }

        ApplicationRunner.prototype.showsSniperHasLostAuction = function() {
            console.log('ApplicationRunner.showsSniperHasLostAuction');
        };

        ApplicationRunner.prototype.stop = function() {
//            casperJSProcess.on('close', function(code) {
                console.log('ApplicationRunner.stop');
//                auctionSniperProcess.kill();
//                fakeAuctionServerProcess.stop();
//            });
        };
    };

})();
