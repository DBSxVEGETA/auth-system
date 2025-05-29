const pool = require("../db");

const createUserTable = `CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);
`;

pool
  .query(createUserTable)
  .then(() => {
    console.log("User table created successfully");
    process.exit();
  })
  .catch((err) => {
    console.log("Error creating user table", err);
    process.exit(1);
  });
