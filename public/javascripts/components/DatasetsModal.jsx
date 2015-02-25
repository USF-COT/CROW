var React = require('react');
var Reflux = require('reflux');

var DatasetsStore = require('../stores/DatasetsStore.jsx');

var $ = require('jquery');

var DatasetsModal = React.createClass({
    mixins: [Reflux.connect(DatasetsStore, "datasets")],

    render: function(){
        return (
<div className="modal fade">
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
            </div>
            <div className="modal-body">
            </div>
            <div className="modal-footer">
            </div>
        </div>
    </div>
</div>
        );
    }
});

module.exports = DatasetsModal;
