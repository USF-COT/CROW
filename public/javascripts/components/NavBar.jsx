var React = require('react');
var MapPanelMixin = require('./MapPanelMixin.jsx');

var LayerItem = React.createClass({
    onChange: function(e){
        console.log(e);
    },

    render: function(){
        return (
            <li>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" onChange={this.onChange}/> {this.props.layer.name}
                    </label>
                </div>
            </li>
        );
    }
});

var NavBarDropDown = React.createClass({
    render: function(){
        var sourceLayers = this.props.layers.map(function(layer){
            return (
                <LayerItem key={layer.uri} layer={layer} />
            );
        });
        return (
            <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{this.props.provider.short_name}<span className="caret"></span></a>
                <ul className="dropdown-menu" role="menu">
                    {sourceLayers}
                </ul>
            </li>
        );
    }
});

var NavBar = React.createClass({
    mixins: [MapPanelMixin],

    render: function(){
        var dropDowns = null;
        if(this.props.sources){
            dropDowns = this.props.sources.map(function(source){
                var blah = source;
                return (
                    <NavBarDropDown key={source.provider.uri} provider={source.provider} layers={source.layers} />
                );
            });
        }

        return (
            <div id="nav-region">
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                      <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                          <span className="sr-only">Toggle navigation</span>
                          <span className="icon-bar"></span>
                          <span className="icon-bar"></span>
                          <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">Layers</a>
                      </div>
                
                      <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            {dropDowns}
                        </ul>
                      </div>
                    </div>
                </nav>
            </div>
        );
    }
});

module.exports = NavBar;
