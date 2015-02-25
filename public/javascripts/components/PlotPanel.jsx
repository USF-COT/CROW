var React = require('react');
var MapPanelMixin = require('./MapPanelMixin.jsx');
var PlotForm = require('./PlotForm.jsx');
var PlotSVG = require('./PlotSVG.jsx');

var PlotPanel = React.createClass({
    mixins: [MapPanelMixin],

    render: function(){
        return (
<div id="plot-region">
    <div id="plot-container" className="control-box">
        <div class="plot-panel" className="panel">
            <div className="panel-heading">
                <PlotForm />
            </div>
            <div className="container-fluid">
                <PlotSVG />
            </div>
        </div>
    </div>
</div>
        );
    }
});

module.exports = PlotPanel;
