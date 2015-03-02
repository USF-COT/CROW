var React = require('react');

var ExportDatasetsForm = React.createClass({
    exportDatasets: function(e){
        e.preventDefault();
        var content = "data:text/csv;charset=utf-8,";
        var timestamp = this.props.datasetsStore.range.start;
    },

    render: function(){
        return (
<form className="form-inline" onSubmit={this.exportDatasets}>
    <button className="btn btn-primary" type="submit"><i className="fa fa-download"></i> Export</button>
</form>
        );
    }
});

module.exports = ExportDatasetsForm;
