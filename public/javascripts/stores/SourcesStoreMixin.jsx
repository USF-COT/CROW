
var SourcesStoreMixin = {
    sourceExists: function(source_url){
        return (source_url in this.sources);
    },

    getSource: function(source_url){
        if(this.sourceExists(source_url)){
            return this.sources[source_url];
        }
        return undefined;
    },

    layerExists: function(source_url, layer_uri){
        if(source_url in this.sources){
            if(layer_uri in this.sources[source_url].layers){
                return true;
            }
        }
        return false;
    },

    getLayers: function(source_url){
        if(source_url in this.sources){
            return this.sources[source_url].layers;
        }

        return undefined;
    },

    getLayer: function(source_url, layer_uri){
        if(this.layerExists(source_url, layer_uri)){
            return this.sources[source_url].layers[layer_uri];
        }

        return undefined;
    },

    setLayer: function(source_url, layer_uri, layer){
        var layers = this.getLayers(source_url);
        layers[layer_uri] = layer;
    }
};

module.exports = SourcesStoreMixin;
