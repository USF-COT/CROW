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
        title: 'Express',
        bundle_url: bundle_url
    });
});

module.exports = router;
