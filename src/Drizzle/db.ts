import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

// Initialize the client
export const client = new Client({
  connectionString: process.env.Database_URL as string
});

// Connect to database
const main = async () => {
  await client.connect();
};

main()
  .then(() => console.log("Connected to the database"))
  .catch((error) => console.error("Error connecting to the database:", error));

// Create drizzle instance
export const db = drizzle(client, { schema, logger: true });

// Export individual tables for easier access
export const { 
  users,
  doctors,
  appointments,
  prescriptions,
  payments,
  complaints
} = schema;

// Export connection utilities
export const testConnection = async () => {
  try {
    await client.query("SELECT 1");
    return true;
  } catch (error) {
    return false;
  }
};

export const closeConnection = async () => {
  await client.end();
};

// Default export remains db
export default db;