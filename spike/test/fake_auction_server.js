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
            casper.start(URL);

            casper.then(function() {
                test.assertVisible('.container h1', 'Main header is visible');
                test.assertSelectorHasText('.container h1', 'Auction House');
            });
        };

        FakeAuctionServer.prototype.hasReceivedJoinRequestFromSniper = function(test) {
            casper.thenOpen(URL);

            casper.then(function() {
                test.assertVisible('.container h2', 'Secondary header is visible');
                test.assertSelectorHasText('.container h2', 'Bidders');
            });
        };

        FakeAuctionServer.prototype.announceClosed = function(test) {
            casper.then(function() {
                test.assertVisible('.container .lots', 'Lot is visible');
                test.assertSelectorHasText('.container .lots p', '12345');
            });
        };
    };

})();
