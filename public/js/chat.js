$(function() {
  var socket = io.connect();
  var self = $.cookie('user');
  
  socket.emit('online', { user: self });
  
  socket.on('online', function(data) {
    if (data.user != self) {
      onOnline(data.user);      
    } else {
      
    }
  });
  socket.on('say', function(data) {
    //if (data.to == null) {
    //} else {
    //}
    onSay(data.from, data.msg);
  });
  
  $('#chat_form').submit(function() {
    say(escapeHtml($('#chat textarea').val()));
    return false;
  });
  
  var onOnline = function(user) {
    $('#chat_content ul').append('<li class="sys_msg"><p>' + user + ' is online now!</p></li>');
  };
  var onSay = function(from, msg) {
    $('#chat_content ul').append('<li class="chat_msg"><p class="chat_msg_head">'
      + from + ' ' + now() 
      + '</p><p class="chat_msg_content">' + msg + '</p></li>');
    var div = $('#chat_content')[0];
    div.scrollTop = div.scrollHeight;
  };
  var say = function(msg) {
    onSay(self, msg);
    socket.emit('say', { from: self, to: null, msg: msg });
    $('#chat_form textarea').val('').focus();
  };
});

function escapeHtml(str) {
  str = str.replace("&", "&amp;");
  str = str.replace("\"", "&quot;");
  str = str.replace("'", "&#039;");
  str = str.replace("<", "&lt;");
  str = str.replace(">", "&gt;");
  return str;
}

function now() {
  var date = new Date();
  var time = date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ':' + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
  //var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
  return time;
}
