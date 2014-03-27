/**
 * Created by Glen Pinner on 27/03/2014.
 */

(function () {
    'use strict';

    // Backbone stuff
    var vent = _.extend({}, Backbone.Events);

    var DateModel = Backbone.Model.extend({
        defaults: {
            time: 'Hola'
        },

        initialize: function() {
            vent.on('time_event', this.updateTime, this);
        },

        updateTime: function(data) {
            var dateStr = data.the_time,
                date = new Date(dateStr),
                hours =  date.getHours() ,
                mins = date.getMinutes(),
                secs = date.getSeconds();

            this.set('time',
                    (hours < 10 ? '0' + hours : hours ) + ' : ' +
                    (mins < 10 ? '0' + mins : mins) + ' : ' +
                    (secs < 10 ? '0' + secs : secs));
        }
    });

    var DateView = Backbone.View.extend({
        el: '#contents',

        template: Handlebars.compile($('#date-template').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
        }
    });

    var date = new DateModel();

    var view = new DateView({
        model: date
    });

    // IO.socket stuff
    var socket = io.connect('http://localhost');

    socket.on('news', function (data) {
        console.log(data);

        socket.emit('my other event', { my: 'dumb data' });
    });

    socket.on('my time', function (data) {
        vent.trigger('time_event', data);
    });

})();
