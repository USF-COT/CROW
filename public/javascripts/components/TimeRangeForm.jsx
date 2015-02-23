var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions.jsx');

var TimeRangeStore = require('../stores/TimeRangeStore.jsx');

var $ = require('jquery');
var moment = require('moment');

var TimeRangeForm = React.createClass({
    mixins: [Reflux.listenTo(TimeRangeStore, "onRangeChange")],

    onRangeChange: function(range){
        $('#startDatePicker').data("DateTimePicker").date(range.start);
        $('#endDatePicker').data("DateTimePicker").date(range.end);
    },

    componentDidMount: function(){
        $('#startDatePicker').datetimepicker();
        $('#endDatePicker').datetimepicker();

        $('#startDatePicker').on("dp.change", function(e){
            $('#endDatePicker').data("DateTimePicker").minDate(e.date);
            Actions.timeRangeChanged(e.date, TimeRangeStore.range.end);
        });

        $('#endDatePicker').on("dp.change", function(e){
            $('#startDatePicker').data("DateTimePicker").maxDate(e.date);
            Actions.timeRangeChanged(TimeRangeStore.range.start, e.date);
        });

        $('#startDatePicker').data("DateTimePicker").date(TimeRangeStore.range.start);
        $('#endDatePicker').data("DateTimePicker").date(TimeRangeStore.range.end);
    },

    render: function(){
        return (
<form className={this.props.formClass}>
    <div className="form-group">
        <label for="startDate">From:</label>
        <input id="startDatePicker" name="startDate" type="text" className="form-control" />
    </div>

    <div className="form-group">
        <label for="endDate">to</label>
        <input id="endDatePicker" name="endDate" type="text" className="form-control" />
    </div>
</form>
        );
    }
});

module.exports = TimeRangeForm;
