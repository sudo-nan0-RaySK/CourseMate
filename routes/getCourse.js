var express = require('express');
var router = express.Router();
const User= require('../models/user');
var course= require("../models/course");
function checkLoggedIn(req,res,next){
    User.findOne({user_id:req.session.user_id,password:req.session.password},(err,data)=>{
      if(err){
        res.send(err);
      }else{
        if(data){
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
  var id= req.query.id;
  course.findOne({course_id:id},(err,data)=>{
      res.send(data);
  })
});

module.exports = router;
