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
  
  $('#chat_form').submit(function(e) {
    var msg = $('#chat_form textarea').val();
    // escape html code
    say(msg.toHtmlEncode());
    e.preventDefault();
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

String.prototype.toHtmlEncode = function() {
  var str = this;
  str = str.replace(/&/g, "&amp;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/>/g, "&gt;");
  str = str.replace(/\'/g, "&apos;");
  str = str.replace(/\"/g, "&quot;");
  str = str.replace(/\x0a/g, "<br/>");
  str = str.replace(/\ /g, "&nbsp;");
  str = str.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
  return str;
}

function now() {
  var date = new Date();
  var time = date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ':' + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
  //var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
  return time;
}
