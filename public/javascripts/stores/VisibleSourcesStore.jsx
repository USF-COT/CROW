var Reflux = require('reflux');
var Actions = require('../actions.jsx');
var SourcesStore = require('./SourcesStore.jsx');
var SourcesStoreMixin = require('./SourcesStoreMixin.jsx');

var _ = require('lodash');

var VisibleSourcesStore = Reflux.createStore({
    mixins: [SourcesStoreMixin],

    init: function(){
        this.sources = {};
        this.listenTo(Actions.showLayer, this.onShowLayer);
        this.listenTo(Actions.hideLayer, this.onHideLayer);
    },

    onShowLayer: function(source_url, layer_uri){
        if(!(source_url in this.sources)){
            var source = SourcesStore.getSource(source_url);
            this.sources[source_url] = _.omit(source, 'layers');
            this.sources[source_url].layers = {};
        }

        var layer = SourcesStore.getLayer(source_url, layer_uri);
        this.setLayer(source_url, layer_uri, layer);
        this.trigger(this.sources);
    },

    onHideLayer: function(source_url, layer_uri){
        if(this.layerExists(source_url, layer_uri)){
            delete this.sources[source_url].layers[layer_uri];

            if(_.size(this.sources[source_url].layers) === 0){
                delete this.sources[source_url];
            }

            this.trigger(this.sources);
        }
    }
});

module.exports = VisibleSourcesStore;
