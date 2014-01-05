$(function() {
  var socket = io.connect();
  var self = $.cookie('user');
  socket.emit('online', { user: self });
  socket.on('online', function(data) {
    if (data.user != self) {
      online(data.user);      
    } else {
      
    }
  });
  
  $('#chat_form').submit(function() {
    say($('#chat textarea').val());
    return false;
  });
});

function online(user) {
  $('#chat_content ul').append('<li class="sys_msg"><p>' + user + ' is online now!</p></li>');
}

function say(msg) {
  $.post('/say', {
    'msg': msg
  }, function(data) {
    if (data) {
      alert(data.msg);
      alert(data.time);
    }
  });
}