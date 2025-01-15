import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";
import pool from "../lib/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeDatabase() {
  try {
    // Read the schema file
    const schemaPath = join(__dirname, "..", "lib", "schema.sql");
    const schema = readFileSync(schemaPath, "utf8");

    // Execute the schema
    await pool.query(schema);
    console.log("Database schema initialized successfully");
  } catch (error) {
    console.error("Error initializing database schema:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

initializeDatabase();
