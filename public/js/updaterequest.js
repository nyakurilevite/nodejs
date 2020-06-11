$( document ).ready(function() {
  
  // SUBMIT FORM
    $("#update_btn").click(function() {
    ajaxUpdate();
  });
    
    
    function ajaxUpdate(){
      
      // PREPARE FORM DATA
      var formData = {
        firstname : $("#firstname").val(),
        lastname :  $("#lastname").val(),
		sex :  $("#sex").val(),
		income :  $("#income").val(),
		age :  $("#age").val(),
		id :  $("#account_id").val()
      }
      // DO POST
      $.ajax({
      type : "PUT",
      contentType : "application/json",
      url : "api/customers/update",
      data : JSON.stringify(formData),
      dataType : 'json',
      success : function(customer) {
        $("#feedback").html(customer); 
      }
	  
    });
      
      
 
    }
})