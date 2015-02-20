var React = require('react');
var GoogleMapsLoader = require('google-maps');
var LogoPanel = require('./LogoPanel.jsx');
var NavBar = require('./NavBar.jsx');
var Actions = require('../actions.jsx');

var MapStore = require('../stores/MapStore.jsx');
var SourcesStore = require('../stores/SourcesStore.jsx');
var VisibleSourcesStore = require('../stores/VisibleSourcesStore.jsx');

var Reflux = require('reflux');

var _ = require('lodash');

var MapManager = React.createClass({
    mixins: [
        Reflux.connect(SourcesStore, "sources"),
        Reflux.listenTo(VisibleSourcesStore, "onVisibleSourcesChange")
    ],

    visibleSourceKML: {},
    onVisibleSourcesChange: function(visibleSources){
        // For each visible source
        _.each(visibleSources, function(visibleSource, source_url){
            // Create a new visible KML source group if necessary
            if(!(source_url in this.visibleSourceKML)){
                this.visibleSourceKML[source_url] = {};
            }

            // Create sets of keys for differencing below
            var currentKeys = _.keys(this.visibleSourceKML[source_url]);
            var newKeys = _.keys(visibleSource);

            // Add newly visible layers
            var addedKeys = _.difference(newKeys, currentKeys);
            addedKeys.forEach(function(layer_uri){
                var url = "http://" + source_url + "/layer/" + layer_uri + "/kml";
                var kml = new MapStore.google.maps.KmlLayer({
                    url: url,
                    preserveViewport: true
                });
                kml.setMap(MapStore.map);

                MapStore.google.maps.event.addListener(kml, 'click', function(){
                    Actions.layerSelected(source_url, layer_uri);
                });

                this.visibleSourceKML[source_url][layer_uri] = kml;
            }, this);

            // Remove no longer visible layers
            var removedKeys = _.difference(currentKeys, newKeys);
            removedKeys.forEach(function(layer_uri){
                this.visibleSourceKML[source_url][layer_uri].setMap(null);
                MapStore.google.maps.event.clearInstanceListeners(this.visibleSourceKML[source_url][layer_uri]);
                delete this.visibleSourceKML[source_url][layer_uri];
            }, this);
        }, this);
    },

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
            </div>
        );
    }
});

module.exports = MapManager;
