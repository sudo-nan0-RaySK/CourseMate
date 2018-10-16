var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.session.user_id=null
  req.session.password=null;
  res.redirect('/login');
});

module.exports = router;
