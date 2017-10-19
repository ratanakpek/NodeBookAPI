var express= require("express");

var routes=function(User, passport, data){
    var userRotuer=express.Router();

    userRotuer.route('/')
        .post(passport.authenticate('local-signup'), function (req, res) {
           // passport.authenticate(req.body);

            res.send(req.body);
        })
        .get(function(req, res) {

            User.find(function (err, user) {
                if (err)
                    res.status(500).send(err);
                else{
                    data.data=user;
                    res.json(data)
                }

            });
        });



    /***************************Path Param************************************/
    userRotuer.use('/logins', function(req,res, next){

       // db.users.find({"local.email":"ratanakpek@gmail.com"})
        User.find({"local.email":""+req.query.email+""}, function (err, user) {
            if (err)
                res.status(500).send(err);
            else if(user){
                req.user=user;
                next();
            }else{
                res.status(404).send("Email user nout found");
            }
        });
    });
    userRotuer.route('/logins')
        .get(function(req, res) {
            var data = {
                code : 200,
                msg : "Successfully!",
                data : req.user
            }

            res.send(data);
        })
       /* .put(function(req, res){
                    req.book.title=req.body.title;
                    req.book.author=req.body.author;
                    req.book.genre=req.body.genre;
                    req.book.read=req.body.read;
                    req.book.save(function (err) {
                        if(err)
                            res.status(500).send();
                        else
                            res.json(req.book);
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
                    res.json(req.book);
                }
            });
            /!*if(req.book.title){
                req.book.title=req.body.title;
                req.book.save();
                res.json(req.book);
            }else{
                res.status(404).send("Required book title");
            }*!/
        })
        .delete(function(req, res) {
            req.book.remove(req.book, function(err, book){
                if(err)
                    res.status(500).send();
                else
                    res.json(req.book)
            })
        })*/;

    return userRotuer;
};

module.exports=routes;