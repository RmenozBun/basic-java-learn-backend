import mongoose from "mongoose";
import config from "./config.js";

const buildUri = () => {
  // MongoDB Atlas gives a full mongodb+srv:// connection string — pass it
  // through as-is rather than trying to reassemble it from host/user/password
  // (Atlas doesn't use a plain host:port anyway).
  if (config.db.mongoDB.uri) return config.db.mongoDB.uri;

  const { username, password, host, database } = config.db.mongoDB;
  if (username && password) {
    return `mongodb://${username}:${password}@${host}/?readPreference=primary&authSource=${database}`;
  }
  return `mongodb://${host}`;
};

const connectDB = async () => {
  try {
    await mongoose.connect(buildUri(), { dbName: config.db.mongoDB.database });
    console.log(`MongoDB connected ${config.db.mongoDB.database} successfully`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export { connectDB };
