var Reflux = require('reflux');
var Actions = require('../actions.jsx');

var TimeRangeStore = require('./TimeRangeStore.jsx');

var DatasetsStore = Reflux.createStore({
    init: function(){
        this.datasets = [];

        this.listenTo(Actions.addDataset, this.onAddDataset);
        this.listenTo(Actions.removeDataset, this.onRemoveDataset);

        this.listenTo(Actions.loadDataset.completed, this.onDatasetLoaded);
        this.listenTo(Actions.loadDataset.failed, this.onDatasetLoadFailed);
    },

    onAddDataset: function(source_url, layer_uri, field_uri){
        var base_url = "//" + source_url + "/layer/" + layer_uri + "/field/" + field_uri + "/data";
        var url = base_url + "?start=" + TimeRangeStore.range.start.unix();
        url += "&end=" + TimeRangeStore.range.end.unix();

        this.datasets.push(url);
        this.trigger(this.datasets);

        /*
        Actions.loadDataset.listen(function(url){
            $.ajax({
                dataType: "jsonp",
                url: url,
                success: function(data){
                    Actions.loadDataset.completed(base_url, data);
                },
                failure: Actions.loadDataset.failed
            });
        });
        */
    },

    onRemoveDataset: function(index){
        if(index > 0 && index < datasets.length){
            datasets.splice(index);
            this.trigger(datasets);
        } else {
            console.log("Bad index passed to remove datasets action: " + index);
        }
    },

    onDatasetLoaded: function(base_url, data){
        console.log(base_url);
        console.log(data);
    },

    onDatasetLoadFailed: function(response){
        console.log("Error loading plot data: " + response);
    }
});

module.exports = DatasetsStore;
