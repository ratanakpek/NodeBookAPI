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
        });

    userRotuer.route('/logouts')
        .get(function(req, res) {
            req.logOut();
            var data = {
                code : 200,
                msg : "Successfully!",
                data : req.user
            }
           // res.redirect('/');
             res.send(data);
        });

    return userRotuer;
};

module.exports=routes;