/*global require process module*/


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var bundle_url;
    if (process.env.NODE_ENV === 'production'){
        bundle_url = '/javascripts/bundle.min.js';
    }
    else {
        bundle_url = '/javascripts/bundle.js';
    }

    res.render('index', {
        title: 'Centralized Remote Observations Website',
        bundle_url: bundle_url
    });
});

var db = require('mongoskin').db('mongodb://localhost:27017/CROW');

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
