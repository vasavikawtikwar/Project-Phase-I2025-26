import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await query(
      "SELECT id, text_content, analysis_type, results, score, created_at FROM analyses WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20",
      [session.userId],
    )

    return NextResponse.json({ analyses: result.rows })
  } catch (error: any) {
    console.error("Get analysis history error:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
