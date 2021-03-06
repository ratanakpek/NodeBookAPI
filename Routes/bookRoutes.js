var express= require("express");

var routes=function(Book, data){
    var bookRouter=express.Router();
    bookRouter.route('/')
        .post(function (req, res) {
            var book = new Book(req.body);
            book.save();
            data.data=book;
            res.send(data);
        })
        .get(function(req, res) {

            Book.find(function (err, books) {
                if (err)
                    res.status(500).send(err);
                else{
                    data.data=books;
                    res.json(data)
                }

            });
        });



    /***************************Path Param************************************/
    bookRouter.use('/:bookId', function(req,res, next){
        Book.findById(req.params.bookId, function (err, book) {
            if (err)
                res.status(500).send(err);
            else if(book){
                req.book=book;
                next();
            }else{
                res.status(404).send("No book found");
            }
        });
    });
    bookRouter.route('/:bookId')
        .get(function(req, res) {
            data.data=req.book;
            res.json(data);
        })
        .put(function(req, res){
                    req.book.title=req.body.title;
                    req.book.author=req.body.author;
                    req.book.genre=req.body.genre;
                    req.book.read=req.body.read;
                    req.book.save(function (err) {
                        if(err)
                            res.status(500).send();
                        else{
                            data.data=req.book;
                            res.json(data);
                        }

                    });
        })
        .patch(function (req, res) {
            if(req.body._id)
                delete req.body._id;
            for(var item in req.body){
                req.book[item]=req.body[item];
            }
            req.book.save(function(err){
                if(err){
                    res.status(500).send();
                }else{
                    data.data=req.book;
                    res.json(data);
                }
            });
            /*if(req.book.title){
                req.book.title=req.body.title;
                req.book.save();
                res.json(req.book);
            }else{
                res.status(404).send("Required book title");
            }*/
        })
        .delete(function(req, res) {
            req.book.remove(req.book, function(err, book){
                if(err)
                    res.status(500).send();
                else{
                    data.data=req.book;
                    res.json(data);
                }
            })
        });

    return bookRouter;
};

module.exports=routes;