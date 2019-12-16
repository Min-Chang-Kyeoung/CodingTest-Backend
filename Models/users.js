const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  id: String,
  pw: String,
  likedProduct: [{product_oid:String}]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;