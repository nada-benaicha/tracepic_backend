const express = require("express");
const cors = require("cors");
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));                          // log every request to the console
app.use(bodyParser.urlencoded({limit: '50mb','extended':'true'}));            // parse application/x-www-form-urlencoded                                // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.use(cors());
app.use(bodyParser.json());


// import entire SDK

//const AWS = require('aws-sdk');

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});

app.use(cors());
app.options('*', cors());

require('./app/router/router.js')(app);

const db = require('./app/config/db.config.js');
var server = app.listen(8081, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("App listening at http://%s:%s", host, port)

})