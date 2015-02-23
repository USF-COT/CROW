var React = require('react');
var GoogleMapsLoader = require('google-maps');
var LogoPanel = require('./LogoPanel.jsx');
var NavBar = require('./NavBar.jsx');
var PlotPanel = require('./PlotPanel.jsx');
var Actions = require('../actions.jsx');

var SourcesStore = require('../stores/SourcesStore.jsx');
var KMLLayerStore = require('../stores/KMLLayerStore.jsx');

var Reflux = require('reflux');

var _ = require('lodash');

var MapManager = React.createClass({
    mixins: [
        Reflux.connect(SourcesStore, "sources"),
        Reflux.connect(KMLLayerStore, "visibleSourceKML")
    ],

    componentDidMount: function(){
        // Google Map load call done here because coupling to DOM in render method
        GoogleMapsLoader.KEY = 'AIzaSyCM0VMLhaVUkmn9jKpSrh1mIZB2G8RJw9E';
        GoogleMapsLoader.load(function(google){
            var mapOptions = {
                center: new google.maps.LatLng(27.760603, -84.632873),
                zoom: 7,
                mapTypeId: google.maps.MapTypeId.HYBRID,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                panControl: true,
                panControlOptions: {
                    position: google.maps.ControlPosition.RIGHT
                },
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE,
                    position: google.maps.ControlPosition.RIGHT
                },
                scaleControl: true,
                scaleControlOptions: {
                    position: google.maps.ControlPosition.RIGHT
                },
                streetViewControl: false
            };
            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            Actions.mapLoaded(google, map);
        });
    },

    render: function(){
        return(
            <div id="map">
                <div id="map-canvas"></div>
                <LogoPanel position="TOP_LEFT" />
                <NavBar position="TOP_CENTER" sources={this.state.sources} />
                <PlotPanel position="BOTTOM_CENTER" />
            </div>
        );
    }
});

module.exports = MapManager;
