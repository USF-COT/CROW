/*global require module */

var Reflux = require('reflux');

var Actions = Reflux.createActions({
    "mapLoaded": {},
    "loadFeeds": {children: ["completed", "failed"]},
    "loadSource": {children: ["completed", "failed"]},
    "showLayer": {},
    "hideLayer": {},
    "layerSelected": {},
    "layerUnselected": {},
    "timeRangeChanged": {},
    "addPlotField": {},
    "loadPlotData": {children: ["completed", "failed"]},
    "removePlotField": {}
});

Actions.loadFeeds.preEmit = function(){
    $.ajax({
        dataType: "json",
        url: "/feeds",
        success: Actions.loadFeeds.completed,
        failure: Actions.loadFeeds.failed
    });
};

Actions.loadSource.preEmit = function(url){
    $.ajax({
        dataType: "jsonp",
        url: url + "/layers",
        success: Actions.loadSource.completed,
        failure: Actions.loadSource.failed
    });
};

module.exports = Actions;
