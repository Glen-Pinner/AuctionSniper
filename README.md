# AuctionSniper

Based on the worked example from 'Growing Object-Oriented Software, Guided by Tests' by Steve Freeman
and Nat Pryce, this is a port of the Java application running over XMPP to JavaScript running Node.js
servers communicating via RabbitMQ.

The basic premise is to build the software, which places bids in an on-line auction depending on user
preferences, in an outside-in manner by defined by system use cases. The software is progressively
refined until each feature is built using acceptance, integration and unit tests.

The planned testing tools used are:

*   CasperJS for acceptance tests
*   Mocha, Chai and Sinon for integration and unit tests

Testing will be automated using Grunt.

Current status:
*   Building proof-of-concept using amqplib, auction sniper communicating with fake auction server

Next tasks:
*   Start test-driving Iteration 0

To do:
*   Look into fixing browser refresh with Socket.IO
