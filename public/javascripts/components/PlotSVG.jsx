var React = require('react');
var Reflux = require('reflux');

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

    setupAxis: function(){
        this.timeScale = d3.time.scale()
            .domain([DatasetsStore.range.start.toDate(), DatasetsStore.range.end.toDate()])
            .range([this.margins.left, this.dim.width + this.margins.left]);
        this.timeScale.ticks(d3.time.hour, 12);

        var timeAxis = d3.svg.axis().scale(this.timeScale).orient("bottom");
        this.svg.append("g")
            .attr("id", "timeAxis")
            .attr("class", "timeX axis")
            .attr("transform", "translate(0,"+(this.dim.height+this.margins.top)+")")
            .call(timeAxis);

        this.yScale = d3.scale.linear()
            .range([(this.margins.top + this.dim.height), this.margins.top]);

        this.colorScale = d3.scale.category20();
    },

    onDatasetsChange: function(range, datasets){
        // Update time scale
        this.timeScale.domain([range.start.toDate(), range.end.toDate()]);

        var timeAxis = d3.svg.axis().scale(this.timeScale).orient("bottom");
        this.svg.select('#timeAxis')
            .transition().duration(1000).ease('sin-in-out')
            .call(timeAxis);

        // Update plots
        var timeScale = this.timeScale;
        var yScale = this.yScale;
        var colorScale = this.colorScale;

        var datasetGroups = this.svg.selectAll('.dataset')
            .data(datasets);

        datasetGroups.enter().append('g')
            .attr('class', 'dataset')
            .append('path').attr('class','line');

        datasetGroups.select('path')
                .attr('stroke', function(dataset, i){
                    return colorScale(i % 20);
                })
                .attr('d', function(dataset){
                    var extent = d3.extent(dataset.data, function(d) { return d[1]; });
                    yScale.domain(extent);
                    var line = d3.svg.line()
                        .interpolate('linear')
                        .x(function(pair) { return timeScale(new Date(pair[0] * 1000)); })
                        .y(function(pair) { return yScale(pair[1]); });

                    return line(dataset.data);
                });

        datasetGroups.exit().remove();
    },

    componentDidMount: function(){
        this.svg = d3.select("#plots-area");
        this.dim = {
            height: parseInt(this.svg.style('height')) - (this.margins.top + this.margins.bottom),
            width: parseInt(this.svg.style('width')) - (this.margins.left + this.margins.right)
        };

        this.setupAxis();

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
