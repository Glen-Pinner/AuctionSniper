/**
 * Created by Glen Pinner on 09/04/2014.
 */

(function () {
    'use strict';

    var casper = require('casper').create();

//    var Foo = require('./foo');
    var Bar = require('./bar');

//    var foo = new Foo(casper);
    var bar = new Bar(casper);

    var foo = new (require('./foo'))(casper);

    foo.getTitle();
    bar.getTitle();

    casper.run();

})();
