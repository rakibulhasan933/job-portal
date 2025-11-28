import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/lib/models/user"
import bcrypt from "bcryptjs"
import { signToken, setTokenCookie } from "@/lib/jwt"

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { name, email, password, role, company, skills, resumeUrl } = body

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, password, and role are required" },
        { status: 400 },
      )
    }

    // Validate role
    if (!["seeker", "employer", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role. Must be 'seeker', 'employer', or 'admin'" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user - seekers and admins are auto-approved
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      company: role === "employer" ? company : undefined,
      skills: role === "seeker" ? skills : undefined,
      resumeUrl: role === "seeker" ? resumeUrl : undefined,
      isApproved: role === "seeker" || role === "admin",
      isBlocked: false,
    })

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

    return NextResponse.json(userResponse, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    return NextResponse.json(
      {
        error: "Failed to register user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
