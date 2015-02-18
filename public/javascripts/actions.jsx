/*global require module */

var Reflux = require('reflux');

var Actions = Reflux.createActions({
    "mapLoaded": {},
    "loadFeeds": {children: ["completed", "failed"]},
    "loadLayers": {children: ["completed", "failed"]},
    "layerSelected": {},
    "layerUnselected": {},
});

Actions.loadFeeds.preEmit = function(){
    $.ajax({
        dataType: "json",
        url: "/feeds",
        success: Actions.loadFeeds.completed,
        failure: Actions.loadFeeds.failed
    });
};

Actions.loadLayers.preEmit = function(url){
    $.ajax({
        dataType: "jsonp",
        url: url + "/layers",
        success: Actions.loadLayers.completed,
        failure: Actions.loadLayers.failed
    });
};


module.exports = Actions;
