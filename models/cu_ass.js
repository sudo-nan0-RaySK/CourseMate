const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const cu_ass_schema = new Schema({
    u_id:String,
    cd_id:String
});

const cu_ass= mongoose.model('cu_ass',cu_ass_schema);

module.exports= cu_ass;