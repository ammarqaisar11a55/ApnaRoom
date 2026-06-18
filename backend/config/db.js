const mongoose = require('mongoose');

let cachedConn = global.__mongoose_conn;
let cachedPromise = global.__mongoose_promise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required');
  }

  if (cachedConn) {
    return cachedConn;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then((conn) => {
        cachedConn = conn;
        global.__mongoose_conn = cachedConn;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        cachedPromise = null;
        global.__mongoose_promise = cachedPromise;
        throw error;
      });
    global.__mongoose_promise = cachedPromise;
  }

  return cachedPromise;
};

global.__mongoose_conn = cachedConn;
global.__mongoose_promise = cachedPromise;

module.exports = connectDB;
