
// Main UI 
var orgId = "";
var orgName = "";
//flag for historian
var isHistorian = false;
var api_key ="";
var auth_token = "";
var devices = [];


console.log("UI Controller Call 2222 ");


//$("#deviceslist").append("<option value="+myVar+">"+"Temprature Sensor"+"</option>");


var realtime = new Realtime();

	//var sensorTopic =JSON.stringify(channelName);
var historian = new Historian();


$( "#deviceslist" ).change(function() {


	if(isHistorian){
		historian.plotHistoricGraph();
	} else {
		console.log("##### from UI controller before Real time graph");
         items=[];
		realtime.plotRealtimeGraph();
	}
	
});

//Toggle historian options when user selects historic/live data radio buttons
$('#historic').change(function() {
	console.log("Historicc ");
	$('#historicData').show(500);
	historian.plotHistoricGraph();
	isHistorian = true;
});

$('#realtime').change(function() {
	$('#historicData').hide(500);
	realtime.plotRealtimeGraph();
	isHistorian = false;
	console.log("Hit Real time data 22");
});

//plot historic graph when user changes the spinner
$( "#historicTopRange").on( "spinchange", function( event, ui ) {
		console.log("Historicc 22 ");

	historian.plotHistoricGraph();
});

$( "#historicEnds" ).datetimepicker({ onChangeDateTime:function(dp,$input){
		console.log("Historicc   33");

    historian.plotHistoricGraph();
  }
});