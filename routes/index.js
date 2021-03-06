var crypto = require('crypto');
var User = require('../models/user.js');

module.exports = function(app) {
  app.get('/', function(req, res) {
    debugger;
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
      title: 'Register', 
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
  
  app.get('/login', checkNotLogin);
  app.get('/login', function(req, res) {
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
      res.cookie('user', user.username, { maxAge: 86400000 });
      return res.redirect('/');
    });
  });
  
  app.get('/logout', checkLogin);
  app.get('/logout', function(req, res) {
    req.session.user = null;
    res.clearCookie('user');
    req.flash('success', 'Logout success!');
    return res.redirect('/');
  });
  
  app.get('/public', checkLogin);
  app.get('/public', function(req, res) {
    res.render('public', { 
      title: 'public', 
      success: req.flash('success').toString(), 
      error: req.flash('error').toString()
    });
  });
  
  app.post('/say', function(req, res) {
    console.log(req.body.msg);
    return res.json({ 
      msg: req.body.msg, 
      time: new Date().toString()
    });
  });
  
  function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', 'Already logged in!');
      return res.redirect('back');
    }
    next();
  }
  
  function checkLogin(req, res, next) {
    if (!req.session.user) {
      debugger;
      req.flash('error', 'You are not logged in!');
      return res.redirect('/login');
    }
    next();
  }
};