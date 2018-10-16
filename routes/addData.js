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

/* POST /user */
router.post('/user',(req,res,next)=>{
    var user= new User({
        name:req.body.uname,
        user_id:req.body.uid,
        email:req.body.email,
        //course_done:req.body.cdone.split(","),
        //course_going:req.body.cgoing.split(","),
        password:req.body.password
    });
    user.save((err,doc)=>{
        if(err){
            res.send(err);
        }
        else{
            req.session.user_id=doc.user_id;
            req.session.password=doc.password;
            res.send("User Saved Successfully!! "+doc);
        }
    });
    Course.find().distinct('course_id',(err,cids)=>{
        cids.forEach((cid)=>{
            var temp= new cu_ratings({
                u_id:req.body.uid,
                course_id:cid,
                ranking:null
            });
            temp.save();
        })
    });
});

/* POST /course */
router.post('/course',(req,res,next)=>{
    var form= req.body;
    var course= new Course({
        name:form.cname,
        weeks:Number(form.weeks),
        description:form.descrip,
        rating:0,
        instructor:form.instructor,
        videos:form.videos,
        data:form.data,
        course_id:form.cid
    });
    course.save((err,doc)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(doc);
        }
    });
    User.find().distinct('u_id',(err,uids)=>{
        uids.forEach((uid)=>{
            var temp= new cu_ratings({
                u_id:uid,
                course_id:req.body.cid,
                ranking:null
            });
            temp.save();
        });
    });
});

/* POST /course_ratings */
router.post('/cu_ratings',(req,res,next)=>{
    var form = req.body;
    var CourseRatings = new cu_ratings({
        u_id:form.cu_ratings_uid,
        course_id:form.cu_ratings_cid,
        ratings:Number(form.cu_ratings_ratings)
    });
    cu_ratings.update({u_id:form.cu_ratings_uid,course_id:form.cu_ratings_cid},{ $set: { ratings:Number(form.cu_ratings_ratings) }},(err,doc)=>{
        if(err){

        }
        else{
            res.send('Successful rate!');
        }
    });
});

/* POST /course_data */
router.post('/course_data',(req,res,next)=>{
    var form = req.body;
    var course_data=new CourseData({
        c_id:form.cd_cid,
        u_id:form.cd_uid,
        s_date:Date.parse(form.sdate),
        completePercent:parseFloat(form.completePercentage),
        curr_week:Number(form.curr_week),
        curr_vid:Number(form.curr_vid)
    });
    course_data.save((err,doc)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(doc);
        }
    });
});

/* POST /cu_ass */
router.post('/cu_ass',(req,res,next)=>{
    var form= req.body;
    var cuAss= new cu_ass({
        u_id:form.cu_ass_uid,
        cd_id:form.cu_ass_cdid
    });
    cuAss.save((err,doc)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(doc);
        }
    });
});

router.get('/syncUp',(req,res)=>{
    Course.find().distinct('course_id',(err,cids)=>{
        var counter=0;
       cids.forEach((cid)=>{
        
        User.find().distinct('user_id',(err,uids)=>{
            counter++;
            uids.forEach((uid)=>{
                var tmp= new cu_ratings({
                    u_id:uid,
                    course_id:cid,
                    ratings:null
                });
                
                    tmp.save((err,doc)=>{
                        console.log('Data Saved', doc);
                    });
            });
        });
       })
    });
});

module.exports = router;