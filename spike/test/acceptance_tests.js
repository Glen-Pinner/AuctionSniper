/**
 * Created by Glen Pinner on 08/04/2014.
 */

(function () {
    'use strict';

//    var casper = require('casper').create();

    var FakeAuctionServer = require('./fake_auction_server');
    var ApplicationRunner = require('./application_runner');

    var auction, application;

    casper.test.setUp(function(done) {
        'use strict';

        auction = new FakeAuctionServer('item-12345');
        application = new ApplicationRunner();
        done();
    });

    casper.test.begin('Auction Sniper Tests', function(test) {
        auction.startSellingItem(test);
        application.startBiddingIn(test, auction);

    });
//    var auction = new FakeAuctionServer(casper, 'item-12345');
//    var application = new ApplicationRunner(casper);

//    auction.startSellingItem();
//    application.startBiddingIn(auction);
//    auction.hasReceivedJoinRequestFromSniper();
//    auction.announceClosed();
//    application.showsSniperHasLostAuction();

    casper.run();

//    casper.exit();

})();
