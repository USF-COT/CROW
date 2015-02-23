var Reflux = require('reflux');

var MapStore = require('./MapStore.jsx');
var VisibleSourcesStore = require('./VisibleSourcesStore.jsx');

var Actions = require('../actions.jsx');

var _ = require('lodash');

var KMLLayerStore = Reflux.createStore({
    init: function(){
        this.visibleSourceKML = {};
        this.listenTo(Actions.mapLoaded, this.onMapLoaded);
    },

    onMapLoaded: function(google, map){
        this.onVisibleSourcesChange(VisibleSourcesStore.sources);

        this.listenTo(VisibleSourcesStore, this.onVisibleSourcesChange);
    },

    onVisibleSourcesChange: function(visibleSources){
        // For each visible source
        _.each(visibleSources, function(visibleSource, source_url){
            // Create a new visible KML source group if necessary
            if(!(source_url in this.visibleSourceKML)){
                this.visibleSourceKML[source_url] = {};
            }

            // Create sets of keys for differencing below
            var currentKeys = _.keys(this.visibleSourceKML[source_url]);
            var newKeys = _.keys(visibleSource.layers);

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
    }
});

module.exports = KMLLayerStore;
