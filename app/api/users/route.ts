import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/lib/models/user"

// GET all users (for admin)
export async function GET(request: Request) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const isApproved = searchParams.get("isApproved")

    const query: Record<string, unknown> = {}

    if (role) {
      query.role = role
    }

    if (isApproved !== null) {
      query.isApproved = isApproved === "true"
    }

    const users = await User.find(query).select("-password").sort({ createdAt: -1 })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
