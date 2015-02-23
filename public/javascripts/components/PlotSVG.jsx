var React = require('react');
var Reflux = require('reflux');

var PlotsStore = require('../stores/PlotsStore.jsx');

var d3 = require('d3');

var PlotSVG = React.createClass({
    mixins: [Reflux.connect(PlotsStore, "plots")],

    componentDidMount: function(){
        
    },

    render: function(){
        return (
<div class="row">
    <div class="col-md-12">
        <svg id="plots-area"></svg>
    </div>
</div>
        );
    }
});

module.exports = PlotSVG;
