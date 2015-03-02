var React = require('react');
var Reflux = require('reflux');

var Actions = require('../actions.jsx');

var ExportDatasetsForm = require('./ExportDatasetsForm.jsx');

var EditPlotsRow = React.createClass({
    exportClicked: function(e){
        var content = "data:text/csv;charset=utf-8,";
        this.props.dataset.data.forEach(function(point){
            content += point[0] + ",";
            content += moment(point[0] * 1000).format() + ",";
            content += point[1] + "\r\n";
        }, this);
        e.currentTarget.href = encodeURI(content);
    },

    removeClicked: function(e){
        e.preventDefault();
        Actions.removeDataset(this.props.dataset);
    },

    render: function(){
        var colorStyle = {
            "backgroundColor": this.props.dataset.color
        };

        var downloadName = this.props.dataset.source_url + "-" + this.props.dataset.layer_uri + "-" + this.props.dataset.field_uri + ".csv";

        return (
<tr>
    <td style={colorStyle}></td>
    <td>{this.props.dataset.layer_uri}</td>
    <td>{this.props.dataset.field.name}</td>
    <td><button className="btn btn-danger" onClick={this.removeClicked}><i className="fa fa-minus"></i> Remove</button></td>
    <td><a download={downloadName} target="_blank" className="btn btn-info" onClick={this.exportClicked}><i className="fa fa-download"></i> Export</a></td>
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
                    <EditPlotsRow key={i} dataset={dataset} />
                );
            });
        }

        return (
<span className="editPlotsModalDiv">
    <button type="button" className="btn btn-info btn-block" data-toggle="modal" data-target="#editPlotsModal">
        <i className="fa fa-pencil-square-o"></i> Edit Plots
    </button>
    
    <div className="modal fade" id="editPlotsModal" tabIndex="-1" role="dialog" aria-labelledby="editPlotsModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title" id="editPlotsModalLabel">Edit Plots</h4>
                </div>
                <div className="modal-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Color</th>
                                <th>Layer</th>
                                <th>Field</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {datasetRows} 
                        </tbody>
                    </table>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-info" data-dismiss="modal" aria-label="Close">Close</button>
                </div>
            </div>
        </div>
    </div>
</span>
        );
    }
});

module.exports = EditPlotsModal;
