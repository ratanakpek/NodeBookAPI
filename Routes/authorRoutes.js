var express=require("express");
var routes=function (Author) {
    var authorRouter=express.Router();
    authorRouter.route("/")
        .post(function (req, res) {
            var author=new Author(req.body);
            author.save();
            res.send(req.body);

        })
        .get(function(req, res){
            Author.find(req.body.id, function(err, author){
                if(err){
                    req.status(500).send("Error");
                }else{
                    res.json(author);
                }
            })
        });


    return authorRouter;
}

module.exports=routes;