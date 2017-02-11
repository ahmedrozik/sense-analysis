// Wait for the DOM to be ready
$(function() {
  // Initialize form validation on the registration form.
  // It has the name attribute "registration"
$("form[name='addchannel']").validate({
    // Specify validation rules
	    errorClass: "my-error-class",
    validClass: "my-valid-class",

    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side
     
      channel_name: "required" ,
	  channel_description: "required" ,
	  channel_mob: {
        required: true,
        minlength: 10
      },
	  
	  channel_latitude: "required" ,
	  channel_longitude: "required" 

	
    },
    // Specify validation error messages
    messages: {
      channel_name: "Please enter a valid device name",
	  channel_description: "Please enter a valid description",
	  channel_mob: "Please enter a valid Mobile Number",
	  channel_latitude: "Please enter a valid latitude",
      channel_longitude: "Please enter a valid longitude"

    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
		

			
		   var itemSelected = $("#deviceType option:selected").last();
		var sensorType = itemSelected.val();
		var sms,email,ispublic ;
		var isEmailChecked=$('#email').prop('checked');
		var isSMSChecked=$('#sms').prop('checked');
		var isPublicChecked=$('#ispublic').prop('checked');
				
if(isEmailChecked){
email=$('#email').val()
}else{
email="" ;
}

if(isSMSChecked){
sms=$('#sms').val()
}else{
sms="";
}


if(isPublicChecked){
ispublic=$('#ispublic').val()
}else{
ispublic="false";
}


     var itemSelected = $("#deviceslist option:selected").last();
		var item = itemSelected.val();
		var sensorID;
		if(itemSelected.index() != 0){
		
		var sensorData=item.split("|");
        sensorID=sensorData[0];
        }else{
          sensorID="No";
        }
console.log("Event sensor selected is "+sensorID);

		//Submit Registered Actuators
		
		var TableData;
TableData = storeTblValues()
//TableData = $.toJSON(TableData);
TableData=JSON.stringify(TableData);
console.log("Actuators Data Are :: "+TableData);
function storeTblValues()
{
    var TableData = new Array();

    $('#mydata tr').each(function(row, tr){
        TableData[row]={
            "actuator" : $(tr).find('td:eq(1)').text()
            , "minthreshold" :$(tr).find('td:eq(2)').text()
            , "maxthreshold" : $(tr).find('td:eq(3)').text()
            , "command" : $(tr).find('td:eq(4)').text()
        }    
    }); 
    TableData.shift();  // first row will be empty - so remove
    return TableData;
}



		console.log("SMS Value is "+$('#sms').val()+"Email"+$('#email').val() + " Sensor Type "+sensorType);
                    console.log('select_link clicked');
				    var data = {maxthreshold:$('#channel_maxThreshold').val(),minthreshold:$('#channel_minThreshold').val(),name:$('#channel_name').val(),description:$('#channel_description').val(),longitude:$('#channel_longitude').val(),latitude:$('#channel_latitude').val(),field1:$('#channel_field1').val(),mobile:$('#channel_mob').val(),sms:sms,email:email,ispublic:ispublic,sensortype:sensorType,eventSensor:sensorID,actuatorsList:TableData};
					data.title = "title";
					data.message = "message";
					
					$.ajax({
						type: 'POST',
						data: JSON.stringify(data),
				        contentType: 'application/json',
                        url: '/channel',						
                        success: function(data) {
                            console.log('success');
                            console.log(JSON.stringify(data));
							//<input type="text" name="txtbx'+cnt+'" value="'+cnt+'">
									    $('#channelsettings').hide(); 
										var today = new Date();
                                        var dd = today.getDate();
                                        var mm = today.getMonth()+1; //January is 0!
                                        var yyyy = today.getFullYear();
                                        if(dd<10) {
                                           dd='0'+dd
                                        } 

                                         if(mm<10) {
                                          mm='0'+mm
                                          }    

                                        today = mm+'/'+dd+'/'+yyyy;
										
		
				  var dataStr=JSON.stringify(data);
				   var str1 = dataStr.replace(/"/g, '');
				  console.log("Generated Id"+str1);
				  
				  


  $('#sensorsTable tr:last').after('<tr><td> <h4 style="margin-top: 0;"> <a href="dashboard?sensorId='+str1+'"> <i class="fa fa-unlock fa-fw"></i> '+$('#channel_name').val()+'</a> </h4><h6 style="margin-top: 15px;">MQTT Topic ID :'+str1+'</h6></td><td>'+today+'</td></tr>');
 

                        }
                    });

				
              	
				


	
    }
  });
});