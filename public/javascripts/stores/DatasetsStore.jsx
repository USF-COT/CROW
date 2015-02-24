var Reflux = require('reflux');
var Actions = require('../actions.jsx');

var TimeRangeStore = require('./TimeRangeStore.jsx');

var $ = require('jquery');

var DatasetsStore = Reflux.createStore({
    init: function(){
        this.range = TimeRangeStore.range;
        this.datasets = [];

        this.listenTo(Actions.addDataset, this.onAddDataset);
        this.listenTo(Actions.removeDataset, this.onRemoveDataset);

        this.listenTo(Actions.loadDataset, this.onDatasetLoadRequest);
        this.listenTo(Actions.loadDataset.completed, this.onDatasetLoaded);
        this.listenTo(Actions.loadDataset.failed, this.onDatasetLoadFailed);
        this.listenTo(TimeRangeStore, this.onTimeRangeChange);
    },

    _retrieveDataset: function(source_url, layer_uri, field_uri, range){
        var url = "//" + source_url + "/datasets";

        return $.ajax({
            dataType: "jsonp",
            data: {
                'layer_uri': layer_uri,
                'field_uri': field_uri,
                'start': range.start.unix(),
                'end': range.end.unix()
            },
            url: url
        });
    },

    onDatasetLoadRequest: function(source_url, layer_uri, field_uri){
        var promise = this._retrieveDataset(source_url, layer_uri, field_uri, this.range);

        promise.then(function(dataset){
                Actions.loadDataset.completed(dataset, source_url, layer_uri, field_uri);
        });
        promise.fail(Actions.loadDataset.failed);
    },

    onAddDataset: function(source_url, layer_uri, field_uri){
        if(this.findDatasetIndex(source_url, layer_uri, field_uri) == -1){
            Actions.loadDataset(source_url, layer_uri, field_uri);
        } else {
            console.log("Dataset already loaded");
        }
    },

    onRemoveDataset: function(index){
        if(index > 0 && index < datasets.length){
            this.datasets.splice(index);
            this.trigger(this.range, this.datasets);
        } else {
            console.log("Bad index passed to remove datasets action: " + index);
        }
    },

    findDatasetIndex: function(source_url, layer_uri, field_uri){
        return _.findIndex(this.datasets, {
            'source_url': source_url,
            'layer_uri': layer_uri,
            'field_uri': field_uri
        });
    },

    addDataset: function(dataset, source_url, layer_uri, field_uri){
        // Stuff search index details into dataset
        dataset.source_url = source_url;
        dataset.layer_uri = layer_uri;
        dataset.field_uri = field_uri;

        var index = this.findDatasetIndex(source_url, layer_uri, field_uri);

        // Update existing
        if(index != -1){
            this.datasets[index] = dataset;
        } else { // Insert new dataset
            this.datasets.push(dataset);
        }
    },

    onDatasetLoaded: function(dataset, source_url, layer_uri, field_uri){
        this.addDataset(dataset, source_url, layer_uri, field_uri);
        this.trigger(this.range, this.datasets);
    },

    onDatasetLoadFailed: function(response){
        console.log("Error loading plot data: " + response);
    },

    onTimeRangeChange: function(range){
        this.range = range;

        // Reload all plotted datasets
        var promises = [];
        this.datasets.forEach(function(dataset, i){
            var promise = this._retrieveDataset(dataset.source_url, dataset.layer_uri, dataset.field_uri, range);
            var context = this;
            promise.then(function(new_dataset){
                context.addDataset(new_dataset, dataset.source_url, dataset.layer_uri, dataset.field_uri);
            });
            promise.fail(Actions.loadDataset.failed);
            promises.push(promise);
        }, this);

        var context = this;
        $.when.apply($, promises).done(function(){
            context.trigger(context.range, context.datasets);
        });
    }
});

module.exports = DatasetsStore;
