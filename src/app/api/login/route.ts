import db from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { userName, password } = await req.json();

    if (!userName || !password) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    const [rows]: any = await db.query(
      "SELECT * FROM users WHERE userName = ?",
      [userName]
    );

    if (rows.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }

    return Response.json({
      message: "Login successful",
      user: {
        userId: user.userId,
        userName: user.userName,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
