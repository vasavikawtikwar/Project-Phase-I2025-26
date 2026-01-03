import * as bcryptjs from "bcryptjs"
import { query } from "./db"

export interface User {
  id: string
  email: string
  full_name: string
  created_at: string
}

export async function createUser(
  email: string,
  password: string,
  fullName: string,
): Promise<{ user: User | null; error: string | null }> {
  try {
    // Check if user already exists
    const existsResult = await query("SELECT id FROM users WHERE email = $1", [email])
    if (existsResult.rows.length > 0) {
      return { user: null, error: "Email already registered" }
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10)

    // Insert user
    const result = await query(
      "INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name, created_at",
      [email, passwordHash, fullName],
    )

    if (result.rows.length === 0) {
      return { user: null, error: "Failed to create user" }
    }

    return { user: result.rows[0], error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<{ user: User | null; error: string | null }> {
  try {
    const result = await query("SELECT id, email, password_hash, full_name, created_at FROM users WHERE email = $1", [
      email,
    ])

    if (result.rows.length === 0) {
      return { user: null, error: "Invalid email or password" }
    }

    const user = result.rows[0]
    const isPasswordValid = await bcryptjs.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return { user: null, error: "Invalid email or password" }
    }

    const { password_hash, ...userWithoutPassword } = user
    return { user: userWithoutPassword, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await query("SELECT id, email, full_name, created_at FROM users WHERE email = $1", [email])
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    return null
  }
}

export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const result = await query("SELECT id FROM users WHERE email = $1", [email])
    return result.rows.length > 0
  } catch (error) {
    return false
  }
}
