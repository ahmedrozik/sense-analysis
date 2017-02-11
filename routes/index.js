var express = require('express');
var router = express.Router();

var api_routes = require('./api');
var dashboard_routes = require('./dashboard');
var mydashboard_routes = require('./mydashboard');

var auth_routes = require('./auth');
var signup_routes = require('./sign_up');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');



router.get('/', function(req, res) {
	console.log("Auth.js ////// index Page");
	 
	   if(req.session.isLoggedIn == "true" || req.session.isLoggedIn == true ){
		   	console.log(" /////   User is logged :: true ");

	   res.render('index',{ title: 'SenseEgypt' ,logged:'true'});

 }else{
	 
	 	console.log(" /////   User is not  logged ::  false");

	 	   res.render('index',{ title: 'SenseEgypt',logged:'false' });

 }
 
});




router.post('/sign_up', function(req, res) {
	console.log("Sign_up Post");
	console.log(" Mongoose Module is "+mongoose);
	
	    var email = cleanString(req.param('email'));
    var pass = cleanString(req.param('pass'));
	    var mobile = cleanString(req.param('mobile'));

	
	console.log(" User "+email + " Password "+pass +"mobile no ")
    if (!(email && pass)) {
      return invalid();
    }

    User.findById(email, function (err, user) {
      if (err) return invalid();

      if (user) {
		  console.log("User Already Existing");
	return res.send("User Already Existing , Please Enter New Email");
      }

      crypto.randomBytes(16, function (err, bytes) {
        if (err) return invalid();

        var user = { _id: email , mobile: mobile };
        user.salt = bytes.toString('utf8');
        user.hash = hash(pass, user.salt);

        User.create(user, function (err, newUser) {
          if (err) {
            if (err instanceof mongoose.Error.ValidationError) {
              return invalid();
            } 
            return invalid();
          }

          // user created successfully
       //   req.session.isLoggedIn = true;
        //  req.session.user = email;
          console.log('user has been created successfully : %s', email);
	// res.render('sign_up',{ title: 'SenseEgypt' , created:'true'});
	return res.send("User has been created successfully");

        })
      })
    })

    function invalid () {
      return res.render('sign_up', { invalid: true });
    }
	


});

//manage login routes
router.use('/',auth_routes);

// Sign Up
router.use('/sign_up',signup_routes);

//dashboard routes
router.use('/index', dashboard_routes);
router.use('/dashboard', mydashboard_routes);

//proxy api routes TODO: remove this after datapower handles the CORS requests
router.use('/api/v0001',api_routes);

function getAuthFromVCAP(VCAP_SERVICES) {

	var env = JSON.parse(VCAP_SERVICES);
	for (var service in env) {
		//find the IoT Service
		for (var i=0;i<env['iotf-service'].length;i++) {
			
			if (env['iotf-service'][i].credentials.iotCredentialsIdentifier) {
				//found an IoT service, return api_key and api_token session variables
				return { api_key : env['iotf-service'][i].credentials.apiKey,
						auth_token : env['iotf-service'][i].credentials.apiToken }
			}
		}
	}
	return {};
}

module.exports = router;
