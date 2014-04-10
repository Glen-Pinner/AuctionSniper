/**
 * Created by Glen Pinner on 09/04/2014.
 */

(function () {
    'use strict';

    var amqp = require('amqp');

    var FakeAuctionServer = require('./fake_auction_server');
    var ApplicationRunner = require('./application_runner');

    var auction, application;

    before(function(done) {
        auction = new FakeAuctionServer('item-12345');
        application = new ApplicationRunner();
        done();
    });

    after(function(done) {
        application.stop();
        done();
    });

    describe('Auction Sniper end-to-end tests', function() {
        it('Sniper joins auction until auction closes', function() {
            auction.startSellingItem();
            application.startBiddingIn(auction);
            auction.hasReceivedJoinRequestFromSniper();
            auction.announceClosed();
            application.showsSniperHasLostAuction();
        });
    });

})();
