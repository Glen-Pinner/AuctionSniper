/**
 * Created by Glen Pinner on 09/04/2014.
 */

(function () {
    'use strict';

    var URL = 'http://bbc.co.uk';

    var Bar = module.exports = function(casper) {

        Bar.prototype.getTitle = function() {
            casper.thenOpen(URL, function() {
                this.echo(this.getTitle());
            });
        };
    };

})();
