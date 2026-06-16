import mongoose from "mongoose";
import UserAccount from "../models/UserAccount";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local first, then fall back to .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function cleanUserAccounts() {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error("Error: MONGO_URI environment variable is not defined.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully.");

    console.log("Deleting all user accounts...");
    const result = await UserAccount.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} user accounts.`);
  } catch (error) {
    console.error("Error cleaning user accounts:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
}

cleanUserAccounts();
