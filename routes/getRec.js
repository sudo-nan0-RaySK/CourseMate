var express = require('express');
var router= express.Router();
var mongoose= require('mongoose');

const R = require('ramda');

//MongoDB Stuff
var cu_ratings= require('../models/cu_ratings');


router.get('/',(req,res)=>{
    cu_ratings.find({}).sort('u_id').exec((err,doc)=>{
        //res.json(doc);
        //getting distinct keys:
        keyset=new Array();
        matrix=new Array;
        doc.forEach((obj)=>{
            if(!keyset.includes(obj.course_id)){
                keyset.push(obj.course_id);
            }
        });
        var i=0;
        keyset.forEach((key)=>{
            matrix[i]=new Array();
            doc.forEach((obj)=>{
                if(obj.course_id==key){
                    matrix[i].push(obj.ratings);
                }
            })
            i++;
        });
        const transpose = a => R.map(c => R.map(r => r[c], a), R.keys(a[0]));
        matrix=transpose(matrix);
        console.log(matrix);
        matrix=normalizeCosines(matrix,matrix.length,matrix[0].length);
        console.log(matrix)
        res.json(doc);
    });

});
/**
 * Normalizing Function
 * Delete Anomolies
 * Used for calculating Pearson's Coefficient
 */
function normalizeCosines(matrix, rowSize, colSize){
    for(var i=0; i<rowSize; i++){
        var summation=0;
        for(var j=0; j<colSize; j++){
            if(matrix[i][j]!=null){
                summation+=Number(matrix[i][j]);
            }
        }
        var average= summation/colSize;
        for(var j=0; j<colSize; j++){
            if(matrix[i][j]==null){
                matrix[i][j]=0;
            }
            else{
                matrix[i][j]-=average;
            }
        }
    }
    return matrix;
}


module.exports = router;