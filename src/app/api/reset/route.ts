import db from "@/lib/db";

export async function GET() {
  try {
    await db.query("DROP TABLE IF EXISTS users");
    return Response.json({ message: "Users table dropped" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Error resetting DB" });
  }
}
