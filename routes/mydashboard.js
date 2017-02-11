
var express = require('express');
var router = express.Router();
var querystring = require("querystring");



   
   

/* GET realtime page. */
router.get('/', function(req, res) {
	
	var qs = querystring.parse(req.url.split("?")[1]),
   sensorId = qs.sensorId ;
   var ispub=qs.p;
   console.log("Channel ID "+sensorId + "Is Public "+ispub);
	
	console.log(" ///// From MY   DashBoard.JS ");
	
  if(req.session != null && req.session.isLoggedIn == "true" || req.session.isLoggedIn == true){
	   	res.render('dashboard',{ title: 'SenseEgypt' , channelName:sensorId,ispublic:ispub,logged:'true'});

		

 }else{
 
 
  	res.render('dashboard',{ title: 'SenseEgypt' , channelName:sensorId,ispublic:ispub,logged:'false'});

	
 }

 
	


	//res.render('dashboard', { title: 'EGY IOT' });
});


module.exports = router;