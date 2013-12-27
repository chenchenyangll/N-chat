var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/n-chat');

module.exports = mongoose;