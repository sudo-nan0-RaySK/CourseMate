var express = require('express');
var router = express.Router();
const User= require('../models/user');
var course= require("../models/course");
const cu_ratings= require('../models/cu_ratings');
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
      //res.send(data);
      var rating_link='/getCourse/rating?id='+id+"";
      var start_link='/getCourse/start?id='+id+"";
      res.render('course',
      {
        course:data.name,
        instructor:data.instructor,
        rating_link:rating_link,
        start_link:start_link,
      });
  });
});

router.post('/rating',(req,res,next)=>{
  var id= req.query.id;
  console.log(id);
  var form = req.body;
  var CourseRatings = new cu_ratings({
    u_id:req.session.user_id,
    course_id:id,
    ratings:Number(form.rate)
  });
  cu_ratings.updateOne({u_id:req.session.user_id,course_id:id},{ $set: { ratings:Number(form.rate) }},(err,doc)=>{
    if(err){
      res.send(err);
      console.log('error occured');
    }
    else{
        User.findOneAndUpdate({user_id:req.session.user_id},{$push: {course_done: id}},
        (err,success)=>{
          if(err){
            res.send('Some error occured, please login again');
          }
          else{
            res.redirect('/getCourse?id='+id);
          }
        })
        
    }
  });
});

module.exports = router;
