var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions.jsx');

var TimeRangeStore = require('../stores/TimeRangeStore.jsx');

var $ = require('jquery');
var moment = require('moment');

var TimeRangeForm = React.createClass({
    mixins: [Reflux.connect(TimeRangeStore, "range")],

    shouldComponentUpdate: function(){
        return false;
    },

    componentWillReceiveProps: function(props){
        $('#startDatePicker').data("DateTimePicker").date(this.state.range.start);
        $('#endDatePicker').data("DateTimePicker").date(this.state.range.end);
    },

    componentDidMount: function(){
        $('#startDatePicker').datetimepicker();
        $('#endDatePicker').datetimepicker();

        var range = this.state.range;
        $('#startDatePicker').on("dp.change", null, range, function(e){
            $('#endDatePicker').data("DateTimePicker").minDate(e.date);
            Actions.timeRangeChanged(e.date, e.data.end);
        });

        $('#endDatePicker').on("dp.change", null, range, function(e){
            $('#startDatePicker').data("DateTimePicker").maxDate(e.date);
            Actions.timeRangeChanged(e.data.start, e.date);
        });

        $('#startDatePicker').data("DateTimePicker").date(range.start);
        $('#endDatePicker').data("DateTimePicker").date(range.end);
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
