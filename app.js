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

//Authentication================
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');


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


 require('./config/passport')(passport); // pass passport for configuration
app.use(express.static('dist'));
app.use(bodyParser());
app.use("/api/v1", subpath);
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


swagger.configureSwaggerPaths('/api/swagger', 'api-docs', '');
swagger.configure("http://localhost:8888", '1.0.0');




app.listen(port, function(){
	console.log("Running on PORT : "+ port)
});