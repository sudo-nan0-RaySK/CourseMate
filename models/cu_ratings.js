const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const cu_ratings_Schema= new Schema({
    u_id:String,
    course_id:String,
    ratings:Number
});

const cu_ratings= mongoose.model('cu_ratings',cu_ratings_Schema);

module.exports=cu_ratings;