var React = require('react');
var Reflux = require('reflux');

var MapPanelMixin = require('./MapPanelMixin.jsx');
var PlotForm = require('./PlotForm.jsx');
var PlotSVG = require('./PlotSVG.jsx');

var VisibleSourcesStore = require('../stores/VisibleSourcesStore.jsx');
var DatasetsStore = require('../stores/DatasetsStore.jsx');

var PlotPanel = React.createClass({
    mixins: [
        MapPanelMixin,
        Reflux.connect(VisibleSourcesStore, "visibleSources"),
        Reflux.connect(DatasetsStore, "datasetsStore")
    ],

    render: function(){
        return (
<div id="plot-region">
    <div id="plot-container" className="control-box">
        <div className="plot-panel panel">
            <div className="panel-heading">
                <PlotForm visibleSources={this.state.visibleSources} datasetsStore={this.state.datasetsStore} />
            </div>
            <div className="container-fluid">
                <PlotSVG datasetsStore={this.state.datasetsStore} />
            </div>
        </div>
    </div>
</div>
        );
    }
});

module.exports = PlotPanel;
