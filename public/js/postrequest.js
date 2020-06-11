$( document ).ready(function() {
  
  // SUBMIT FORM
    $("#submit_btn").click(function(event) {
    // Prevent the form from submitting via the browser.
    event.preventDefault();
    ajaxPost();
  });
    
    
    function ajaxPost(){
      
      // PREPARE FORM DATA
      var formData = {
        firstname : $("#firstname").val(),
        lastname :  $("#lastname").val(),
		sex :  $("#sex").val(),
		income :  $("#income").val(),
		age :  $("#age").val()
      }
      // DO POST
      $.ajax({
      type : "POST",
      contentType : "application/json",
      url : "api/customers/save",
      data : JSON.stringify(formData),
      dataType : 'json',
      success : function(customer) {
        $("#feedback").html(customer); 
      }
	  
    });
      
      
 
    }
})