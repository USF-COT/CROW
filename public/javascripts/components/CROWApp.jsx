var React = require('react');
var MapPanel = require('./MapPanel.jsx');

var CROWApp = React.createClass({
    getInitialState: function() {
        return {
            layers: []
        };
    },

    render: function() {
        return (
            <MapPanel />
        );
    }
});

module.exports = CROWApp;
