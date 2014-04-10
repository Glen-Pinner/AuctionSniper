/**
 * Created by Glen Pinner on 09/04/2014.
 */

(function () {
    'use strict';

    var URL = 'http://figleaves.co.uk';

    var Foo = module.exports = function(casper) {

        Foo.prototype.getTitle = function() {
            casper.start(URL, function() {
                this.echo(this.getTitle());
            });
        };
    };

})();
