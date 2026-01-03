import { type NextRequest, NextResponse } from "next/server"
import { checkEmailExists } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    const exists = await checkEmailExists(email)
    return NextResponse.json({ exists }, { status: 200 })
  } catch (error: any) {
    console.error("Check email error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
