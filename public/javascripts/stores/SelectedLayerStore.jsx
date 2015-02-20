var Reflux = require('reflux');
var Actions = require('../actions.jsx');

var SelectedLayerStore = Reflux.createStore({
    init: function(){
        this.listenTo(Actions.layerSelected, this.onLayerSelected);
    },

    onLayerSelected: function(source_url, layer_uri){
        this.source_url = source_url;
        this.layer_uri = layer_uri;

        this.trigger(this.source_url, this.layer_uri);
    }
});

module.exports = SelectedLayerStore;
