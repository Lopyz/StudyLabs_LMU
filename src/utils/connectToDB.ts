import mongoose from "mongoose";
// track the connection
let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    return;
  }

  // Ensure the MONGODB_URI is defined
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in the environment variables.");
  }

  try {
    await mongoose.connect(mongoUri, {});
    isConnected = true;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};
