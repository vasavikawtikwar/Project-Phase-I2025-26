import { jwtVerify, SignJWT } from "jose"
import type { User } from "./auth"
import type { NextRequest } from "next/server"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-min-32-characters!")

export async function createSession(user: User): Promise<string> {
  const token = await new SignJWT({ userId: user.id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret)
  return token
}

export async function verifySession(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload as { userId: string; email: string }
  } catch (err) {
    return null
  }
}

export async function getSession(request: NextRequest): Promise<{ userId: string; email: string } | null> {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token) return null
    return await verifySession(token)
  } catch (error) {
    return null
  }
}
