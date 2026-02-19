import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: 15678, // 👈 use your Aiven port
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default db;
