var React = require('react');
var GoogleMapsLoader = require('google-maps');

var MapPanel = React.createClass({
    getInitialState: function(){
        return {
            google: null,
            map: null
        };
    },

    componentDidMount: function(){
        GoogleMapsLoader.KEY = 'AIzaSyCM0VMLhaVUkmn9jKpSrh1mIZB2G8RJw9E';
        var local = this;
        GoogleMapsLoader.load(function(google){
            var map = new google.maps.Map(document.getElementById('map-canvas'), {
                center: { lat: -34.397, lng: 150.644},
                zoom: 8
            });
            local.setState({
                google: google,
                map: map
            });
        });
    },

    render: function(){
        return(
            <div id="map-canvas"></div>
        );
    }
});

module.exports = MapPanel;
