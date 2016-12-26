var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var engines = require('consolidate');
var mongoose = require('mongoose');
require('express-mongoose');
var models = require('./models');
var Sensor = mongoose.model('Sensor');
var SensorDataMod = mongoose.model('SensorData');

var mqtt = require('mqtt')


var fs = require('fs');
var https = require('https')






var User = mongoose.model('User');
var actuatorsList = mongoose.model('ActuatorsList');
var crypto = require('crypto');
var shortid = require('shortid');
var nodemailer = require('nodemailer');






var index = require('./routes/index');

var app = express();

var http_host = (process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
var http_port = (process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('sensorCounter',2);
app.set('port', http_port);
app.set('host',http_host);

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

 //use favicon
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// add session to store the api-key and auth token in the session
app.use(session({secret: 'iotfCloud123456789',saveUninitialized: true,
                 resave: true}));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
var client = mqtt.createClient(1883, "broker.mqtt-dashboard.com");




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
				console.log("Registered to "+sensors[i]._id);
            client.subscribe(sensors[i]._id);
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






app.use('/',index);


app.use(function(req, res, next) {
    if(req.session.api_key){
		console.log("APP.JS 4");

    res.redirect("/index");
	}else{
	  console.log("APP.JS 5");

	  console.log("App login ");
	  
       //res.render('login');
       res.redirect("/login");

				//res.render("login",{ title: 'ejs' });

	}
});


/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



/*
var server = app.listen(app.get('port'), app.get('host'), function() {
  console.log('Express server listening on ' + server.address().address + ':' + server.address().port);
});
*/



var https_host = (process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
var https_port = (process.env.OPENSHIFT_NODEJS_PORT || 8080);

var key = fs.readFileSync('./key.pem');
var cert = fs.readFileSync('./cert.pem')
var https_options = {
    key: key,
    cert: cert
};




var server = app.listen(app.get('port'), app.get('host'), function() {
  console.log('Express server listening on ' + server.address().address + ':' + server.address().port);
});


module.exports = app;
