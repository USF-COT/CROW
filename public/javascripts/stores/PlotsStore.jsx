var Reflux = require('reflux');
var Actions = require('../actions.jsx');

var TimeRangeStore = require('./TimeRangeStore.jsx');

var PlotsStore = Reflux.createStore({
    init: function(){
        this.plots = [];

        this.listenTo(Actions.addPlotField, this.onAddPlotField);
        this.listenTo(Actions.removePlotField, this.onRemovePlotField);

        this.listenTo(Actions.loadPlotData.completed, this.onPlotDataLoaded);
        this.listenTo(Actions.loadPlotData.failed, this.onPlotDataFailed);
    },

    onAddPlotField: function(source_url, layer_uri, field_uri){
        var base_url = "//" + source_url + "/layer/" + layer_uri + "/field/" + field_uri + "/data";
        var url = base_url + "?start=" + TimeRangeStore.range.start.unix();
        url += "&end=" + TimeRangeStore.range.end.unix();

        Actions.loadPlotData.listen(function(url){
            $.ajax({
                dataType: "jsonp",
                url: url,
                success: function(data){
                    Actions.loadPlotData.completed(base_url, data);
                },
                failure: Actions.loadPlotData.failed
            });
        });
    },

    onRemovePlotField: function(index){
        if(index > 0 && index < plots.length){
            plots.splice(index);
            this.trigger(plots);
        } else {
            console.log("Bad index passed to remove plots action: " + index);
        }
    },

    onPlotDataLoaded: function(base_url, data){
        console.log(base_url);
        console.log(data);
    },

    onPlotDataFailed: function(response){
        console.log("Error loading plot data: " + response);
    }
});

module.exports = PlotsStore;
