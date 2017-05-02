
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



var client2 = mqtt.createClient(1883, "iot.eclipse.org");

var express = require('express');
var app = express();

var http = require('http');


var aesjs = require('aes-js');

var pbkdf2 = require('pbkdf2');

// An example 128-bit key 
//var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
 
 


//start





var http_host = (process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
var http_port = (process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080 || 8090);



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
			            client2.subscribe(sensors[i]._id);

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
   var key= pbkdf2.pbkdf2Sync('password', 'salt', 1, 256 / 8, 'sha512');

  // Convert text to bytes 
var textBytes = aesjs.utils.utf8.toBytes(message);
 
// The counter is optional, and if omitted will begin at 1 
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
var encryptedBytes = aesCtr.encrypt(textBytes);
 
// To print or store the binary data, you may convert it to hex 
var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
console.log("Encrypted text is "+encryptedHex);
// "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87 
//  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788" 

client.publish(topic+"/s", encryptedHex);



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









client2.on('message', function (topic, message) {
  console.log("Topic name is receive from AUTH &&&  "+ topic + " Message content is  "+message);
  //////
  
     var key= pbkdf2.pbkdf2Sync('password', 'salt', 1, 256 / 8, 'sha512');

  var textBytes = aesjs.utils.utf8.toBytes(message);
 
// The counter is optional, and if omitted will begin at 1 
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
var encryptedBytes = aesCtr.encrypt(textBytes);
 
// To print or store the binary data, you may convert it to hex 
var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
console.log("Encrypted text is "+encryptedHex);
// "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87 
//  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788" 

client2.publish(topic+"/s", encryptedHex);


  
  
  
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
	client2.publish(actuator, command);

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





setInterval(publishTempMeasurements, 10*700);

function publishTempMeasurements() {
	
	  client.publish("EgyptIOT/Portal/EGYIOT/sensor/STORMQ/TempratureSensor/VJ0M6UCNf14", ""+Math.floor(Math.random() * ((25-23)+1) + 23));
	  client2.publish("EgyptIOT/Portal/EGYIOT/sensor/STORMQ/TempratureSensor/VJ0M6UCNf14", ""+Math.floor(Math.random() * ((25-23)+1) + 23));

//	console.log("Message sent to broker "+Math.floor((Math.random() * 35) + 20) );


}



var motionM=0;
var counter=0;
setInterval(publishMotionMeasurements, 10*700);
function publishMotionMeasurements() {
	
	if(counter % 7 == 0 || counter % 9 == 0 || counter % 11 == 0){
		motionM=1;
	}else{
		motionM=0;
		
	}
	  client.publish("EgyptIOT/Portal/EGYIOT/sensor/STORMQ/MotionDetector/N1muezj0M2", ""+motionM);
	  client2.publish("EgyptIOT/Portal/EGYIOT/sensor/STORMQ/MotionDetector/N1muezj0M2", ""+motionM);

	console.log(" ####### message sent to broker counter is  "+counter );
counter=counter+3;


}






var moitureM=0;

setInterval(publishMoitureMeasurements, 10*700);
function publishMoitureMeasurements() {



   var now = new Date();
        if (now.getHours() === 13 || now.getHours() === 14  ) {
	 	moitureM=Math.floor(Math.random() * ((500-400)+1) + 400);

				  client.publish("EgyptIOT/Portal/EGYIOT/sensor/STORMQ/Moisture/EyjjjnoAz3", ""+moitureM);
				  client2.publish("EgyptIOT/Portal/EGYIOT/sensor/STORMQ/Moisture/EyjjjnoAz3", ""+moitureM);

        }else{
				moitureM=Math.floor(Math.random() * ((45-30)+1) + 30);

				  client.publish("EgyptIOT/Portal/EGYIOT/sensor/STORMQ/Moisture/EyjjjnoAz3", ""+moitureM);

							  client2.publish("EgyptIOT/Portal/EGYIOT/sensor/STORMQ/Moisture/EyjjjnoAz3", ""+moitureM);

		}
		
		

}

//&& now.getHours() === 12 && now.getMinutes() === 0


var humidityM=0;

setInterval(publishHumidityMeasurements, 10*700);
function publishHumidityMeasurements() {

				humidityM=Math.floor(Math.random() * ((37-33)+1) + 33);

				  client.publish("EgyptIOT/Portal/EGYIOT/sensor/STORMQ/Humidity/V1t3CSkkQ2", ""+humidityM);
						  client2.publish("EgyptIOT/Portal/EGYIOT/sensor/STORMQ/Humidity/V1t3CSkkQ2", ""+humidityM);


}




var waterM=0;

setInterval(publishWaterPumpMeasurements, 10*700);
function publishWaterPumpMeasurements() {

		  var now = new Date();
        if (now.getHours() === 13 || now.getHours() === 14  ) {

				  client.publish("EgyptIOT/Portal/EGYIOT/actuator/STORMQ/WaterPump/V1hMyUyy73", ""+1);
				  client2.publish("EgyptIOT/Portal/EGYIOT/actuator/STORMQ/WaterPump/V1hMyUyy73", ""+1);

        }else{

				  client.publish("EgyptIOT/Portal/EGYIOT/actuator/STORMQ/WaterPump/V1hMyUyy73", ""+0);
				  client2.publish("EgyptIOT/Portal/EGYIOT/actuator/STORMQ/WaterPump/V1hMyUyy73", ""+0);

			
		}
		

}







setInterval(subscribeNewSensors, 10*500);

function subscribeNewSensors() {
		 Sensor.find({  }, function(err, sensors) {
    if (err) {
    } else {
		if(sensors.length > 0){
			for(var i=0;i<sensors.length;i++){
				if(sensors[i].type !=  "actuator"){
						//			console.log("Registered to "+sensors[i]._id);

            client.subscribe(sensors[i]._id);
			            client2.subscribe(sensors[i]._id);

				}
			}
	}

    }
  });
  


}





var options = {
  host: 'iot.senseegypt.com',
  path: '/'
};
setInterval(callHttp, 9999999);

function callHttp() {
 
http.get(options, function(resp){
  resp.on('data', function(chunk){
    //do something with chunk

	
  });
}).on("error", function(e){
  console.log("Got error: " + e.message);
});



var options2 = {
  host: 'analysis-senseegypt.rhcloud.com',
  path: '/'
};

http.get(options2, function(resp){
  resp.on('data', function(chunk){
    //do something with chunk

	
  });
}).on("error", function(e){
});


}





//End