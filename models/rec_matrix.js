const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const rec_matrix_schema= new Schema({
    c_id:String,
    sim_id:String,
    sim_rank:String
});

const rec_matrix= mongoose.model('rec_matrix',rec_matrix_schema);

module.exports= rec_matrix;
