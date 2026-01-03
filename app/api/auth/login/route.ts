import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"
import { createSession } from "@/lib/session"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { user, error } = await authenticateUser(email, password)

    if (error || !user) {
      return NextResponse.json({ error: error || "Authentication failed" }, { status: 401 })
    }

    const token = await createSession(user)
    const cookieStore = await cookies()
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
