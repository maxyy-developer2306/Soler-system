import mongoose from "mongoose";
import dns from "dns";


async function dbConection() {
  try {
    dns.setServers(["8.8.8.8"]);

    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "Soler-System-Peoject"
    });

    console.log("The mongoDb is connected");
  } catch (error) {
    console.log(error);
  }
}

export default dbConection;