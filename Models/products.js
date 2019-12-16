const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  cost: String,
  weight: String,
  company: String,
  colors:[{hexacode:String}],
  dealer:[{companyName:String, cost:String}],
  likedPeople:[{user_id:String}],
  review:[{user_id:String,option:String,date:String,isGood:Boolean,content:String}]
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;