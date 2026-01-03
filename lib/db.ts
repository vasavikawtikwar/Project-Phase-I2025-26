import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

export async function query(text: string, params?: any[]) {
  try {
    const result = await sql.query(text, params)
    return { rows: result, command: "SELECT" }
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw error
  }
}

export async function getClient() {
  return {
    query: async (text: string, params?: any[]) => {
      return query(text, params)
    },
    release: () => {
      // No-op for serverless driver
    },
  }
}
