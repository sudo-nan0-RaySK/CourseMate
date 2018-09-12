const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const userSchema = new Schema({
    name:String,
    user_id:String,
    course_done:{type:[String], default:null},
    course_going:{type:[String], default:null},
    email:String,
    password:String
});

const User= mongoose.model('user',userSchema);
//Export Model
module.exports=User;