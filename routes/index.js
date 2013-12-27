
module.exports = function(app) {
  app.get('/', function(req, res) {
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
    
  });
};