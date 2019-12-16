const mongoose = require('mongoose');
const User = require('../Models/users');
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

exports.createUser = (event, ctx, cb) => {
  ctx.callbackWaitsForEmptyEventLoop = false;
  const {name,id,pw } = JSON.parse(event.body);
  connect().then(
    () => {
      const user = new User({ name,id,pw});
      return user.save();
    }
  ).then(
    product => {
      cb(null, createResponse(200, product));
    }
  ).catch(
    e => cb(e)
  );
};


