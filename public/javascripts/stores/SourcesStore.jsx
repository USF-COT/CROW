var Reflux = require('reflux');
var Actions = require('../actions.jsx');

var SourcesStore = Reflux.createStore({
    init: function(){
        this.sources = [];
        this.listenTo(Actions.loadFeeds.completed, this.onLoadFeeds);
        this.listenTo(Actions.loadLayers.completed, this.onLoadSource);
    },

    onLoadFeeds: function(feeds){
        feeds.forEach(function(feed){
            Actions.loadLayers(feed.url);
        });
    },

    onLoadSource: function(source){
        this.sources.push(source);
        this.trigger(this.sources);
    }
});

module.exports = SourcesStore;
