import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth"
import { createSession } from "@/lib/session"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { user, error } = await createUser(email, password, fullName)

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    if (user) {
      const token = await createSession(user)
      const cookieStore = await cookies()
      cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
      })

      return NextResponse.json({ user }, { status: 201 })
    }

    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
