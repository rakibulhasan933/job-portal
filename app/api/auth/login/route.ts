import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/lib/models/user"
import bcrypt from "bcryptjs"
import { signToken, setTokenCookie } from "@/lib/jwt"

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { email, password } = body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check if blocked
    if (user.isBlocked) {
      return NextResponse.json({ error: "Your account has been blocked. Please contact support." }, { status: 403 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      isBlocked: user.isBlocked,
    })

    await setTokenCookie(token)

    // Return user without password
    const userResponse = {
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
    }

    return NextResponse.json(userResponse)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}
