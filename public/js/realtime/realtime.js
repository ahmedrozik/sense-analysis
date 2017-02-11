
var subscribeTopic = "";

var Realtime = function() {

	var firstMessage = true;

	var clientId="a:"+"EGYIOT"+":" +Date.now();

	var hostname="broker.mqtt-dashboard.com";

	var client;
    var rtGraph;
	this.initialize = function(){
		client = new Messaging.Client(hostname, 8000,clientId);

		// Initialize the Realtime Graph
		rtGraph = new RealtimeGraph();
		client.onMessageArrived = function(msg) {
			console.log("Hit Real time data 12");

			var topic = msg.destinationName;
			//payloadMessage
			var payload2 = JSON.parse(msg.payloadString);
		    var payload=parseFloat(payload2)
			
			 console.log("Message REceived  "+payload);
			 
			 if(items.length <20){
			      items.push({sensor: topic, value: payload});
				}
			/*	if(items.length > 110){
					
					items=[];
					
				}
				*/
				
			 var minThreshold,maxThreshold;
			 console.log("Min Threshold "+window.minThreshold + " Max Threshold "+window.maxThreshold);
			 if(parseFloat(payload) < parseFloat(window.minThreshold) ||parseFloat(payload) > parseFloat(window.maxThreshold)) {
				  var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', 'js/realtime/audio.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
        //audioElement.load()

        $.get();

            audioElement.play();
     
				 
				 
				 
		 }
			
			
			
			
			
			//payload=10;
			console.log("Message Arrived "+msg.payloadString);
			//First message, instantiate the graph  
		    if (firstMessage) {
			console.log("Display chart for first time")

		    	$('#chart').empty();
		    	firstMessage=false;
		    	rtGraph.displayChart(null,payload);
		    } else {
				console.log("Display chart for second time")

		    	rtGraph.graphData(payload);



		    }
		};

		client.onConnectionLost = function(e){
			console.log("Connection Lost at " + Date.now() + " : " + e.errorCode + " : " + e.errorMessage);
			this.connect(connectOptions);
		}

		var connectOptions = new Object();
		connectOptions.keepAliveInterval = 3600;
		connectOptions.useSSL=false;
		//connectOptions.userName=api_key;
		//connectOptions.password=auth_token;

		connectOptions.onSuccess = function() {
			console.log("MQTT connected to host: "+client.host+" port : "+client.port+" at " + Date.now());
		}

		connectOptions.onFailure = function(e) {
			console.log("MQTT connection failed at " + Date.now() + "\nerror: " + e.errorCode + " : " + e.errorMessage);
		}

		console.log("about to connect to " + client.host);
		client.connect(connectOptions);
		
	}

	
	
	// Subscribe to the device when the device ID is selected.
	this.plotRealtimeGraph = function(){
		console.log("plot realtime chart");

		var subscribeOptions = {
			qos : 0,
			onSuccess : function() {
								console.log("subscribed  before error ");

				console.log("subscribed to " + subscribeTopic);
			},
			onFailure : function(){
				console.log("Failed to subscribe to " + subscribeTopic);
				console.log("As messages are not available, visualization is not possible");
			}
		};
										console.log("subscribed  before error 222");

	   var itemSelected = $("#deviceslist option:selected").last();
		var item = itemSelected.val();
		if(itemSelected.index() != 0){
			var sensorData=item.split("|");
			item=sensorData[0];
					console.log(" Item Index "+itemSelected.index() + "item "+item);

			
		}
		

		
		var tokens = item.split(':');
		if(subscribeTopic != "") {

			console.log("Unsubscribing to " + subscribeTopic);
			client.unsubscribe(subscribeTopic);
		}

		//clear prev graphs
		/*
$('#chart').hide(function(){ 
										console.log("subscribed  before error 666 ");

			$('#chart').empty(); 
			$('#chart').show();
			$('#chart').append(imageHTML);
		});
		*/
		
	        $('#chart').empty(); 
			$('#chart').hide();
			$('#chart').show();
			$('#chart').append(imageHTML);

		$('#timeline').empty();
		$('#legend').empty();
		
		firstMessage = true;

		//subscribeTopic = "iot-2/type/" + tokens[2] + "/id/" + tokens[3] + "/evt/+/fmt/json";
	//subscribeTopic="project4fun/temp";


	subscribeTopic=item;
	

		
		client.subscribe(subscribeTopic,subscribeOptions);
	}

	this.initialize();

	var imageHTML = '<div class="iotdashboardtext">The selected device is not currently sending events to the SenseEgypt Internet of Things Plateform</div><br><div class="iotdashboardtext">Select to view historical data or select a different device.</div> <img class="iotimagesMiddle" align="middle" alt="Chart" src="images/IOT_Icons_Thing02.svg">';
}
