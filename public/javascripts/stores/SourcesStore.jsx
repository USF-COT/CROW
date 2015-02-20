var Reflux = require('reflux');
var Actions = require('../actions.jsx');
var _ = require('lodash');

var SourcesStore = Reflux.createStore({
    init: function(){
        this.sources = {};
        this.listenTo(Actions.loadFeeds.completed, this.onLoadFeeds);
        this.listenTo(Actions.loadSource.completed, this.onLoadSource);
    },

    layerExists: function(source_url, layer_uri){
        if(source_url in this.sources){
            if(layer_uri in this.sources[source_url]){
                return true;
            }
        }
        return false;
    },

    getLayer: function(source_url, layer_uri){
        if(this.layerExists(source_url, layer_uri)){
            return this.sources[source_url][layer_uri];
        }

        return undefined;
    },

    onLoadFeeds: function(feeds){
        feeds.forEach(function(feed){
            Actions.loadSource(feed.url);
        });
    },

    onLoadSource: function(source){
        this.sources[source.url] = source;

        _.forEach(source.layers, function(layer, layer_uri){
            Actions.showLayer(source.url, layer_uri);
        });

        this.trigger(this.sources);
    }
});

module.exports = SourcesStore;
