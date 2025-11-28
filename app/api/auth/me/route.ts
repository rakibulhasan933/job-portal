import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/lib/models/user"
import { getCurrentUser } from "@/lib/jwt"

export async function GET() {
  try {
    const tokenPayload = await getCurrentUser()

    if (!tokenPayload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    await connectToDatabase()

    const user = await User.findById(tokenPayload.userId).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return NextResponse.json({ error: "Your account has been blocked" }, { status: 403 })
    }

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      skills: user.skills,
      resumeUrl: user.resumeUrl,
      isApproved: user.isApproved,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error("Get current user error:", error)
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 })
  }
}
