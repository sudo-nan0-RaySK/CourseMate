var express = require('express');
var router = express.Router();
//MongoDB Stuff
const mongoose= require('mongoose');
const User= require('../models/user');
const Course= require('../models/course');
const cu_ass= require('../models/cu_ass');
const cu_ratings= require('../models/cu_ratings');
const CourseData= require('../models/course_data');
const rec_matrix= require('../models/rec_matrix');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('addData');
});

/*POST /user */
router.post('/user',(req,res,next)=>{
    var user= new User({
        name:req.body.uname,
        user_id:req.body.uid,
        email:req.body.email,
        password:req.body.password
    });
    user.save((err,doc)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send("User Saved Successfully!! "+doc);
        }
    })
});

module.exports = router;