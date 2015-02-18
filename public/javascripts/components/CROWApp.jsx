var React = require('react');
var MapManager = require('./MapManager.jsx');
var Actions = require('../actions.jsx');

var CROWApp = React.createClass({
    componentWillMount: function(){
        Actions.loadFeeds();
    },

    render: function() {
        return (
            <MapManager />
        );
    }
});

module.exports = CROWApp;
