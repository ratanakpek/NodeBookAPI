var express = require("express");
var mongoose = require("mongoose");
var bodyParser=require("body-parser");

var db=mongoose.connect('mongodb://localhost/bookAPI');
var app=express();
var port=process.env.PORT || 2000;

var argv = require('minimist')(process.argv.slice(2));




/*Model*/
var Author=require('./models/authorModel');
var Book =require('./models/bookModel.js');
//middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

/*Router*/
var bookRouter=require('./Routes/bookRoutes')(Book);
app.use("/api/books", bookRouter);

var authorRouter=require('./Routes/authorRoutes')(Author);
app.use("/api/authors", authorRouter);



//swagger
var subpath = express();

var swagger = require("swagger-node-express").createNew(subpath);
swagger.setAppHandler(subpath);
app.use(express.static('dist'));

app.use(bodyParser());
app.use("/v1", subpath);

swagger.setApiInfo({
    title: "example API",
    description: "API to do something, manage something...",
    termsOfServiceUrl: "",
    contact: "yourname@something.com",
    license: "",
    licenseUrl: ""
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

swagger.configureSwaggerPaths('', 'api-docs', '');

// Configure the API domain
var domain = 'localhost';
if(argv.domain !== undefined)
    domain = argv.domain;
else
    console.log('No --domain=xxx specified, taking default hostname "localhost".')

// Configure the API port
//var port = 8080;
if(argv.port !== undefined)
    port = argv.port;
else
    console.log('No --port=xxx specified, taking default port ' + port + '.')

// Set and display the application URL
var applicationUrl = 'http://' + domain + ':' + port;
console.log('snapJob API running on ' + applicationUrl);


swagger.configure(port, '1.0.0');




app.listen(port, function(){
	console.log("Running on PORT : "+ port)
});