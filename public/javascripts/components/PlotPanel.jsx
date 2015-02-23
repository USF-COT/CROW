var React = require('react');
var MapPanelMixin = require('./MapPanelMixin.jsx');
var PlotForm = require('./PlotForm.jsx');

var PlotPanel = React.createClass({
    mixins: [MapPanelMixin],

    render: function(){
        return (
<div id="plot-region">
    <div id="plot-container" className="control-box">
        <div class="plot-panel" className="panel">
            <div className="panel-heading">
                <h3 className="panel-title">Plot Data</h3>
            </div>
            <div className="panel-body">
                <div className="container-fluid">
                    <PlotForm />
                </div>
            </div>
        </div>
    </div>
</div>
        );
    }
});

module.exports = PlotPanel;
