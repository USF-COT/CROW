var Reflux = require('reflux');
var Actions = require('../actions.jsx');

var TimeRangeStore = require('./TimeRangeStore.jsx');

var $ = require('jquery');
var d3 = require('d3');

var DatasetsStore = Reflux.createStore({
    init: function(){
        this.state = this.getInitialState();
        this.listenTo(Actions.addDataset, this.onAddDataset);
        this.listenTo(Actions.removeDataset, this.onRemoveDataset);

        this.listenTo(Actions.loadDataset, this.onDatasetLoadRequest);
        this.listenTo(Actions.loadDataset.completed, this.onDatasetLoaded);
        this.listenTo(Actions.loadDataset.failed, this.onDatasetLoadFailed);
        this.listenTo(TimeRangeStore, this.onTimeRangeChange);
    },

    getInitialState: function(){
        return {
            "range": TimeRangeStore.getInitialState(),
            "datasets": [],
            "colors": d3.scale.category10()
        };
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
        var promise = this._retrieveDataset(source_url, layer_uri, field_uri, this.state.range);

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

    onRemoveDataset: function(dataset){
        var index = this.findDatasetIndex(dataset.source_url, dataset.layer_uri, dataset.field_uri);

        if(index >= 0){
            this.state.datasets.splice(index, 1);
            this.trigger(this.state);
        } else {
            console.log("Bad index passed to remove datasets action: " + index);
        }
    },

    findDatasetIndex: function(source_url, layer_uri, field_uri){
        return _.findIndex(this.state.datasets, {
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
            dataset.color = this.state.colors(index % 10);
            this.state.datasets[index] = dataset;
        } else { // Insert new dataset
            dataset.color = this.state.colors(this.state.datasets.length % 10);
            this.state.datasets.push(dataset);
        }
    },

    onDatasetLoaded: function(dataset, source_url, layer_uri, field_uri){
        this.addDataset(dataset, source_url, layer_uri, field_uri);
        this.trigger(this.state);
    },

    onDatasetLoadFailed: function(response){
        console.log("Error loading plot data: " + response);
    },

    onTimeRangeChange: function(range){
        this.state.range = range;

        // Reload all plotted datasets
        var promises = [];
        this.state.datasets.forEach(function(dataset, i){
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
            context.trigger(context.state);
        });
    }
});

module.exports = DatasetsStore;
