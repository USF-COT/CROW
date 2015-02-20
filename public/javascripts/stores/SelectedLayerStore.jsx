var Reflux = require('reflux');
var Actions = require('../actions.jsx');

var SelectedLayerStore = Reflux.createStore({
    init: function(){
        this.selected_key = {
            "source_url": null,
            "layer_uri": null
        };
        this.listenTo(Actions.layerSelected, this.onLayerSelected);
    },

    onLayerSelected: function(source_url, layer_uri){
        this.selected_key = {
            "source_url": source_url,
            "layer_uri": layer_uri
        };
        this.trigger(this.selected_layer_key);
    }
});

module.exports = SelectedLayerStore;
