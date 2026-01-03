import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text, analysisType, results, score } = await request.json()

    const result = await query(
      "INSERT INTO analyses (user_id, text_content, analysis_type, results, score) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at",
      [session.userId, text, analysisType, JSON.stringify(results), score],
    )

    return NextResponse.json({
      id: result.rows[0].id,
      created_at: result.rows[0].created_at,
    })
  } catch (error: any) {
    console.error("Save analysis error:", error)
    return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 })
  }
}
