var React = require('react');

var Router = require('react-router');
var Route = Router.Route;

var CROWApp = require('./components/CROWApp.jsx');

/*
var routes = (
    <Route handler={CROWApp} path="/">
    </Route>
);

Router.run(routes, function(Handler){
    React.render(<Handler />, document.getElementById('crowapp'));
});
*/

React.render(
    <CROWApp />,
    document.getElementById('crowapp')
);
