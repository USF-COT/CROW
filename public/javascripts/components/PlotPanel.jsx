var React = require('react');
var Reflux = require('reflux');
var MapPanelMixin = require('./MapPanelMixin.jsx');
var VisibleSourcesStore = require('../stores/VisibleSourcesStore.jsx');
var SelectedLayerStore = require('../stores/SelectedLayerStore.jsx');

var _ = require('lodash');
var d3 = require('d3');

var PlotPanel = React.createClass({
    mixins: [MapPanelMixin, Reflux.connect(VisibleSourcesStore, "sources"), Reflux.listenTo(SelectedLayerStore, "onLayerSelect")],

    onPlotFormSubmit: function(e){
        e.preventDefault();
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

    onFormFieldSelect: function(field){
        this.setState({
            "selected_field_uri": event.target.value
        });
    },

    render: function(){
        var emptyOption = (
            <option value={null}></option>
        );

        var sourceOptions = [];
        sourceOptions.push(emptyOption);
        _.each(this.state.sources, function(source){
            sourceOptions.push(
                <option value={source.url}>{source.provider.short_name}</option>
            );
        }, this);

        var layerOptions = [];
        layerOptions.push(emptyOption);
        layers = VisibleSourcesStore.getLayers(this.state.selected_source_url);
        if(layers){
            _.each(layers, function(layer){
                layerOptions.push(
                    <option value={layer.uri}>{layer.name}</option>
                );
            }, this);
        }

        var fieldOptions = [];
        fieldOptions.push(emptyOption);
        var layer = VisibleSourcesStore.getLayer(this.state.selected_source_url, this.state.selected_layer_uri);
        if(layer){
            _.each(layer.fields, function(field){
                fieldOptions.push(
                    <option value={field.uri}>{field.name}</option>
                );
            });
        }

        return (
<div id="plot-region">
    <div id="plot-panel" className="panel">
        <div className="panel-heading">
            <h3 className="panel-title">Plot Data</h3>
        </div>
        <div className="panel-body">
            <div className="container-fluid">
                <div className="row">
                    <div classNam="col-md-12">
                        <form className="form" onSubmit={this.onPlotFormSubmit}>
                            <label className="sr-only">Data Source</label>
                            <select name="source_url" className="form-control plot-select" value={this.state.selected_source_url} onChange={this.onFormSourceSelect}>
                                {sourceOptions}
                            </select>

                            <label className="sr-only">Layer</label>
                            <select name="layer_uri" className="form-control plot-select" value={this.state.selected_layer_uri} onChange={this.onFormLayerSelect}>
                                {layerOptions}
                            </select>

                            <label className="sr-only">Field</label>
                            <select name="field_uri" className="form-control plot-select" value={this.state.selected_field_uri} onChange={this.onFormFieldSelect}>
                                {fieldOptions}
                            </select>

                            <button className="btn btn-primary" type="submit">Plot</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
        );
    }
});

module.exports = PlotPanel;
