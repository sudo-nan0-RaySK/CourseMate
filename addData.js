const mongoose= require('mongoose');
const User= require('./models/user');
const Course= require('./models/course');
const cu_ass= require('./models/cu_ass');
const cu_ratings= require('./models/cu_ratings');
const CourseData= require('./models/course_data');
const rec_matrix= require('./models/rec_matrix');
//Commad Line Interface
const readline= require('readline');

mongoose.connect('mongodb://localhost:27017/coursemate',(err)=>{
    if(err){
        console.error(err);
    }
    else{
        console.log('Connected to MongoDB');
        runAfterConnected();
    }
});

function runAfterConnected(){
    //CMD Setup
    var r1= readline.createInterface({
    input:process.stdin,
    output:process.stdout
    });
    var choice; // Case choice
    console.log("===================================================");
    console.log('Welcome to data insertion tool for CourseMate');
    console.log('To add data regarding User model, press 1');
    console.log('To add data regarding Course model, press 2');
    console.log('To add data regarding cu_ass model, press 3');
    console.log('To add data regarding cu_ratings model, press 4');
    console.log('To add data regarding CourseData model, press 5');
    console.log('To add data regarding rec_matrix model, press 6');
    console.log("===================================================");

    var r1= readline.createInterface({
        input:process.stdin,
        output:process.stdout
    });

    r1.question("Enter Your Choice ",(ch)=>{
        r1.close();
        addRespective(ch);
    });
}

function addRespective(choice){
    var r2= readline.createInterface({
        input:process.stdin,
        output:process.stdout
    });
    switch(Number(choice)){
        case 1:
            console.log("You chose 1");
            r2.question("name: ",(name)=>{
                r2.question("user_id: ",(user_id)=>{
                    r2.question("course_done: ",(course_done)=>{
                        r2.question("course_going: ",(course_going)=>{
                            r2.question("email: ",(email)=>{
                                r2.question("password: ",(password)=>{
                                    var user= new User({
                                        name:name,
                                        user_id:user_id,
                                        course_done:null,
                                        course_going:null,
                                        email:email,
                                        password:password
                                    });
                                    user.save((err)=>{
                                        if(err){
                                            console.error(err);
                                        }
                                        else{
                                            console.log("User saved succcessfully");
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        break;
        case 2:
        break;
        case 3:
        break;
        case 4:
        break;
        case 5:
        break;
        case 6:
        break;
    }
}


