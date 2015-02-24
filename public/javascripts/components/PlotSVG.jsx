var React = require('react');
var Reflux = require('reflux');

var TimeRangeStore = require('../stores/TimeRangeStore.jsx');
var DatasetsStore = require('../stores/DatasetsStore.jsx');

var d3 = require('d3');

var PlotSVG = React.createClass({
    mixins: [Reflux.ListenerMixin],

    margins: {
        'top': 20,
        'right': 20,
        'bottom': 20,
        'left': 20
    },

    onTimeRangeChange: function(range){
        this.timeScale.domain([range.start.toDate(), range.end.toDate()]);

        var timeAxis = d3.svg.axis().scale(this.timeScale).orient("bottom");
        this.svg.select('#timeAxis')
            .transition().duration(1000).ease('sin-in-out')
            .call(timeAxis);
    },

    setupTimeAxis: function(){
        this.timeScale = d3.time.scale()
            .domain([TimeRangeStore.range.start.toDate(), TimeRangeStore.range.end.toDate()])
            .range([this.margins.left, this.dim.width + this.margins.left]);
        this.timeScale.ticks(d3.time.hour, 12);

        var timeAxis = d3.svg.axis().scale(this.timeScale).orient("bottom");
        this.svg.append("g")
            .attr("id", "timeAxis")
            .attr("class", "timeX axis")
            .attr("transform", "translate(0,"+(this.dim.height+this.margins.top)+")")
            .call(timeAxis);
    },

    onDatasetsChange: function(datasets){
        var datasetGroups = this.svg.selectAll('.dataset')
            .data(datasets);
        
        datasetGroups.enter().append('g')
            .attr('class', 'dataset');
        datasetGroups.exit().remove();
    },

    componentDidMount: function(){
        this.svg = d3.select("#plots-area");
        this.dim = {
            height: parseInt(this.svg.style('height')) - (this.margins.top + this.margins.bottom),
            width: parseInt(this.svg.style('width')) - (this.margins.left + this.margins.right)
        };

        this.setupTimeAxis();

        this.listenTo(TimeRangeStore, this.onTimeRangeChange);
        this.listenTo(DatasetsStore, this.onDatasetsChange);
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
