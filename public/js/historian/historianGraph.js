
var HistorianGraph = function(){

	this.palette = new Rickshaw.Color.Palette( { scheme: [
	        "#7f1c7d",
	 		"#00b2ef",
			"#00649d",
			"#00a6a0",
			"#ee3e96"
	    ] } );


	this.drawGraph = function(seriesData)
	{
		// instantiate our graph!

		this.graph = new Rickshaw.Graph( {
			element: document.getElementById("chart"),
			width: 900,
			height: 500,
			renderer: 'line',
			stroke: true,
			preserve: true,
			series: seriesData	
		} );

		this.graph.render();

		this.hoverDetail = new Rickshaw.Graph.HoverDetail( {
			graph: this.graph,
			xFormatter: function(x) {
				return new Date(x * 1000).toString();
			}
		} );

		this.annotator = new Rickshaw.Graph.Annotate( {
			graph: this.graph,
			element: document.getElementById('timeline')
		} );

		this.legend = new Rickshaw.Graph.Legend( {
			graph: this.graph,
			element: document.getElementById('legend')

		} );

		this.shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
			graph: this.graph,
			legend: this.legend
		} );

		this.order = new Rickshaw.Graph.Behavior.Series.Order( {
			graph: this.graph,
			legend: this.legend
		} );

		this.highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
			graph: this.graph,
			legend: this.legend
		} );

		this.smoother = new Rickshaw.Graph.Smoother( {
			graph: this.graph,
			element: document.querySelector('#smoother')
		} );

		this.ticksTreatment = 'glow';

		this.xAxis = new Rickshaw.Graph.Axis.Time( {
			graph: this.graph,
			ticksTreatment: this.ticksTreatment,
			timeFixture: new Rickshaw.Fixtures.Time.Local()
		} );

		this.xAxis.render();

		this.yAxis = new Rickshaw.Graph.Axis.Y( {
			graph: this.graph,
			tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
			ticksTreatment: this.ticksTreatment
		} );

		this.yAxis.render();


		this.controls = new RenderControls( {
			element: document.querySelector('form'),
			graph: this.graph
		} );

	};

	
	this.displayHistChart = function(device,histData){

		var seriesData = [];
		var counter = 0;
	    var data = histData;
        var key = 0;
		
		             	seriesData[key]={};
						seriesData[key].color = this.palette.color();
						seriesData[key].data=[];
						seriesData[key].name=0;

					
						
	for(var i =0;  i < data.length  ; i++ ){		   		
	var timestamp = Date.now()/1000+i;
            	var startDate  = new Date(data[i].timestamp);
				//startDate=Math.round(startDate.getTime()/1000);
				startDate=startDate.getTime()/1000
//startDate=startDate.getTime();
				console.log(" *****  Data Element is   "+startDate + " Time Stamp "+timestamp);

				
					seriesData[key].data[i]={};
					
					//seriesData[key].data[i].x = data[i].timestamp.$date/1000;// timestamp;
					seriesData[key].data[i].x = timestamp;
                 //   seriesData[key].data[i].x=startDate;
					seriesData[key].data[i].y = data[i].evt;
				
				//	key++;
					
				console.log(" *****  Data Element is "+data[i].timestamp);

//				
			
			//counter++;
		}	
		
						console.log(" *****  Drawing Date with length "+seriesData[0].data.length);;

		this.drawGraph(seriesData);
		
	}
	
	
	/*
	this.displayHistChart = function(device,histData){
	
	console.log("Display History Chart");

		var seriesData = [];
		var timestamp = Date.now()/1000;

		var counter = 0;

		//var data = histData.events;
		
	    var data = histData;

		for(var i =0;  i < data.length  ; i++ ){	
	   		
	   		var key = 0;	
			
   for(var j = 0;j < data[i].length; j++) {
				if (typeof data[i][j] !== 'string') {
					if(i=== 0 ){
						seriesData[key]={};
						seriesData[key].name=j;
						seriesData[key].color = this.palette.color();
						seriesData[key].data=[];	
					}
					
					seriesData[key].data[counter]={};
					seriesData[key].data[counter].x = timestamp;
					seriesData[key].data[counter].y = data[i][j];
				console.log("Data Element is "+data[i][j]);
					key++;
				}
			}
			
			counter++;
		}	
		this.drawGraph(seriesData);
		
	}
	
	*/
	
	
	


	
	

};