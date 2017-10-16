var express = require("express");
var mongoose = require("mongoose");
var bodyParser=require("body-parser");

var db=mongoose.connect('mongodb://localhost/bookAPI');
var app=express();
var port=process.env.PORT || 2000;

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

app.get("/", function(req, res){
	res.send("Welcome to NODE JS.")
});

app.listen(port, function(){
	console.log("Running on PORT : "+ port)
});