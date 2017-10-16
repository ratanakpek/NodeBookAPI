var mongoose = require("mongoose"), Schema=mongoose.Schema;


var authorModel=new Schema({
    name: String,
    number:Number,
    book_type:String
});

module.exports=mongoose.model("Author", authorModel);