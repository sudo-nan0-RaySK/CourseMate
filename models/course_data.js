const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const course_data_schema= new Schema({
    id:String,
    s_date:Date,
    completePercent:Number,
    curr_week:Number,
    curr_vid:Number
});

const course_data= mongoose.model('course_data',course_data_schema);

module.exports= course_data;