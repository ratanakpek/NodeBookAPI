var express=require("express");
var routes=function (Author, data) {
    var authorRouter=express.Router();

    authorRouter.use("/:authorId", function (req, res, next) {
        if(req.params.authorId){
            Author.findById(req.params.authorId, function (err, author) {
                if(err)
                    res.status(500).send(err);
                else if(author){
                    req.author=author;
                    next();
                }else{
                    res.status(404).send("Not Found!");
                }
            });
        }
    });
    authorRouter.route("/:authorId")
        .delete(function(req, res) {
            req.author.remove(req.params.authorId, function(err, author){
                if(err)
                    res.status(500).send(err);
                else {
                    data.data = author;
                    res.json(data);
                }
            })
        })
        .get(function(req, res){
            data.data=req.author;
            res.json(data);

        })
        .put(function(req, res){
            req.author.name=req.body.name;
            req.author.number=req.body.number;
            req.author.book_type=req.body.book_type;
            req.author.save();
            data.data=req.author;
            res.json(data);
        })
        .patch(function(req, res){
            if(req.body.name){

                req.author.name=req.body.name;
                req.author.save();
                data.data=req.author;
                res.json(data);

            }else{
                res.status(404).send("Reqired name!");
            }
        });

    authorRouter.route("/")
        .post(function (req, res) {

            if (req.body.name) {
                var author = new Author(req.body);
                author.save();
                data.data=req.body;
                res.json(data);
            }else{
                res.status(404).send("Name not found!")
            }
    })
        .get(function (req,res) {
            Author.find(function(err, author){
                if(err)
                    res.status(500).send(err)
                else{
                    data.data=author;
                    res.json(data);
                }
            })
        });

    return authorRouter;
}

module.exports=routes;