var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose= require('mongoose');
var bodyParser= require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var addData= require('./routes/addData');
var getRec= require('./routes/getRec');
var logIn= require('./routes/logIn');
var session = require('express-session');
var landing= require('./routes/landing');
const User= require('./models/user');
var logout = require('./routes/logout')
var getCourse= require("./routes/getCourse");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// body-parser setup
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:"sshwshadshdi"}));

//Setting Up Mongoose MongoDB Connection
console.log(mongoose.connection.readyState);
mongoose.connect('mongodb://localhost:27017/coursemate',(err)=>{
  if(err){
    console.error(err);
  }
  else{
    console.log('Now Connected to MongoDB');
  }
  
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/logIn',logIn);
app.use('/addData',addData);
app.use('/landing',checkLoggedIn,landing);
app.use('/logout',checkLoggedIn,logout);
app.use('/getCourse',checkLoggedIn,getCourse);
app.use('/getRec',checkLoggedIn,getRec);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function checkLoggedIn(req,res,next){
  User.findOne({user_id:req.session.user_id,password:req.session.password},(err,data)=>{
    if(err){
      res.send(err);
    }else{
      if(data){
        next();
      }
      else{
        console.log('redirected!');
        res.redirect('/');
      }
    }
  });
}

module.exports = app;
