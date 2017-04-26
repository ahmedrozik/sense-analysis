$(document).ready(function () {


  // Initialize form validation on the registration form.
  // It has the name attribute "registration"
  $("form[name='resetpassform']").validate({
	    errorClass: "my-error-class",
    validClass: "my-valid-class",
	
    // Specify validation rules
    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side
   

      newpass: {
        required: true,
        minlength: 6
      },
	    confpass: {
      equalTo: "#newpass"
    }
	
    },
    // Specify validation error messages
    messages: {
      pass: {
        required: "Please provide a password",
        minlength: "Your password must be at least 6 characters long"
      }
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
		
		      form.submit();

    }
  });
});