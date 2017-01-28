
var express = require('express');
var router = express.Router();

/* GET realtime page. */
router.get('/', function(req, res) {
	
	

 if(req.session != null && req.session.isLoggedIn == "true" || req.session.isLoggedIn == true){
	   res.render('index',{ title: 'SenseEgypt' ,logged:'true'});
	console.log(" From DashBoard.JS  1 "+req.session.isLoggedIn)

 }else{
	 
	 
	 	   res.render('index',{ title: 'SenseEgypt',logged:'false' });
	console.log(" From DashBoard.JS  1 "+"false")
 }

});


module.exports = router;