const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);

  console.log(
    `connected to db ${conn.connection.host}`.brightMagenta.underline.bold
  );
};

module.exports = connectDB;
