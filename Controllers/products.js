'use strict';
const mongoose = require('mongoose');
const Product = require('../Models/products');
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

exports.createProduct = (event, ctx, cb) => {
  ctx.callbackWaitsForEmptyEventLoop = false;
  const { name, cost, weight, company, dealer, likedPeople ,review, colors } = JSON.parse(event.body);
  connect().then(
    () => {
      const product = new Product({ name, cost, weight, company, dealer, likedPeople ,review, colors});
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


