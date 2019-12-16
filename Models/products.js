const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  cost: String,
  weight: String,
  company: String,
  dealer:[{companyName:String, cost:String}],
  relatedProdct:[{product_oid:String}],
  review:[{user_oid:String,option:String,date:String,isGood:Boolean,content:String}]
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;