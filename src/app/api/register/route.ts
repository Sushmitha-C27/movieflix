import db from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { userName, email, phone, password } = await req.json();

    if (!userName || !email || !phone || !password) {
      return Response.json({ error: "All fields required" }, { status: 400 });
    }

    // create table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(50) UNIQUE,
        userName VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(15),
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    
  

    // 🔥 generate userId
    const [rows]: any = await db.query("SELECT COUNT(*) as count FROM users");
    const count = rows[0].count + 1;

    const userId = `kodom${String(count).padStart(2, "0")}`;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    await db.query(
      "INSERT INTO users (userId, userName, email, phone, password) VALUES (?, ?, ?, ?, ?)",
      [userId, userName, email, phone, hashedPassword]
    );

    return Response.json({
      message: "Registered successfully",
      userId,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
