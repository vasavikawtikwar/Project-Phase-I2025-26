import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 })
    }

    const result = await query("DELETE FROM feedback WHERE id = $1 RETURNING id", [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Feedback deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
