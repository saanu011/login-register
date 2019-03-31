var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var passport = require('passport');
var bcrypt = require('bcrypt');

var User = require('../models/user');
var config = require('../config/config');

router.post('/register', (req, res, next)=> {
    var newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });


    bcrypt.genSalt(10, (err, salt)=> {
        bcrypt.hash(newUser.password, salt, (err, hash)=> {
            if (err) throw err;
            newUser.password = hash;
            newUser.save((err)=>{
                if (err) {
                    res.json({success: false, msg: 'Error' + err});
                } else {
                    res.json({success: true, msg: 'User has been added'});
                }
            });
        });
    });

});

router.post('/authenticate', (req, res, next)=> {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username}, (err, user) => {
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: 'User not found'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
                const token = jwt.sign(user.toJSON(), config.secretKey, {
                    expiresIn: 14400
                });
                res.json({ success: true, token: "JWT "+token, user: {id: user._id, name: user.name, username: user.username, email: user.email }});
            } else {
                return res.json({success: false, msg: 'Password does not match'});
            }
        });
    });
});

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res,next) => {
    res.send({user: req.user});
});

module.exports = router;