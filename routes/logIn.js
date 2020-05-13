var express = require('express');
var router = express.Router();
const User= require('../models/user');

router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', (req, res) => {
    console.log('reached here')
    User.findOne({user_id:Number(req.body.uid), password:req.body.password},(err,data)=>{
        if(err){
            res.send(err);
        }else{
            if(data){
                req.session.user_id=data.user_id;
                req.session.password = data.password;
                console.log(`username : ${req.session.user_id} 
                password: ${req.session.password}`);
                res.redirect('/landing');
            }
            else{
                res.render('login',{err:'Invalid Credz'});
            }
        }
    });
});


module.exports = router;
