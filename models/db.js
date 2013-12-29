var settings = require('../settings.js');
var mongoose = require('mongoose');
mongoose.connect(settings.urlLocal);

module.exports = mongoose;