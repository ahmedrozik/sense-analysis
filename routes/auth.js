var express = require('express');
var router = express.Router();
var mqtt = require('mqtt')


var mongoose = require('mongoose');
var User = mongoose.model('User');
var Sensor = mongoose.model('Sensor');
var SensorDataMod = mongoose.model('SensorData');
var actuatorsList = mongoose.model('ActuatorsList');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');
var shortid = require('shortid');
var http = require('http');

var nodemailer = require('nodemailer');
 var nodeExcel=require('excel-export');

 var entropy = require('shannon-entropy');
var DTW = require('dtw');

 var fs = require('fs');
console.log("Auth test");


var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var querystring = require("querystring");



var client = mqtt.createClient(1883, "broker.mqtt-dashboard.com");
var client2 = mqtt.createClient(1883, "broker.mqtt-dashboard.com");
var Twitter = require('twitter');


var OAuth = require('oauth').OAuth
  , oauth = new OAuth(
      "https://api.twitter.com/oauth/request_token",
      "https://api.twitter.com/oauth/access_token",
      "qu8pVznlr5URezLqEWByr96f8",
      "KDKyqdcmgxxbgekSoQuRcms0HpdRzxyxxevrKaRhBqoTumqRP7",
      "1.0",
      "http://127.0.0.1:8080/auth/twitter/callback",
      "HMAC-SHA1"
    );
 



router.get('/auth/twitter', function(req, res) {
 
  oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
    if (error) {
      console.log(error);
 //     res.send("Authentication Failed!");
	   res.redirect('/index'); // Redirect to login page

    }
    else {
      req.session.oauth = {
        token: oauth_token,
        token_secret: oauth_token_secret
      };
      console.log(req.session.oauth);
      res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
    }
  });
 
});



router.get('/auth/twitter/callback', function(req, res, next) {
 
  if (req.session.oauth) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oauth_data = req.session.oauth;
 
    oauth.getOAuthAccessToken(
      oauth_data.token,
      oauth_data.token_secret,
      oauth_data.verifier,
      function(error, oauth_access_token, oauth_access_token_secret, results) {
        if (error) {
          console.log(error);
        //  res.send("Authentication Failure!");
 res.redirect('/apps?twitter_account=no&access_token=no&access_token_secret=no&result=false');


        }
        else {
			
			 console.log("Twitter Account "+results["screen_name"]);

          req.session.oauth.access_token = oauth_access_token;
          req.session.oauth.access_token_secret = oauth_access_token_secret;
          console.log(results, req.session.oauth);
        //  res.send("Authentication Successful");
          res.redirect('/apps?twitter_account='+results["screen_name"]+'+&access_token='+oauth_access_token+'&access_token_secret='+oauth_access_token_secret+'&result=true'); // You might actually want to redirect!
        }
      }
    );
  }
  else {
    res.redirect('/login'); // Redirect to login page
  }
 
});


// Login page
router.get('/apps', function(req, res) {
	var qs = querystring.parse(req.url.split("?")[1]),
    access_token = qs.access_token ;
   var access_token_secret=qs.access_token_secret;
   
   var twitter_account=qs.twitter_account;

	var result=qs.result;

		console.log("Get APPS  Get access_token"+access_token+" access_token_secret"+access_token_secret);

		
   
     	var email=req.session.user;	
if(result != "false"){
		  User.findById(email, function (err, user) {
			  user.twitteraccount=twitter_account;
		      user.accesstoken=access_token;
			  user.acesstokensecret=access_token_secret;
			      user.save(function(err) {
					  console.log(" Twitter Accont has beedn added to DB");

					
        });
		

		  });
  
}

	
	
		
		
	
	   	res.render('apps',{ twitter_account:twitter_account,access_token:access_token,access_token_secret:access_token_secret,result:result});
		
		
  // res.render('apps', { title: 'SenseEgypt',logged:'false' });
  //res.redirect('/apps');
});






router.post('/forgot', function(req, res, next) {
	console.log("From forgot ");
	   var email = cleanString(req.param('email'));
	console.log("USER :"+email );
  

    // user friendly
    email = email.toLowerCase();

		
		
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findById(email, function(err, user) {
        if (!user) {
				console.log("USER isnot found :"+user )

		  return	res.render('forgot', { message:'No account with that email address exists' });

        }
	console.log("USER is found :"+user );
if(user){
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
		  		//  	res.render('forgot', { message:'Cant fetch data from DB' });
	if(err){
		return	res.render('forgot', { message:'System Error, Please try again later' });

		
	}
          done(err, token, user);

					
        });
		
      }
     });
    },
    function(token, user, done) {
 
	  
	  var smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'senseegypt2020@gmail.com',
        pass: '0105570894'
    }
});

	  
      var mailOptions = {
        to: email,
        from: 'SenseEgypt <senseegypt2020@gmail.com>',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(error,info) {
		          console.log("Will try to send email");

         if(error){
        console.log(error);
				return res.render('forgot', { message:'We are unable to send you an EMail , please check if your email still active' });

    }else{
        console.log('Message sent: ' + info.response);
		res.render('forgot', { message:'An e-mail has been sent to ' + email + ' with further instructions' });

    }
	
	
	
      });
    }
  ], function(err) {
    if (err) return next(err);
				res.render('forgot', { message:'We are unable to send you an EMail , please check if your email still active' });


	});
});




router.get('/reset/:token', function(req, res) {
	console.log("111 From Forgot Password token is "+req.params.token);
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
	console.log("222 User not existing");

      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
	
	      // res.render('forgot');
	//	res.render('reset', {email :'jdev.cs2011@gmail.com' });
      return res.redirect('/reset?token=' + req.params.token);

  //  res.render('forgot');
  });
});


router.post('/reset', function(req, res) {
	
									console.log("55555555 Reset password form :: User is not existing "+req.url);

   
   
   
   var qs = querystring.parse(req.url.split("?")[1]),
   token = qs.token ;
   
   
       var tokenid = cleanString(req.param('tokenid'));

	   
	   
   
   		console.log("6666666 Reset password form :: User    Token id is "+tokenid);
token=tokenid;
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
			console.log("Reset password form :: User is not existing ");
        //  req.flash('error', 'Password reset token is invalid or has expired.');
          res.redirect('/forgot');
        }
if(user != null){
	
	      crypto.randomBytes(16, function (err, bytes) {
        if (err) return invalid();
    var pass = cleanString(req.param('newpass'));
	
	console.log('Password isss '+pass );
        user.salt = bytes.toString('utf8');
        user.hash = hash(pass, user.salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
            done(err, user);
        
        });

         


      
      });
	  
	
  
}
      });
    },
    function(user, done) {
	  var smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'senseegypt2020@gmail.com',
        pass: '0105570894'
    }
});
      var mailOptions = {
        to: user._id,
        from: 'senseegypt2020@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user._id + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(error,info) {
        req.flash('success', 'Success! Your password has been changed.');
		
		       if(error){
        console.log(error);

    }else{
        console.log('Message sent: ' + info.response);

    }
	
	
        done(error);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});




router.get('/channel', function(req, res) {
	console.log("Channel Page");
	res.render('mythings', {  ispublic: 'false' , logged:'true' });




});


router.get('/reset', function(req, res) {
	console.log(" 233333 Reset  Page");
	res.render('reset', {  ispublic: 'false' , logged:'true' });

});




router.get('/forgot', function(req, res) {
	console.log("new pass Page");
	res.render('forgot', {message: 'false'});




});

router.get('/addthing', function(req, res) {
	console.log("Channel Page");
	res.render('channel', {  ispublic: 'false' , logged:'true' });




});



router.get('/publicchannel', function(req, res) {
	console.log("Public Channel Page");
	 if(req.session != null && req.session.isLoggedIn == "true" || req.session.isLoggedIn == true){
	   res.render('mythings',{  ispublic: 'true' ,logged:'true'});

 }else{
 
 
  res.render('mythings',{  ispublic: 'true' ,logged:'false'});
 }


});


client.on('message', function (topic, message) {
  console.log("Topic name is receive from AUTH &&&  "+ topic + " Message content is  "+message);
  var minThreshold , maxThreshold ;
  
Sensor.findById(topic, function (err, sensor) {
      if (err){
	  console.log("Error to get Sensor Attributes");
      }else {
		  
var sensorName=sensor._id;

  	actuatorsList.find({ 'sensor': sensorName }, function (err, actuators) {
		  console.log("From Acturatos   ::: "+ actuators);
if(err){
		console.log(" Errors in actuators  is  : "+err);	
}
if(actuators != null){
for(var i=0;i<actuators.length;i++){
	console.log("Actuator Received is  : "+actuators[i].actName);
	// Analysis Actions 
	
	var minThreshold=actuators[i].minthreshold;
	var maxThreshold=actuators[i].maxthreshold;
	var command=actuators[i].command;
	var actuator=actuators[i].actName;
					 console.log("Object returned is "+sensor);
if(( parseInt(message) >= parseInt(maxThreshold) ) || (parseInt(message)  <= parseInt(minThreshold))){

//console.log("send email"+parseInt(sensor.maxthreshold)  +"message "+ parseInt(message) );
var eventSensor=sensor.eventSensor;

	console.log(" %%%%%%%%%%%% Before SMS Dats is "+sensor.sms);

	
if(actuator != "No" || actuator != "No	"){
	console.log(" %%%%%%%%%%%% Message Publised to Event Trigger");
	client.publish(actuator, command);

}
		
		
		


var mobile=sensor.mobile;
		
var email=sensor.email;

	console.log(" %%%%%%%%%%%%  After SMS Dats is "+sensor.sms);



if(sensor.emailEvent == "email"){
console.log("Sending Email");
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'senseegypt2020@gmail.com',
        pass: '0105570894'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'SenseEgypt <senseegypt2020@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Sense Egypt Sensor Alert', // Subject line
    text: 'SenseEgypt Sensor Alert', // plaintext body
    html: '<b>Sensor Alert from SenseEgypt Platform Regarding your sensor measurements which is currently :  '+message+'</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
		console.log("******************  will ssss sending Tweets");

    }
});

console.log("******************  before sending Tweets");

//
if(sensor.sms == "sms"){



console.log("****************** sending Tweets");
	  User.findById(email, function (err, user) {


		      
			  

		 
		  
		  
		  
var twit = new Twitter({
  consumer_key: 'qu8pVznlr5URezLqEWByr96f8',
  consumer_secret: 'KDKyqdcmgxxbgekSoQuRcms0HpdRzxyxxevrKaRhBqoTumqRP7',
  access_token_key: user.accesstoken,
  access_token_secret: user.acesstokensecret
});
 


twit.post('statuses/update', {status: 'Sensor Alert from SenseEgypt Platform Regarding your sensor measurements which is currently :  '+message},  function(error, tweet, response) {
  if(error) {
	  
	    console.log(error)
  }
  
  console.log(tweet);  // Tweet body. 
  console.log(response);  // Raw response object. 
});


 });
}



}

				 
}


	
	
	
	
	
}


	}

});



	 
}


    });
			
			 
			 
  var id = mongoose.Types.ObjectId();
  console.log(" Id Genrated is  "+id);

  	        var sensorData = { _id: id };
			sensorData.name=topic;
	       sensorData.value=message;

		   
		           SensorDataMod.create(sensorData, function (err, newUser) {
			console.log("Save sensor Data");
          if (err) {
            if (err instanceof mongoose.Error.ValidationError) {
              return invalid();
            } 
         //   return next(err);
          }
		  


  
  
        
        })
		
		
		
		   

});

router.post('/channel', function(req, res) {
	var sensId=req.app.get('sensorCounter');
	req.app.set('sensorCounter',sensId+1);
	console.log("Add Sensor Post"+sensId);
	var genId=shortid.generate();
    var sensorName=req.param('name');
	var mobile=req.param('mobile');
	var actList=req.param('actuatorsList');	
	var sensortype=req.param('sensortype');
	console.log('The Actuators List Are ::::  '+ actList.length);
	sensorName=sensorName.replace(/\s+/g, '');
	var sensorId="EgyptIOT/Portal/"+"EGYIOT/"+sensortype+"/STORMQ/"+sensorName+"/"+genId+sensId;
	if(sensortype !=  "actuator"){
		 client.subscribe(sensorId);
		 	console.log('The Actuator Subscribed to new Sensor');

	
   
	 // client.publish('EgyptIOT/EGYIOT/EGY/STORMQ', sensorId);
    console.log(' generated ID '+sensorId);
	
var actuatorList=JSON.parse(actList);
for(var i=0;i<actuatorList.length;i++){
	  var id = mongoose.Types.ObjectId();

	var actuator={ _id: id };
	actuator.actName=cleanString(actuatorList[i].actuator);
    actuator.email=req.session.user;
	actuator.minthreshold=actuatorList[i].minthreshold;
    actuator.maxthreshold=actuatorList[i].maxthreshold;
    actuator.command=actuatorList[i].command;
	actuator.sensor=sensorId;
  
        actuatorsList.create(actuator, function (err, newActuator) {
          if (err) {
            if (err instanceof mongoose.Error.ValidationError) {
             console.log(err.name);
			 //return invalid();
            } 
         //   return next(err);
          }
         
        })
  
			
	console.log("Number of Actuators are :: "+actuatorList[i].actuator);
}

	}
    	        var sensor = { _id: sensorId };
			sensor.name=cleanString(sensorName);

            sensor.email=req.session.user;
		    sensor.description=cleanString(req.param('description'));

		    sensor.longitude=cleanString(req.param('longitude'));
	       sensor.latitude=cleanString(req.param('latitude'));
		   	sensor.field=cleanString(req.param('field1'));

		     sensor.minthreshold=cleanString(req.param('minthreshold'));
		    sensor.maxthreshold=cleanString(req.param('maxthreshold'));
			sensor.mobile=cleanString(req.param('mobile'));
		    sensor.sms=cleanString(req.param('sms'));
		    sensor.emailEvent=cleanString(req.param('email'));
		    sensor.type=cleanString(req.param('sensortype'));
		    sensor.eventSensor=cleanString(req.param('eventSensor'));
		    sensor.ispublic=cleanString(req.param('ispublic'));






  
console.log(" name" +sensor.name +"  desc "+sensor.description +"  longit"+sensor.longitude+"  latitude"+sensor.latitude+"  max"+sensor.maxthreshold+"  min"+sensor.minthreshold +" Field "+sensor.field + " email "+sensor.email);
  

        Sensor.create(sensor, function (err, newUser) {
			console.log("Inside Create "+sensor.email);
          if (err) {
            if (err instanceof mongoose.Error.ValidationError) {
             console.log(err.name);
			 //return invalid();
            } 
         //   return next(err);
		 return res.send('false')
          }
		        req.session.isLoggedIn = true;
         
          console.log('created user: %s',  req.session.user );
           return res.send('true');
        })
		
	
		  
		  
		  
});





router.post('/getsensorslist', function(req, res) {
	var email=req.session.user;	
	var ispublic=req.param('ispublic');

console.log('Get Registered Sesnros for This user'+email);
if(ispublic == 'true'){
		Sensor.find({  
    'ispublic':ispublic
  }, function(err, sensors) {
    if (err) {
    } else {
      console.log(sensors);
	             return res.send(sensors);

    }
  });
}else{
	Sensor.find({  
    'email': email,'ispublic':'false'
  }, function(err, sensors) {
    if (err) {
    } else {
      console.log(sensors);
	             return res.send(sensors);

    }
  });
  
}
  
});


// Get Historic Data

router.post('/gethistoricdata', function(req, res) {
	var startDate=req.param('start');
	var endDate=req.param('end');
	var sensorName=req.param('sensorID');
	var isdate=req.param('isdate');
	var top=req.param('top');


console.log('Sensor Name '+sensorName  + ' start date '+startDate + '  end date '+endDate );

if(isdate == 'true'){
		SensorDataMod.find({'name': sensorName,"created": {"$gte": new Date(startDate), "$lt": new Date(endDate)}}, function(err, sensors) {
				console.log(' From Find Data ');
				
    if (err) {
		
		console.log(' Error in get devices Data ');
    } else {
			console.log(' Data returned  from Date Query ');
	            arr=[];
            for(i=0;i<sensors.length;i++){
                name=sensors[i].name;
				 value=sensors[i].value;
				 created=sensors[i].created;
				 console.log(' *****  Data returned ' + name + ' Value '+value + ' created '+created);							
              				    arr.push({evt: parseFloat(value), timestamp: created});

                }
				
res.contentType('application/json');
return res.send(JSON.stringify(arr));
					console.log(' Data returned  results'+arr);

	
	
        


    }
  });
	
}else{
	
		SensorDataMod.find({'name': sensorName}, function(err, sensors) {
				console.log(' From Find Data ');
				
    if (err) {
		
		console.log(' Error in get devices Data  ');
    } else {
			console.log(' Data returned from specific number  ');
	           var arr=[];
            for(i=0;i<sensors.length;i++){
				var a=[];
                name=sensors[i].name;
				 value=sensors[i].value;
				 created=sensors[i].created;
				 console.log(' *****  Data returned ' + name + ' Value '+value + ' created '+created);							
               
				    arr.push({evt: parseFloat(value), timestamp: created});

					
                }
				
					
res.contentType('application/json');
return res.send(JSON.stringify(arr));
					console.log(' Data returned  results'+arr);

    }
  }).sort({_id:-1}).limit(top);
	
}




  
});

// Display Tutorials PDF 

router.get('/documentation', function(request, response){
		console.log(' Display PDF from Node.JS');

  var tempFile="SenseEgypt-UserGuide.pdf";
  fs.readFile(tempFile, function (err,data){
	  		console.log(' Display PDF from Node.JS Error '+err);

     response.contentType("application/pdf");
     return response.send(data);
  });
});



//Get Entroby
router.post('/getEntroby', function(req, res) {
    var sensorID=req.param('sensorID');
	var items=req.param('items');
	console.log('Entropy Sensor ID is '+items);
  

	  var s=[];
      var t=[];
var array_values = new Array();

        for (var key in items) {
           array_values.push(items[key].value);
	        console.log('Items Map  ELmenet Value is :::  '+items[key].value);
        }
	console.log('Items Map is :::  '+array_values.length);
    var j=0;
    for(var i=0;i<array_values.length;i++){
	if(i < array_values.length/2){
	    s[i]=array_values[i];
         }else{
		   t[j]=array_values[i];
           j++;
       }
	
    }




var dtw = new DTW();
var cost = dtw.compute(s, t ,10 );
var path = dtw.path();

console.log('Cost: ' + cost);
console.log('Path: ');
console.log(path);
 
if(cost != 0){
 return res.send("There is an abnormal event has been detected");
 }else{
 return res.send("There is no abnormal event has been detected");

}
 		  
});


// Export Sensor Data

router.post('/getDeviceData', function(req, res) {
    var sensorName=req.param('sensorID');
console.log(' The Sensor Name Selected is from Get Device Data '+sensorName);

   
  //  var dateFormat = require('dateformat');
    var conf={};
    conf.cols=[{
            caption:'Sl.',
            type:'number',
            width:3
        },
        {
            caption:'Name',
            type:'string',
            width:50
        },
		    {
            caption:'Value',
            type:'string',
            width:50
        },
        {
            caption:'Date',
            type:'string',
            width:15
        }
        ];
						console.log(' Before  Find Data ');

		//'name': sensorName
	SensorDataMod.find({'name': sensorName}, function(err, sensors) {
				console.log(' From Find Data ');
    if (err) {
		
		console.log(' Error in get devices Data ');
    } else {
			console.log(' Data returned ');
	            arr=[];
            for(i=0;i<sensors.length;i++){
                name=sensors[i].name;
				 value=sensors[i].value;
				 created=sensors[i].created;
				 			console.log(' Data returned ' + name + ' Value '+value + ' created '+created);							
                a=[i+1,name,value,created];
                arr.push(a);
                }
                conf.rows=arr;
    var result=nodeExcel.execute(conf);
    res.setHeader('Content-Type','application/octet-stream');
    res.setHeader("Content-Disposition","attachment;filename=sensordata.xlsx");
    res.end(result,'binary');
	
	
        


    }
  });
  
  	
				console.log(' After Find Data ');

				
});




router.post('/getActuatorslist', function(req, res) {
	var email=req.session.user;	

console.log('Get Registered Sesnros for This user'+email);
	Sensor.find({  
    'email': email,'type':'actuator'
  }, function(err, sensors) {
    if (err) {
    } else {
      console.log(sensors);
	             return res.send(sensors);

    }
  });
  
  		  
});




// Login page
router.get('/login', function(req, res) {
	console.log("Login Get");
  res.render('login', { title: 'SenseEgypt',logged:'false',error:'false' });
});

//login page after a login failure
router.get('/loginfail', function(req, res) {
  res.render('loginfail', { title: ' EGY IOT' });
});

router.post('/login', function(req, res) {
  console.log("Login Post **** ");

  



      // validate input
    var email = cleanString(req.param('email'));
    var pass = cleanString(req.param('pass'));
	console.log("USER :"+email + "Password :"+pass);
    if (!(email && pass)) {
      return invalid();
    }

    // user friendly
    email = email.toLowerCase();

    // query mongodb
    User.findById(email, function (err, user) {
      if (err) return next(err);

      if (!user) {
      //  return invalid();
		   //  res.send('User is not existing');
    return  res.render('login', { logged:'false',error:'User is not existing'});

      }

      // check pass
      if (user.hash != hash(pass, user.salt)) {
      //  return invalid();
		
		    return  res.render('login', { logged:'false',error:'Password entered is incorrect'});

      }

      req.session.isLoggedIn = true;
      req.session.user = email;
	  

		  
		  
	  
     res.render('index', { logged:'true'});

	// res.redirect('/index?ShowChannels=true,email='+email);

		
    })

    function invalid () {
      return res.render('login', { invalid: true ,error:'false' });
    }
	
	
 // req.session.api_key = req.body.api_key;
  //req.session.auth_token = req.body.auth_token;

 // res.redirect("/index");
});

// Logout the user, then redirect to the home page.
router.post('/logout', function(req, res) {
  req.session.destroy();
     res.render('index', { logged:'false'});
});

router.get('/logout', function(req, res) {

       req.session.destroy();

      res.redirect('/login');
	   //res.render('index', { logged:'false'});




});

module.exports = router;