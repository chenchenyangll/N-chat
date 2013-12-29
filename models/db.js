var settings = require('../settings.js');
var mongoose = require('mongoose');
mongoose.connect(settings.db.url);

module.exports = mongoose;