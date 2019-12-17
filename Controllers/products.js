'use strict';
const mongoose = require('mongoose');
const Product = require('../Models/products');
const User = require('../Models/users');
const async = require('async');
let connection = null;

const connect = () => {
  // 연결 되어있으면 기존것을 연결시키고
  if (connection && mongoose.connection.readyState === 1) return Promise.resolve(connection);
  // 없으면 새로 연결함
  return mongoose.connect('mongodb+srv://janu723:1@serverless-gp7ta.mongodb.net/test').then(
    conn => {
      connection = conn;
      return connection;
    }
  );
};

const createResponse = (status, body) => ({
  statusCode: status,
  body: JSON.stringify(body)
});

const responseForDetailProduct = (status, product) => ({
  statusCode:status,
  body: JSON.stringify({name:product.name,
                        company:product.company,
                        weight:product.weight,
                        imgPath:product.imgPath})
});

const responseForColors = (status, product) => ({
  statusCode:status,
  body: JSON.stringify({colors:product.colors})
})

const responseForCompareProduct = (status, product) => ({
  statusCode:status,
  body: JSON.stringify({company:product.dealer})
})

const responseForReview = (status, product) => ({
  statusCode:status,
  body: JSON.stringify({review:product.review})
})

const responseForRelatedProduct = (status, products) =>({
  statusCode:status,
  body: JSON.stringify(products)
})

exports.createProduct = (event, ctx, cb) => {
  ctx.callbackWaitsForEmptyEventLoop = false;
  const { imgPath, name, cost, weight, company, dealer, likedPeople ,review, colors } = JSON.parse(event.body);
  connect().then(
    () => {
      const product = new Product({ imgPath, name, cost, weight, company, dealer, likedPeople ,review, colors});
      console.log(event.body.dealer);
      return product.save();
    }
  ).then(
    product => {
      cb(null, createResponse(200, product));
    }
  ).catch(
    e => cb(e)
  );
};

exports.getDetailProduct = (event, ctx, cb) =>{
  ctx.callbackWaitsForEmptyEventLoop = false;
  connect().then(
    () => Product.findById({_id:event.pathParameters.oid}).exec()
  ).then(
    product =>{
      if(!product){
        return cb(null, {statusCode:500});
      }
      cb(null, responseForDetailProduct(200, product));
    }
  );
}


exports.getColors = (event, ctx, cb) =>{
  ctx.callbackWaitsForEmptyEventLoop = false;
  
  connect().then(
    () => Product.findById({_id:event.pathParameters.oid}).exec()
  ).then(
    product =>{
      if(!product){
        return cb(null, {statusCode:500});
      }
      cb(null, responseForColors(200, product));
    }
  );
}

exports.getCompareProduct = (event, ctx, cb) =>{
  ctx.callbackWaitsForEmptyEventLoop = false;
  
  connect().then(
    () => Product.findById({_id:event.pathParameters.oid}).exec()
  ).then(
    product =>{
      if(!product){
        return cb(null, {statusCode:500});
      }
      cb(null, responseForCompareProduct(200, product));
    }
  );
}

exports.getRelatedProduct = (event, ctx, cb) =>{
  ctx.callbackWaitsForEmptyEventLoop = false;
  connect().then(
    Product.findById({_id:event.pathParameters.oid}, (error,product) => {
        if(error) cb(null, {statusCode:500})
        let usersLikedOid = [];
        async.each(product.likedPeople.user_id, (peopleOid,callback)=> {
          console.log(peopleOid);
          User.findById({_id:peopleOid}, (error, usersLikedProduct) => {
            if(error) cb(null, {statusCode:500})
            usersLikedOid.push({product_oid:usersLikedProduct.likedProduct});
          })
          callback(null);
        }),function(error){
          if(error) cb(null, {statusCode:500});
          responseForRelatedProduct(200,usersLikedOid);
        }
    })
  )
}

exports.getReview = (event, ctx, cb) =>{
  ctx.callbackWaitsForEmptyEventLoop = false;
  connect().then(
    () => Product.findById({_id:event.pathParameters.oid}).exec()
  ).then(
    product =>{
      if(!product){
        return cb(null, {statusCode:500});
      }
      cb(null, responseForReview(200, product));
    }
  );
}

