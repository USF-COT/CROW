var React = require('react');
var MapPanelMixin = require('./MapPanelMixin.jsx');

var LogoPanel = React.createClass({
    mixins: [MapPanelMixin],

    render: function(){
        return (
            <div id="logo-region">
                <img id="logo" src="/images/CROWLogo150.png" alt="CROW Logo" />
            </div>
        );
    }
});

module.exports = LogoPanel;
