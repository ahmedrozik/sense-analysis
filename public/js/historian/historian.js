
var Historian  = function () {

	var $ = jQuery;
	var historianGraph;

	this.initialize = function() {
		historianGraph = new HistorianGraph();
	}

	this.plotHistoricGraph = function (){
		var item = $( "#deviceslist" ).val();
		var sensorData=item.split("|");
		sensorID=sensorData[0];
		
		if(item) {
			var tokens = item.split(':');

			var top = $( 'input[name=historicQuery]:checked' ).val();
			console.log("called "+top);
			var queryParam = {};
			
			if(top == "topEvents") {
				queryParam = {
					top: $(historicTopRange).spinner( "value" ),
					sensorID:sensorID,
					isdate:'false'
				};
			} 
			else if(top == "dateRange") {
				//Datetimes only in GMT
			//	var startDate = Date.parse($(historicStarts).val()+" GMT");
	        	var startDate = new Date($(historicStarts).val()).toISOString();

				

			    var endDate = new Date($(historicEnds).val()).toISOString();


								
				queryParam = {
					start: startDate,
					end: endDate,
					sensorID:sensorID,
					isdate:'true'

				};
			}
		
		
		
					console.log("Historic Start Date is  "+startDate + "  EnD Date "+endDate );

/*		


			$.ajax
			({
				type: "GET",
				url: "/api/v0002/historian/"+tokens[1]+"/types/"+tokens[2]+"/devices/"+tokens[3],
				data: queryParam,
				dataType: 'json',
				async: true,

				success: function (data, status, jq){

					//clear prev graphs
					$('#chart').empty(); 
					$('#timeline').empty();
					$('#legend').empty();
					historianGraph.displayHistChart(null,data);
				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
				}
			});
	

*/	
			//gethistoricdata
			
				var data = queryParam;
					data.title = "title";
					data.message = "message";
					
					$.ajax({
						type: 'POST',
						data: JSON.stringify(data),
				        contentType: 'application/json',
                        url: '/gethistoricdata',						
                        success: function(data) {
                            console.log('success');
							
				  var dataStr=JSON.stringify(data);
				   var str1 = dataStr.replace(/"/g, '');
                   
				  console.log("Historic Data Returned is "+str1);

				   //clear prev graphs
					$('#chart').empty(); 
					$('#timeline').empty();
					$('#legend').empty();
					historianGraph.displayHistChart(null,data);
				 
 

                        }
                    });
					
			
			
			
		}
	}

	this.initialize();
	var imageHTML = '<div class="iotdashboardtext">The selected device does not have historic events in the Internet of Things Foundation</div><br><div class="iotdashboardtext">Select a different device.</div> <img class="iotimagesMiddle" align="middle" alt="Chart" src="images/IOT_Icons_Thing02.svg">';
};
