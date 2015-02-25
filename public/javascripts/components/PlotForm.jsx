var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions.jsx');

var VisibleSourcesStore = require('../stores/VisibleSourcesStore.jsx');
var SelectedLayerStore = require('../stores/SelectedLayerStore.jsx');

var _ = require('lodash');
var $ = require('jquery');

var PlotForm = React.createClass({
    mixins: [Reflux.connect(VisibleSourcesStore, "sources"), Reflux.listenTo(SelectedLayerStore, "onLayerSelect")],

    onPlotFormSubmit: function(e){
        e.preventDefault();
        Actions.addDataset(this.state.selected_source_url, this.state.selected_layer_uri, this.state.selected_field_uri);
    },

    getInitialState: function(){
        return {
            "selected_source_url": null,
            "selected_layer_uri": null,
            "selected_field_uri": null,
            "sources": {}
        };
    },

    onLayerSelect: function(source_url, layer_uri){
        this.setState({
            "selected_source_url": source_url,
            "selected_layer_uri": layer_uri
        });
    },

    onFormSourceSelect: function(event){
        this.setState({
            "selected_source_url": event.target.value,
            "selected_layer_uri": null,
            "selected_field_uri": null
        });
    },

    onFormLayerSelect: function(event){
        this.setState({
            "selected_layer_uri": event.target.value,
            "selected_field_uri": null
        });
    },

    onFormFieldSelect: function(event){
        this.setState({
            "selected_field_uri": event.target.value
        });
    },    

    componentDidMount: function(){
        $('#startDateTimePicker').datetimepicker();
        $('#endDateTimePicker').datetimepicker();
    },

    render: function(){
        var emptyOption = (
            <option value={null}></option>
        );

        var sourceOptions = [];
        sourceOptions.push(emptyOption);
        _.each(this.state.sources, function(source){
            sourceOptions.push(
                <option value={source.url} selected={source.url === this.state.selected_source_url}>{source.provider.short_name}</option>
            );
        }, this);

        var layerOptions = [];
        layerOptions.push(emptyOption);
        layers = VisibleSourcesStore.getLayers(this.state.selected_source_url);
        if(layers){
            _.each(layers, function(layer){
                layerOptions.push(
                    <option value={layer.uri} selected={layer.uri === this.state.selected_layer_uri}>{layer.name}</option>
                );
            }, this);
        }

        var fieldOptions = [];
        fieldOptions.push(emptyOption);
        var layer = VisibleSourcesStore.getLayer(this.state.selected_source_url, this.state.selected_layer_uri);
        if(layer){
            _.each(layer.fields, function(field){
                fieldOptions.push(
                    <option value={field.uri} selected={field.uri === this.state.selected_field_uri}>{field.name}</option>
                );
            }, this);
        }

        return (
<div className="row">
    <div className="col-md-12">
        <form className="form-inline" onSubmit={this.onPlotFormSubmit}>
            <div className="form-group">
                <h4 id="plot-panel-title">Plot Data</h4>
            </div>
            <div className="form-group">
                <label className="sr-only">Data Source</label>
                <select name="source_url" className="form-control plot-select" onChange={this.onFormSourceSelect}>
                    {sourceOptions}
                </select>
            </div>

            <div className="form-group">
                <label className="sr-only">Layer</label>
                <select name="layer_uri" className="form-control plot-select"  onChange={this.onFormLayerSelect}>
                    {layerOptions}
                </select>
            </div>

            <div className="form-group">
                <label className="sr-only">Field</label>
                <select name="field_uri" className="form-control plot-select"  onChange={this.onFormFieldSelect}>
                    {fieldOptions}
                </select>
            </div>
            <button className="btn btn-primary" type="submit">Plot</button>
        </form>
    </div>
</div>
        );
    }
});

module.exports = PlotForm;
