var React = require('react');
var MapPanelMixin = require('./MapPanelMixin.jsx');
var Actions = require('../actions.jsx');

var TimeRangeForm = require('./TimeRangeForm.jsx');

var _ = require('lodash');

var LayerItem = React.createClass({
    getInitialState: function(){
        return {
            "checked": false
        };
    },

    onChange: function(e){
        if(e.target.checked){
            Actions.showLayer(this.props.source.url, this.props.layer.uri);
        } else {
            Actions.hideLayer(this.props.source.url, this.props.layer.uri);
        }
    },

    componentDidMount: function(){
        Actions.showLayer.listen(function(source_url, layer_uri){
            if((source_url == this.props.source.url) && (layer_uri == this.props.layer.uri)){
                this.setState({
                    "checked": true
                });
            }
        }, this);

        Actions.hideLayer.listen(function(source_url, layer_uri){
            if((source_url == this.props.source.url) && (layer_uri == this.props.layer.uri)){
                this.setState({
                    "checked": false
                });
            }
        }, this);
    },

    render: function(){
        return (
            <li onClick={this.onClick}>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" onChange={this.onChange} checked={this.state.checked} /> {this.props.layer.name}
                    </label>
                </div>
            </li>
        );
    }
});

var NavBarDropDown = React.createClass({
    render: function(){
        var categorizedLayers = _.groupBy(this.props.source.layers, function(layer){
            return layer.station_type;
        });

        var sourceLayers = [];
        _.each(categorizedLayers, function(layers, category){
            var layerItems = layers.map(function(layer){
                return (
                    <LayerItem key={layer.uri} source={this.props.source} layer={layer} />
                );
            }, this);
            sourceLayers.push(
                <div key={this.props.source.provider.short_name + "." + category}>
                    <label className="layer-group-header">{category}</label>
                    <ul className="layer-group-ul">
                        {layerItems}
                    </ul>
                </div>
            );
        }, this);

        return (
            <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{this.props.source.provider.short_name}<span className="caret"></span></a>
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
            _.each(this.props.sources, function(source){
                dropDowns.push(
                    <NavBarDropDown key={source.provider.url} source={source} />
                );
            });
        }

        return (
            <div id="nav-region">
                <div id="nav-container" className="control-box">
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
                            <TimeRangeForm formClass="navbar-form navbar-right" />
                          </div>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }
});

module.exports = NavBar;
