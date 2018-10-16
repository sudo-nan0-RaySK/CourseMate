
  $(function(){
  	$('#signUp').on('click', function(e){
      
      $(".form1").hide("fast");
      $('.form2').css('display', 'inline');

      e.preventDefault();
  	});
  });
    $(function(){
  	$('#logIn').on('click', function(e){
      $(".form2").hide("fast");
      $('.form1').css('display', 'inline');
      e.preventDefault();
  	});
  });
