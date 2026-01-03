import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO feedback (name, email, subject, message) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, subject, message, created_at`,
      [name, email, subject, message],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 })
    }

    return NextResponse.json({ message: "Feedback submitted successfully", data: result.rows[0] }, { status: 201 })
  } catch (error: any) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await query(
      `SELECT id, name, email, subject, message, created_at 
       FROM feedback 
       ORDER BY created_at DESC`,
    )

    return NextResponse.json({ data: result.rows }, { status: 200 })
  } catch (error: any) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
