/*global require process module*/


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var bundle_url;
    var react_url;
    if (process.env.NODE_ENV === 'production'){
        bundle_url = '/javascripts/bundle.min.js';
        react_url = '//cdnjs.cloudflare.com/ajax/libs/react/0.12.2/react.min.js';
    }
    else {
        bundle_url = '/javascripts/bundle.js';
        react_url = '//cdnjs.cloudflare.com/ajax/libs/react/0.12.2/react.js';
    }

    res.render('index', {
        title: 'Centralized Remote Observations Website',
        bundle_url: bundle_url,
        react_url: react_url
    });
});

var config = require('config');

var db = require('mongoskin').db(config.get('FEED_MONGO_URL'));

router.get('/feeds', function(req, res, next){
    db.collection('feeds').find({}, {_id: 0}).toArray(function(err, result) {
        if(!err){
            res.jsonp(result);
        } else {
            res.status(500).jsonp({ "error": "Unable to connect to database"});
        }
    });
});

module.exports = router;
