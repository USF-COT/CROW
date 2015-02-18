var GoogleMapsLoader = require('google-maps');
var MapStore = require('../stores/MapStore.jsx');
var Reflux = require('reflux');

var MapPanelMixin = {
    mixins: [Reflux.ListenerMixin],

    onMapLoaded: function(google, map){
        var google_position = google.maps.ControlPosition[this.props.position];
        var DOM = this.getDOMNode();
        DOM.index = this.props.pos_index;
        map.controls[google_position].push(DOM);
    },

    componentDidMount: function(){
        this.listenTo(MapStore, this.onMapLoaded);
    }
};

module.exports = MapPanelMixin;
