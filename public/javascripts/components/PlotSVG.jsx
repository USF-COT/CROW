var React = require('react');
var Reflux = require('reflux');

var DatasetsStore = require('../stores/DatasetsStore.jsx');

var d3 = require('d3');
var _ = require('lodash');

var PlotSVG = React.createClass({
    mixins: [Reflux.ListenerMixin],

    margins: {
        'top': 0,
        'right': 10,
        'bottom': 20,
        'left': 10
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

        this.yScale= d3.scale.linear()
            .range([(this.margins.top + this.dim.height), this.margins.top]);

        this.touchYScale = d3.scale.linear()
            .domain([0, 1])
            .range([(this.margins.top + this.dim.height), this.margins.top]);

        this.colorScale = d3.scale.category10();
    },

    onTouch: function(){
        this.updateBars(d3.touches(this.svg.node()));
    },

    onMouse: function(){
        this.updateBars([d3.mouse(this.svg.node())]);
    },

    updateBars: function(points){
        var touchBarData = this.svg.selectAll('.touch-bar-group')
            .data(points, function(d) { return d.identifier; });

        var touchBarGroup = touchBarData.enter()
            .append('g')
                .attr('class', 'touch-bar-group');

        touchBarGroup
            .append('line');

        touchBarGroup
            .append('g')
                .attr('class', 'legend')
                .append('rect')
                    .attr('class', 'legend-background');

        var dim = this.dim;
        var timeScale = this.timeScale;
        var yScale = this.yScale;
        var touchYScale = this.touchYScale;
        var colorScale = this.colorScale;

        var touchBarLine = touchBarData.select('line')
            .attr('x1', function(touch){ return touch[0]; })
            .attr('x2', function(touch){ return touch[0]; })
            .attr('y1', function(touch){ return touchYScale(0); })
            .attr('y2', function(touch){ return touchYScale(1); });

        var legend = touchBarData.select('.legend')
            .attr('render-order', 1)
            .attr('transform', function(dataset){
                var touchBarPosition = parseFloat(touchBarLine.attr('x1'));
                var barOffset = 5; // Get it off the touch bar
                var width = this.getBBox().width;
                var position = touchBarPosition + barOffset;
                if(position + width > dim.width){
                    position = touchBarPosition - (barOffset*2) - width; // Throw box to the left
                }
                return "translate("+position+", 0)";
            });

        var datasetGroup = legend.selectAll('.dataset-value')
            .data(DatasetsStore.datasets);

        datasetGroup.enter()
            .append('g')
                .attr('class', 'dataset-value')
                .append('text');

        datasetGroup.select('text')
            .attr('stroke', function(dataset, i){
                return colorScale(i % 10);
            })
            .attr('fill', function(dataset, i){
                return colorScale(i % 10);
            })
            .text(function(dataset){
                var timeTarget = timeScale.invert(parseFloat(touchBarLine.attr('x1'))).getTime()/1000;
                var data = dataset.data;

                var extent = d3.extent(data, function(d) { return d[1]; });
                var nearestPoint = _.find(data, function(datum){
                    return datum[0] > timeTarget;
                });

                if(nearestPoint){
                    return dataset.station_uri + " " + dataset.field.name + " " + nearestPoint[1] + " " + dataset.field.units;
                } else {
                    return "NO DATA";
                }
            })
            .attr('x', 0)
            .attr('y', function(dataset, i) {
                return (i+1)*this.getBBox().height;
            })
            .attr('dx', 5)
            .attr('dy', 2);

        var legendBackgroundMargin = 5;
        legend.select('.legend-background')
                .attr('x', 0)
                .attr('y', 0)
                .attr('height', function(){
                    return this.parentNode.getBBox().height;
                })
                .attr('width', function(){
                    return this.parentNode.getBBox().width;
                });

        datasetGroup.exit().remove();

        touchBarData.exit().remove();
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

        datasetGroups.enter().insert('g', '.touch-bar-group')
            .attr('class', 'dataset')
            .append('path').attr('class','line');

        datasetGroups.select('path')
                .attr('stroke', function(dataset, i){
                    return colorScale(i % 10);
                })
                .attr('d', function(dataset){
                    yScale.domain([0 , 1]);
                    var line = d3.svg.line()
                        .interpolate('linear')
                        .x(function(pair) { return timeScale(new Date(pair[0] * 1000)); })
                        .y(function(pair) { return yScale(0); });

                    return line(dataset.data);
                })
                .transition().duration(1000).ease('sin-in-out')
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

        this.svg
            .on('touchmove', this.onTouch)
            .on('mousemove', this.onMouse);

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
