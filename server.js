
var mongoose = require('mongoose');
require('express-mongoose');
var models = require('./models');
var Sensor = mongoose.model('Sensor');
var SensorDataMod = mongoose.model('SensorData');
var mqtt = require('mqtt')



var User = mongoose.model('User');
var actuatorsList = mongoose.model('ActuatorsList');
var nodemailer = require('nodemailer');



var Twitter = require('twitter');
 






var client = mqtt.createClient(1883, "broker.mqtt-dashboard.com");







var express = require('express')
var app = express()


var http_host = (process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
var http_port = (process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);



app.set('port', http_port);
app.set('host',http_host);



app.get('/', function (req, res) {
  res.send('Hello World!')
})




var server = app.listen(app.get('port'), app.get('host'), function() {
  console.log('Express server listening on ' + server.address().address + ':' + server.address().port);
});


module.exports = app;







mongoose.connect('mongodb://admin:password@ds031721.mongolab.com:31721/egyiotportal', function (err) {
	console.log("APP.JS Processing connected to mongoDB");

  if (err){  
	  console.log(" Error Message is "+err);
  }else{
	  
	 Sensor.find({  }, function(err, sensors) {
    if (err) {
    } else {
		if(sensors.length > 0){
			for(var i=0;i<sensors.length;i++){
				if(sensors[i].type !=  "actuator"){
            client.subscribe(sensors[i]._id);
							console.log("Registered to "+sensors[i]._id);

				}
			}
	}

    }
  });
  
  
	  
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

if(actuator != "No" || actuator != "No	"){
	console.log(" %%%%%%%%%%%% Message Publised to Event Trigger");
	client.publish(actuator, command);

}
		
		
		


var mobile=sensor.mobile;
		
var email=sensor.email;
if(sensor.sms == "sms"){



console.log("****************** sending Tweets");
	  User.findById(email, function (err, user) {


		      
			  

		 
		  
		  
		  
var twit = new Twitter({
  consumer_key: 'qu8pVznlr5URezLqEWByr96f8',
  consumer_secret: 'KDKyqdcmgxxbgekSoQuRcms0HpdRzxyxxevrKaRhBqoTumqRP7',
  access_token_key: user.accesstoken,
  access_token_secret: user.acesstokensecret
});
 


twit.post('statuses/update', {status: '#IoT, Sensor Alert from SenseEgypt Platform Regarding your sensor measurements which is currently :  '+message +' at '+ Date.now()},  function(error, tweet, response) {
  if(error) {
	  
	    console.log(error)
  }
  
  console.log(tweet);  // Tweet body. 
  console.log(response);  // Raw response object. 
});


 });
}

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
    subject: 'SenseEgypt Sensor Alert', // Subject line
    text: 'SenseEgypt Sensor Alert', // plaintext body
    html: '<b>Sensor Alert from SenseEgypt Platform Regarding your sensor measurements which is currently :  '+message+'</b>' // html body
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

	}else{
		
		        console.log('There is no Actuators: ');

		
		
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







setInterval(publichMeasurements, 10*1000);

function publichMeasurements() {
	
	  client.publish("EgyptIOT/Portal/EGYIOT/sensor/STORMQ/TempratureSensor/VJ0M6UCNf14", ""+Math.floor((Math.random() * 35) + 20));

	console.log("Message sent to broker "+Math.floor(Math.random() * 6) + 1  );


}




setInterval(subscribeNewSensors, 10*500);

function subscribeNewSensors() {
		 Sensor.find({  }, function(err, sensors) {
    if (err) {
    } else {
		if(sensors.length > 0){
			for(var i=0;i<sensors.length;i++){
				if(sensors[i].type !=  "actuator"){
									console.log("Registered to "+sensors[i]._id);

            client.subscribe(sensors[i]._id);
				}
			}
	}

    }
  });
  


}
