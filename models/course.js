const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const courseSchema= new Schema({
    name:String,
    weeks:Number,
    instructor:String,
    videos:[String],
    data:[String],
    course_id:String
});

const Course= mongoose.model('course',courseSchema);

module.exports=Course;