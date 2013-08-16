$( function() {
    $('.homePage').bgscroll({scrollSpeed:10, direction:'h' });

	audio = $('audio#mainSound').get(0);
		
	$(audio).bind('play',function() {
	  $(".soundBtn").addClass('playing');		
	}).bind('pause ended', function() {
	  $(".soundBtn").removeClass('playing');		
	});
	
	$(".soundBtn").click(function() {			
	  if (audio.paused) { audio.play(); } 
	  else { audio.pause(); }			
	});
});