var express = require('express');
var router= express.Router();
var mongoose= require('mongoose');
//MongoDB Stuff
var cu_ratings= require('../models/cu_ratings');

router.get('/',(req,res)=>{
    matrix={}
    cu_ratings.find().distinct('course_id',(err1,cids)=>{
        cids.forEach((element)=>{
            matrix[element]= new Array();
        });
    }).then((error,docs)=>{
        console.log(Object.keys(matrix));
        var keys= Object.keys(matrix);
        var keyset=0;
        keys.forEach(
            (key)=>{
                keyset++;
                var query=cu_ratings.find({course_id:key});
                query.sort('u_id');
                query.exec((err2,ranks)=>{
                ranks.forEach((rank)=>{
                matrix[key].push(rank.ratings);
                });
                //When Callback ends
                if(keyset=keys.length){
                    console.log(matrix);
                    //Now we can normalize it !
                    for(var i=0; i<keys.length; i++){
                        var sum=0;
                        for(var j=0; j<matrix[keys[i]].length; j++){
                            if(matrix[keys[i]][j]!=null){
                                sum+=matrix[keys[i]][j];
                            }
                        }
                        for(var j=0; j<matrix[keys[i]].length; j++){
                            if(matrix[keys[i]][j]!=null){
                                matrix[keys[i]][j]=0;
                            }
                            else{
                                //Centring the cosines
                                matrix[keys[i]]-=(sum/matrix[keys[i]].length);
                            }
                            
                        }
                    }
                    console.log('Centered Cosines',matrix);
                    /**
                     * Now we shall compute the similarities
                     * we will do it by using method of centered cosines
                     * this is also called Pearson's Coefficient
                     */
                    rankingMatrix={};
                    for(var i=0; i<keys.length; i++){
                        
                        for(var j=0; j<keys.length; j++){
                            //console.log('Worked till here');
                            if(i!=j){
                                //Calculating Coefficient
                                var num=0;
                                var denI=0;
                                var denJ=0;
                                
                                for(var k=0; k<matrix[keys[0]].length; k++){
                                    num+=(matrix[keys[i]][k]*matrix[keys[j]][k]);
                                    denI+=(matrix[keys[i]][k]*matrix[keys[i][k]]);
                                    denJ+=(matrix[keys[j]][k]*matrix[keys[j]][k]);
                                }
                                var pearsonCoff=(num)/((Math.sqrt(denI)*(Math.sqrt(denJ))));
                                rankingMatrix[keys[i]]={
                                    pearsonCoff:keys[j]
                                };
                                console.log(Object.keys(rankingMatrix[keys[i]]));
                            }
                        }
                    }
                    
                }
            });     
        });      
    });
});




module.exports = router;