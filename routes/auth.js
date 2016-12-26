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

console.log("Auth test");


var client = mqtt.createClient(1883, "broker.mqtt-dashboard.com");


router.get('/channel', function(req, res) {
	console.log("Channel Page");
	res.render('channel', { title: ' EGY IOT' });




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

if(actuator != "No" || actuator != "No	"){
	console.log(" %%%%%%%%%%%% Message Publised to Event Trigger");
	client.publish(actuator, command);

}
		
		
		


var mobile=sensor.mobile;
		
var email=sensor.email;
if(sensor.sms == "sms"){
/*	console.log("Sending SMS");
//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
var options = {

  host: 'api.clickatell.com',
  path: '/http/sendmsg?user=ahmedsalahrozik&password=ALTQKUDBQ8452&api_id=3550847&to='+mobile+'&text=Message'
};

callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    console.log(str);
  });
}
console.log("SMS request "+options.path);
http.request(options, callback).end();
*/
}

if(sensor.emailEvent == "email"){
console.log("Sending Email");
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'jdev.cs2011@gmail.com',
        pass: 'programmercs2011'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'EGY-Talk <jdev.cs2011@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Sensor Alert', // Subject line
    text: 'Sensor Alert', // plaintext body
    html: '<b>Sensor Alert from EGY-Talk </b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});

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






  
console.log(" name" +sensor.name +"  desc "+sensor.description +"  longit"+sensor.longitude+"  latitude"+sensor.latitude+"  max"+sensor.maxthreshold+"  min"+sensor.minthreshold +" Field "+sensor.field + " email "+sensor.email);
  

        Sensor.create(sensor, function (err, newUser) {
			console.log("Inside Create "+sensor.email);
          if (err) {
            if (err instanceof mongoose.Error.ValidationError) {
             console.log(err.name);
			 //return invalid();
            } 
         //   return next(err);
          }
		        req.session.isLoggedIn = true;
         
          console.log('created user: %s',  req.session.user );
           return res.send(sensorId);
        })
		
	
		  
		  
		  
});





router.post('/getsensorslist', function(req, res) {
	var email=req.session.user;	

console.log('Get Registered Sesnros for This user'+email);
	Sensor.find({  
    'email': email
  }, function(err, sensors) {
    if (err) {
    } else {
      console.log(sensors);
	             return res.send(sensors);

    }
  });
  
  		  
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
  res.render('login', { title: 'SenseEgypt',logged:'false' });
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
        return invalid();
      }

      // check pass
      if (user.hash != hash(pass, user.salt)) {
        return invalid();
      }

      req.session.isLoggedIn = true;
      req.session.user = email;
	  

		  
		  
	  
     res.render('index', { logged:'true'});

	// res.redirect('/index?ShowChannels=true,email='+email);

		
    })

    function invalid () {
      return res.render('login', { invalid: true });
    }
	
	
  req.session.api_key = req.body.api_key;
  req.session.auth_token = req.body.auth_token;

 // res.redirect("/index");
});

// Logout the user, then redirect to the home page.
router.post('/logout', function(req, res) {
  req.session.destroy();
     res.render('index', { logged:'false'});
});

router.get('/logout', function(req, res) {
  req.session.destroy();
   //  res.render('index', { logged:'false'});
	 res.redirect("/login");

});

module.exports = router;