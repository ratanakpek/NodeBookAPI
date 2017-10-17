var express = require("express");
var mongoose = require("mongoose");
var bodyParser=require("body-parser");

var db=mongoose.connect('mongodb://localhost/bookAPI');
var app=express();
var argv = require('minimist')(process.argv.slice(2));
var port=process.env.PORT || 2000;

/*Model*/
var Author=require('./models/authorModel');
var Book =require('./models/bookModel.js');
var baseUrl="/api/swagger";



//middleware ========================================================
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

/*Router*/
var bookRouter=require('./Routes/bookRoutes')(Book);
app.use(baseUrl+"/books", bookRouter);

var authorRouter=require('./Routes/authorRoutes')(Author);
app.use(baseUrl+"/authors", authorRouter);



//swagger
var subpath = express();
var swagger = require("swagger-node-express").createNew(subpath);


swagger.setAppHandler(subpath);
swagger.configure("api", "0.2");

swagger.setApiInfo({
    title: "example API",
    description: "API to do something, manage something...",
    termsOfServiceUrl: "",
    contact: "yourname@something.com",
    license: "",
    licenseUrl: ""
});


app.get('/', function (req, res) {
    res.send("Hello World!");
});


app.get('/base_url/api/swagger', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

app.use(express.static('dist'));
app.use(bodyParser());
app.use("/api/v1", subpath);

swagger.configureSwaggerPaths('/api/swagger', 'api-docs', '');
swagger.configure("http://localhost:8888", '1.0.0');




app.listen(port, function(){
	console.log("Running on PORT : "+ port)
});