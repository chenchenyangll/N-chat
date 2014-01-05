$(function() { 
  /* alert bar */
  $('.alert_bar .close').click(function() {
    $(this).parents('.alert_bar').animate({ height: 0 }, 500, function() {
      $(this).remove();
    });
  });
  
  /* reg ui */
  var secret_laugh;
  var secret_laugh_jump = function() {
    var $this = $('#secret_laugh');
    $this.animate({ 
      'margin-top': '10px'
    }, 100).animate({
      'margin-top': '0'
    }, 100);
  };
  $('#secret_laugh').hover(function() {
    secret_laugh = setInterval(secret_laugh_jump, 200);
  }, function() {
    clearInterval(secret_laugh);
  });
});
