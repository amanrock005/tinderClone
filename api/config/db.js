import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`connected to mongoDB ${conn.connection.host}`);
  } catch (err) {
    console.log("error while connecting to mongoDB");
    process.exit(1);
  }
};
