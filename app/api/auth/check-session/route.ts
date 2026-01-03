import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    return NextResponse.json({ userId: session.userId })
  } catch {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
}
