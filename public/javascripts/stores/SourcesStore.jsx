var Reflux = require('reflux');
var Actions = require('../actions.jsx');
var SourcesStoreMixin = require('./SourcesStoreMixin.jsx');

var _ = require('lodash');

var SourcesStore = Reflux.createStore({
    mixins: [SourcesStoreMixin],

    init: function(){
        this.sources = {};
        this.listenTo(Actions.loadFeeds.completed, this.onLoadFeeds);
        this.listenTo(Actions.loadSource.completed, this.onLoadSource);
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
        }, this);

        this.trigger(this.sources);
    }
});

module.exports = SourcesStore;
