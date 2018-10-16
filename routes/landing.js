var express = require('express');
var router = express.Router();
const User= require('../models/user');
var courses = require('../models/course');

/* GET users listing. */
function checkLoggedIn(req,res,next){
  User.findOne({user_id:req.session.user_id,password:req.session.password},(err,data)=>{
    if(err){
      res.send(err);
    }else{
      if(data){
        console.log(req.session.user_id);
        next();
      }
      else{
        console.log('redirected!');
        res.redirect('/');
      }
    }
  });
}
router.get('/', checkLoggedIn,function(req, res, next) {
  courses.find({},(err,data)=>{
    if(err){

    }
    else{
      if(data){
        res.render('landing',{courses:data});
      }
      else{
        res.send('Empty course list!')
      }
    }
  });
});

module.exports = router;
