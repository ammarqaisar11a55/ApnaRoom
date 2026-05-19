const mongoose = require('mongoose');

let cachedConn = global.__mongoose_conn;
let cachedPromise = global.__mongoose_promise;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required');
  }

  if (cachedConn) return cachedConn;
  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then((conn) => {
        cachedConn = conn;
        return conn;
      });
  }

  try {
    const conn = await cachedPromise;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    cachedPromise = null;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

global.__mongoose_conn = cachedConn;
global.__mongoose_promise = cachedPromise;

module.exports = connectDB;
