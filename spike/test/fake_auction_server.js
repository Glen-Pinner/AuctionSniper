/**
 * Created by Glen Pinner on 08/04/2014.
 */

(function () {
    'use strict';

    var FakeAuctionServer = module.exports = function(item) {

        var URL = 'http://localhost:3009';

        FakeAuctionServer.prototype.getItem = function() {
            return item;
        };

        FakeAuctionServer.prototype.startSellingItem = function(test) {
//            console.log('FakeAuctionServer.startSellingItem:', item);
            casper.start(URL);

            casper.then(function() {
                test.assertVisible('.container h1', 'Main header is visible');
                test.assertSelectorHasText('.container h1', 'Auction House');
            });
        };

        FakeAuctionServer.prototype.hasReceivedJoinRequestFromSniper = function() {
            console.log('FakeAuctionServer.hasReceivedJoinRequestFromSniper');
        };

        FakeAuctionServer.prototype.announceClosed = function() {
            console.log('FakeAuctionServer.announceClosed');
        };
    };

})();
