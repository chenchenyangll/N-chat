var mongoose = require('./db.js');

var userSchema = new mongoose.Schema({ 
  username: String, 
  email: String, 
  password: String
});

userSchema.statics.exists = function(username, callback) {
  this.findOne({ username: username }, callback);
};

var User = mongoose.model('User', userSchema);
module.exports = User;