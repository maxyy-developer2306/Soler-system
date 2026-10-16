import mongoose from "mongoose";

let connectionPromise;

async function dbConection() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not configured");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URL, {
      dbName: "Soler-System-Peoject",
      serverSelectionTimeoutMS: 8000,
    })
      .then(() => mongoose.connection)
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
}

export default dbConection;