var React = require('react');
var MapPanelMixin = require('./MapPanelMixin.jsx');

var LayerItem = React.createClass({
    onClick: function(e){
        e.stopPropagation();
    },

    onChange: function(e){
        console.log(e);
    },

    render: function(){
        return (
            <li onClick={this.onClick}>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" onChange={this.onChange} /> {this.props.layer.name}
                    </label>
                </div>
            </li>
        );
    }
});

var NavBarDropDown = React.createClass({
    render: function(){
        var categorizedLayers = _.groupBy(this.props.layers, function(layer){
            return layer.station_type;
        });

        var sourceLayers = [];
        _.each(categorizedLayers, function(layers, category){
            var layerItems = layers.map(function(layer){
                return (
                    <LayerItem key={layer.uri} layer={layer} />
                );
            });
            sourceLayers.push(
                <div key={this.props.provider.short_name + "." + category}>
                    <label className="layer-group-header">{category}</label>
                    <ul className="layer-group-ul">
                        {layerItems}
                    </ul>
                </div>
            );
        }, this);

        return (
            <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{this.props.provider.short_name}<span className="caret"></span></a>
                <ul className="dropdown-menu layers-ul" role="menu">
                    {sourceLayers}
                </ul>
            </li>
        );
    }
});

var NavBar = React.createClass({
    mixins: [MapPanelMixin],

    render: function(){
        var dropDowns = [];
        if(this.props.sources){
            dropDowns = this.props.sources.map(function(source){
                return (
                    <NavBarDropDown key={source.provider.url} provider={source.provider} layers={source.layers} />
                );
            });
        }

        return (
            <div id="nav-region">
                <div id="nav-container">
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
            </div>
        );
    }
});

module.exports = NavBar;
