var crypto = require('crypto');
var User = require('../models/user.js');

module.exports = function(app) {
  app.get('/', function(req, res) {
    if (req.session.user) {
      console.log('session: username ' + req.session.user.username);
      return res.redirect('/public');
    }
    res.render('index', { 
      title: 'N-chat', 
      success: req.flash('success').toString(), 
      error: req.flash('error').toString()
    });
  });
  
  app.get('/reg', function(req, res) {
    res.render('reg', { 
      title: '注册', 
      success: req.flash('success').toString(), 
      error: req.flash('error').toString() 
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
        req.flash('error', 'Username ' + user.username + ' already exists!');
        return res.redirect('back');
      }
      newUser.save(function(err) {
        if (err) {
          console.log(err);
          return res.redirect('back');
        } else {
          req.flash('success', 'Register success!');
          req.session.user = newUser;
          res.redirect('/');
        }
      });      
    });
  });
  
  app.get('/login', function(req, res) {
    if (req.session.user) {
      req.flash('success', 'Already login!');
      return res.redirect('/');
    }
    res.render('login', { 
      title: 'login', 
      success: req.flash('success').toString(), 
      error: req.flash('error').toString()
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
        req.flash('error', 'Username ' + req.body.username + ' does not exist!');
        return res.redirect('back');
      }
      if (user.password != password) {
        req.flash('error', 'Password is not correct!');
        return res.redirect('back');
      }
      req.flash('success', 'Login success!');
      req.session.user = user;
      return res.redirect('/');
    });
  });
  
  app.get('/public', function(req, res) {
    res.render('public', { 
      title: 'public', 
      success: req.flash('success').toString(), 
      error: req.flash('error').toString()
    });
  });
};