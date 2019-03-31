var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
    name : { type: String, required : true},
    username : { type: String, required : true},
    email: { type: String, required : true},
    password: { type: String, required : true}
});

var User = module.exports = mongoose.model('User', userSchema);


module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    })
}