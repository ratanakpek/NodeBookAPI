var express=require("express");
var routes=function (Author) {
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
                else
                    res.json(author);
            })
        })
        .get(function(req, res){
                    res.json(req.author);

        })
        .put(function(req, res){
            req.author.name=req.body.name;
            req.author.number=req.body.number;
            req.author.book_type=req.body.book_type;
            req.author.save();
            res.json(req.author);
        })
        .patch(function(req, res){
            if(req.body.name){

                req.author.name=req.body.name;
                req.author.save();
                res.json(req.author);

            }else{
                res.status(404).send("Reqired name!");
            }
        });

    authorRouter.route("/")
        .post(function (req, res) {

            if (req.body.name) {
                var author = new Author(req.body);
                author.save();
                res.send(req.body);
            }else{
                res.status(404).send("Name not found!")
            }
    })
        .get(function (req,res) {
            Author.find(function(err, author){
                if(err)
                    res.status(500).send(err)
                else{
                    res.json(author)
                }
            })
        });


    return authorRouter;
}

module.exports=routes;