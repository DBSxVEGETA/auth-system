const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

const connectToDatabase = async () => {
  try {
    await pool.query("SELECT NOW()"); // test query
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.error("PostgreSQL connection error:", error.message);
    process.exit(1);
  }
};

module.exports = {
  pool,
  connectToDatabase,
};
