var Reflux = require('reflux');
var Actions = require('../actions.jsx');

var moment = require('moment');

var TimeRangeStore = Reflux.createStore({
    init: function(){
        this.range = this.getInitialState();
        this.listenTo(Actions.timeRangeChanged, this.onTimeRangeChanged);
    },

    getInitialState: function(){
        return {
            "start": moment().subtract(5, 'days'),
            "end": moment()
        };
    },

    onTimeRangeChanged: function(startDate, endDate){
        this.range.start = startDate;
        this.range.end = endDate;
        this.trigger(this.range);
    }
});

module.exports = TimeRangeStore;
