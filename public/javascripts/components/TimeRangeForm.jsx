var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions.jsx');

var TimeRangeStore = require('../stores/TimeRangeStore.jsx');

var $ = require('jquery');
var moment = require('moment');

var TimeRangeForm = React.createClass({
    mixins: [Reflux.connect(TimeRangeStore, "range")],

    getInitialState: function(){
        return {
            "range": {
                "start": moment().subtract(5, 'days'),
                "end": moment()
            }
        };
    },

    onStartRangeChange: function(e){
        Actions.timeRangeChanged(e.target.value, this.state.range.end);
    },

    onEndRangeChange: function(e){
        Actions.timeRangeChanged(this.state.range.start, e.target.value);
    },

    componentDidMount: function(){
        $('#startDatePicker').datetimepicker();
        $('#endDatePicker').datetimepicker();

        $('#startDatePicker').on("dp.change", function(e){
            $('#endDatePicker').data("DateTimePicker").minDate(e.date);
        });

        $('#endDatePicker').on("dp.change", function(e){
            $('#startDatePicker').data("DateTimePicker").maxDate(e.date);
        });

        $('#startDatePicker').data("DateTimePicker").date(this.state.range.start);
        $('#endDatePicker').data("DateTimePicker").date(this.state.range.end);
    },

    render: function(){
        return (
<form className={this.props.formClass}>
    <div className="form-group">
        <label for="startDate">From:</label>
        <input id="startDatePicker" name="startDate" type="text" className="form-control" onChange={this.onStartRangeChange} />
    </div>

    <div className="form-group">
        <label for="endDate">to</label>
        <input id="endDatePicker" name="endDate" type="text" className="form-control" onChange={this.onEndRangeChange} />
    </div>
</form>
        );
    }
});

module.exports = TimeRangeForm;
