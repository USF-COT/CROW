var Reflux = require('reflux');
var Actions = require('../actions.jsx');

var MapStore = Reflux.createStore({
    init: function(){
        this.listenTo(Actions.mapLoaded, this.onMapLoaded);
    },

    onMapLoaded: function(google, map){
        this.google = google;
        this.map = map;

        this.trigger(google, map);
    }
});

module.exports = MapStore;
