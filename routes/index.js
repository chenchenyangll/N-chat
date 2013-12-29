var crypto = require('crypto');
var User = require('../models/user.js');

module.exports = function(app) {
  app.get('/', function(req, res) {
    if (req.session.user) {
      console.log('session: username ' + req.session.user.username);
    }
    res.render('index', { 
      title: 'N-chat' 
    });
  });
  
  app.get('/reg', function(req, res) {
    res.render('reg', { 
      title: '注册' 
    });
  });
  app.post('/reg', function(req, res) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    
    var newUser = new User({ 
      username: req.body.username, 
      email: req.body.email, 
      password: password 
    });  
    
    User.exists(req.body.username, function(err, user) {
      if (err) {
        console.log(err);
        return res.redirect('back');
      }
      if (user) {
        console.log('username exists!');
        return res.redirect('back');
      }
      newUser.save(function(err) {
        if (err) {
          console.log(err);
          return res.redirect('back');
        } else {
          console.log('user save success');
          req.session.user = newUser;
          res.redirect('/');
        }
      });      
    });
  });
  
  app.get('/login', function(req, res) {
    if (req.session.user) {
      req.flash('success', 'Already Login!');
      return res.redirect('/');
    }
    res.render('login', { 
      title: 'login'
    });
  });
  app.post('/login', function(req, res) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    
    User.exists(req.body.username, function(err, user) {
      if (err) {
        console.log(err);
        return res.redirect('back');
      }
      if (!user) {
        console.log('username does not exist!');
        return res.redirect('back');
      }
      if (user.password != password) {
        console.log('password is not correct!');
        return res.redirect('back');
      }
      console.log('login success!');
      req.session.user = user;
      return res.redirect('/');
    });
  });
};