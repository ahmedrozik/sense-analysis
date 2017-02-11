
var express = require('express');
var router = express.Router();

/* GET realtime page. */
router.get('/', function(req, res) {
	
	

 if(req.session != null && req.session.isLoggedIn == "true" || req.session.isLoggedIn == true){
	   res.render('index',{ title: 'SenseEgypt' ,logged:'true'});
	console.log(" From DashBoard.JS  1 true condition  "+req.session.isLoggedIn)

 }else{
	 
	 // res.redirect('/index');
	  res.render('index',{ title: 'SenseEgypt',logged:'false' });
	console.log(" From DashBoard.JS  false condition 2  "+"false")
	
	/*
	req.session['logged'] = 'false';
   res.redirect('index');
*/
 }

});


module.exports = router;