var React = require('react');
var Reflux = require('reflux');

var Actions = require('../actions.jsx');
var DatasetsStore = require('../stores/DatasetsStore.jsx');

var EditPlotsRow = React.createClass({
    removeClicked: function(e){
        e.preventDefault();
        Actions.removeDataset(this.props.dataset);
    },

    render: function(){
        var colorStyle = {
            "backgroundColor": this.props.dataset.color
        };
        return (
<tr>
    <td style={colorStyle}></td>
    <td>{this.props.dataset.layer_uri}</td>
    <td>{this.props.dataset.field.name}</td>
    <td><button className="btn btn-danger" onClick={this.removeClicked}><i className="fa fa-minus"></i> Remove</button></td>
</tr>
        );
    }
});

var EditPlotsModal = React.createClass({
    removeClicked: function(index){
        Actions.removeDataset(index);
    },

    render: function(){
        var datasetRows = [];
        if(this.props.datasetsStore){
            datasetRows = this.props.datasetsStore.datasets.map(function(dataset, i){
                return (
                    <EditPlotsRow dataset={dataset} />
                );
            });
        }

        return (
<span className="editPlotsModalDiv">
    <button type="button" className="btn btn-info btn-block" data-toggle="modal" data-target="#editPlotsModal">
        <i className="fa fa-pencil-square-o"></i> Edit Plots
    </button>
    
    <div className="modal fade" id="editPlotsModal" tabindex="-1" role="dialog" aria-labelledby="editPlotsModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title" id="editPlotsModalLabel">Edit Plots</h4>
                </div>
                <form className="form">
                    <div className="modal-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Color</th>
                                    <th>Layer</th>
                                    <th>Field</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {datasetRows} 
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                    </div>
                </form>
            </div>
        </div>
    </div>
</span>
        );
    }
});

module.exports = EditPlotsModal;
