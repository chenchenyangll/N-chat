
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var settings = require('./settings.js');
var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 3334);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(flash());
app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ 
  secret: settings.cookieSecret, 
  cookie: { maxAge: 3600000 }, 
  store: new MongoStore(settings.db)
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

var server = http.createServer(app);
var io = require('socket.io').listen(server);
var users = {};
io.sockets.on('connection', function(socket) {
  socket.on('online', function(data) {
    socket.username = data.user;
    if (!users[data.user]) {
      users[data.user] = data.user;
    }
    io.sockets.emit('online', { users: users, user: data.user });
  });
  
  socket.on('disconnect', function() {
    if (users[socket.username]) {
      delete users[socket.username];
      socket.broadcast.emit('offline', { users: users, user: socket.username });
    }
  });
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
