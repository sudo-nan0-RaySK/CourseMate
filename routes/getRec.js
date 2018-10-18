var express = require('express');
var router= express.Router();
var mongoose= require('mongoose');
const User= require('../models/user');
var courses = require('../models/course');
//Lambda expers
const R = require('ramda');
//MongoDB Stuff
var cu_ratings= require('../models/cu_ratings');

router.get('/',(req,res)=>{
    cu_ratings.find({}).sort('u_id').exec((err,doc)=>{
        //res.json(doc);
        //getting distinct keys:
        keyset=new Array();
        matrix=new Array();
        doc.forEach((obj)=>{
            if(!keyset.includes(obj.course_id)){
                keyset.push(obj.course_id);
            }
        });
        var i=0;
        console.log('keyset is', keyset);
        keyset.forEach((key)=>{ 
            matrix[i]=new Array();
            doc.forEach((obj)=>{
                if(obj.course_id==key){
                    matrix[i].push(obj.ratings);
                }
            })
            i++;
        });
       // const transpose = a => R.map(c => R.map(r => r[c], a), R.keys(a[0]));
        //matrix=transpose(matrix);
        console.log(matrix);
        matrix=normalizeCosines(matrix,matrix.length,matrix[0].length);
        console.log(matrix);
        var simSet=keySetMapping(keyset);
        var revSimSet= revKeySetMapping(keyset);
        console.log('simset :',simSet);
        console.log('revSimSet :',revSimSet);
        var rankmatrix= rankItems(matrix);
        console.log('=================================================');
        console.log(rankmatrix);
        console.log('=================================================');
        printRankList(simSet,rankmatrix,rankmatrix.length);
        
        getRecords(req.session.user_id,simSet,revSimSet,rankmatrix).then((e)=>{
            res.render('recommendations',{
                courses:e.reverse()
            });
        });
        //res.json(doc);
        
    });

});

/**
 * This function basically gives full fleged info about
 * suggested courses set
 */
function getRecordsHelper(results,i,list){
    //console.log('Atleast ran '+i)
    if(i>=0){
        //console.log(results[i]);
        return new Promise((res,reject)=>{
            courses.findOne({course_id:results[i]},(err,doc)=>{
                //console.log(doc);
                if(doc){
                    list.push(doc);
                }
                res(getRecordsHelper(results,i-1,list));
            });
        })
    }
    else{
        //console.log('well crap')
        return new Promise((resolve,reject)=>{
            console.log(list);
            resolve(list);
        })
    }
}
/**
 * And here we go
 */
async function getRecords(user_id,simSet,revSimSet,rankmatrix){
    var list = new Array();
    var t= await getFinalReccomendation(user_id,simSet,revSimSet,rankmatrix);
    console.log(t.length);
    console.log(t);
    var x = await getRecordsHelper(t,t.length,list);
    console.log("The values"+x);
    return x;   
}


/**
 * This is the helper function that basically ties everything togather
 * this eliminates the courses which are already done and returns a set
 */
function getFinalRecommendationHelper(uid,simSet,revSimSet,rankmatrix){
    var set= new Set();
    return new Promise((resolve,reject)=>{
        baller(uid,simSet,revSimSet,rankmatrix).then((t)=>{
            
            User.findOne({user_id:uid},(err,doc)=>{
                t.forEach((e)=>{
                    if(!(doc.course_done.indexOf(e)>-1)){
                        set.add(e);
                    }
                    //console.log(e);
                });
                var list= new Array();
                set.forEach((x)=>{
                    list.push(x);
                })
                resolve(list);
            });
        });
    });
}

/**
 * So we finally arrive at an end
 * this functions get results and returns a final set of generated suggestions
 */
async function getFinalReccomendation(user_id,simSet,revSimSet,rankmatrix){
    var set= await getFinalRecommendationHelper(user_id,simSet,revSimSet,rankmatrix);
    return set;
}

/**
 * Normalizing Function
 * Delete Anomolies
 * Used for calculating Pearson's Coefficient
 */
function normalizeCosines(matrix, rowSize, colSize){
    for(var i=0; i<rowSize; i++){
        var summation=0;
        var size=0;
        for(var j=0; j<colSize; j++){
            if(matrix[i][j]!=null){
                summation+=Number(matrix[i][j]);
                size++;
            }
        }
        var average= summation/size;
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
/**
 * Now we shall calculate the similarity 
 * And the rank items with respect to an item
 * we are going to use centered cosine similarities
 * this is also called Pearson's Coefficient
 */
function similarity(item1,item2,userLength){
    var num1=0;
    var num2=0;
    for(var i=0; i<userLength; i++){
        num1+=(item1[i]*item2[i]);
    }
    var num11=0, num22=0;
    for(var i=0; i<userLength; i++){
        num11+=(item1[i]*item1[i]);
        num22+=(item2[i]*item2[i]);
    }
    var num= num1;
    var denum= Math.sqrt(num11)*Math.sqrt(num22);
    var pearsonCoeff= num/denum;
    return pearsonCoeff;
}
/**
 * Functional mapping
 * mapping course ids with numbers for easy calculations
 */
function keySetMapping(keys){
    var set={}
    for(var i=0;i<keys.length; i++){
        set[i]=keys[i];
    }
    return set;
}
function revKeySetMapping(keys){
    var set={}
    for(var i=0; i<keys.length; i++){
        set[keys[i]]=i;
    }
    return set;
}
/**
 * Function for Item-Item ranking
 */
function rankItem(item1,matrix){
    var ranklist= new Array();
    for(var i=0; i<matrix.length; i++){
        if(i!=item1){
            var similarityX= similarity(matrix[item1],matrix[i],matrix[i].length);
            ranklist.push({"item":i,"similarity":similarityX});
        }    
    }
    return ranklist.sort((a,b)=>{
        return b.similarity>a.similarity;
    });
}

/**
 * Ranking all the items by doing above repeatedly
 */
function rankItems(matrix){
    var rankmatrix= new Array(matrix.length);
    for(var i=0; i<matrix.length; i++){
        rankmatrix[i]=rankItem(i,matrix);
    }
    return rankmatrix;
}
/**
 * Debug function to output item wise ranking
 */
function printRankList(keyMap,rankmatrix,rowSize){
    for(var i=0; i<rowSize; i++){
        console.log('For ',keyset[i])
        for(var j=0; j<rowSize-1; j++){
            console.log("at rank ",j,keyMap[rankmatrix[i][j].item]);
        }
        console.log('=============================================');
    }
}
/* get Reccomended set*/
function getSet(user_id){
    return new Promise(resolve=>{
        cu_ratings.find({u_id:user_id}).sort('-ratings').exec((err,res)=>{
            resolve(res);
        });
    })
}

async function baller(user_id,keyMap,revKeyMap,rankmatrix){
    var res= await getSet(user_id);
    //console.log(res);
    var set = new Set();
    var suggList= new Set();
    res.forEach((e)=>{
        set.add(e);
    });

    set.forEach((e)=>{
        //console.log("For item "+e.course_id+" , item no. "+revKeyMap[e.course_id]);
        for(var j=0; j<rankmatrix.length-1; j++){
            suggList.add(keyMap[rankmatrix[revKeyMap[e.course_id]][j].item]);
        }
    });
    return suggList;
}


module.exports = router;