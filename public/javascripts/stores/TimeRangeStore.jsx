var Reflux = require('reflux');
var Actions = require('../actions.jsx');

var moment = require('moment');

var TimeRangeStore = Reflux.createStore({
    init: function(){
        this.range = {
            "start": moment().subtract(5, 'days'),
            "end": moment()
        };

        this.listenTo(Actions.timeRangeChanged, this.onTimeRangeChanged);
    },

    onTimeRangeChanged: function(startDate, endDate){
        this.range = {
            "start": startDate,
            "end": endDate
        };

        this.trigger(this.range);
    }
});

module.exports = TimeRangeStore;
