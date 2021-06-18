var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors());
app.options('*', cors());

require('./app/router/router.js')(app);

// Create a Server
var server = app.listen(8082, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("App listening at http://%s:%s", host, port)

})