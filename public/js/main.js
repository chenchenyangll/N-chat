$(function() {
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