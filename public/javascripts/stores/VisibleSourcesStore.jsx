var Reflux = require('reflux');
var Actions = require('../actions.jsx');
var SourcesStore = require('./SourcesStore.jsx');

var VisibleSourcesStore = Reflux.createStore({
    init: function(){
        this.visibleSources = {};
        this.listenTo(Actions.showLayer, this.onShowLayer);
        this.listenTo(Actions.hideLayer, this.onHideLayer);
    },

    layerExists: function(source_url, layer_uri){
        if(source_url in this.visibleSources){
            if(layer_uri in this.visibleSources[source_url]){
                return true;
            }
        }
        return false;
    },

    getLayer: function(source_url, layer_uri){
        if(this.layerExists(source_url, layer_uri)){
            return this.visibleSources[source_url][layer_uri];
        }

        return undefined;
    },

    onShowLayer: function(source_url, layer_uri){
        if(!(source_url in this.visibleSources)){
            this.visibleSources[source_url] = {};
        }

        this.visibleSources[source_url][layer_uri] = SourcesStore.getLayer(source_url, layer_uri);
        this.trigger(this.visibleSources);
    },

    onHideLayer: function(source_url, layer_uri){
        if(this.layerExists(source_url, layer_uri)){
            delete this.visibleSources[source_url][layer_uri];
            this.trigger(this.visibleSources);
        }
    }
});

module.exports = VisibleSourcesStore;
