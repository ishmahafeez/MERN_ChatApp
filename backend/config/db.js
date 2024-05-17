const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {});

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

// module.exports = connectDB;

const { MongoClient } = require("mongodb");

// const connectDB = async () => {
//   const uri = process.env.MONGO_URI;
//   const client = new MongoClient(uri);
//   try {
//     await client.connect();

//     console.log("MongoDB Connected".cyan.underline);
//   } catch (error) {
//     console.error(`Error: ${error.message}`.red.bold);
//   }
// };

module.exports = connectDB;
