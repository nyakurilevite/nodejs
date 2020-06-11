$( document ).ready(function() {
  
  // SUBMIT FORM
    $("#search_user").keyup(function(event) {
    // Prevent the form from submitting via the browser.
    event.preventDefault();
    ajaxSearch();
  });
    
    
    function ajaxSearch(){
      
      // PREPARE FORM DATA
      var formData = {
        firstname : $("#search_user").val()
      }
      // DO POST
      $.ajax({
      type : "POST",
      contentType : "application/json",
      url : "api/customers/search",
      data : JSON.stringify(formData),
      dataType : 'json',
      success: function(result){
        var custList = "";
		var id=0;
		$('tbody').empty();
        $.each(result, function(i, customer){
			id=id+1;
			
          $('tbody').append("<tr><td>"+ id + "</td><td> " + customer.FIRST_NAME + "</td><td> " + customer.LAST_NAME + "</td><td> " + customer.AGE + "</td><td> " + customer.SEX + "</td><td> " + customer.INCOME + "</td><td> " + customer.INCOME*12 + "</td><td> <a id='delete"+ id + "' href='javascript:void();' class='btn btn-link'>Delete</a></td><td><a id='load"+ id + "' href='javascript:void();' class='btn btn-link'>Load & Update</a></td></tr>");
		  $('#delete'+id).click(function(){
			  if(confirm("Are you sure?"))
			  {
				$.ajax({
                type : "DELETE",
                url : "api/customers/delete/" + customer.id,
                success: function(result){
		         $('#feedback').html(result);
	             }
				})
			  }
			  });
			  
			  $('#load'+id).click(function(){
				$.ajax({
                type : "GET",
                url : "api/customers/get/" + customer.id,
                success: function(result){
					$.each(result, function(i, employee){
			          $('#firstname').val(employee.FIRST_NAME);
					  $('#lastname').val(employee.LAST_NAME);
					  $('#age').val(employee.AGE);
					  $('#income').val(employee.INCOME);
					  $('#account_id').val(employee.id);
					});
	             }
				})
			  });
			  
		  })
		  if(id==0)
		  {
			 $('tbody').empty();
			  $('tbody').append("<tr><td colspan='8'><h3 align='center'>No results found</h3></td></tr>");
			  $('#feedback').empty();
		  }
		  else
		  {
       		$('#feedback').html("<h3>("+ id +")  Results found</h3>");
		  }

		
        console.log("Success: ", result);
      },
	  
    });
      
      
 
    }
})