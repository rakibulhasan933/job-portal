import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/lib/models/user"

// GET single user
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params

    const user = await User.findById(id).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

// PUT update user
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params

    const body = await request.json()

    // Don't allow password updates through this endpoint
    delete body.password

    const user = await User.findByIdAndUpdate(id, { $set: body }, { new: true }).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
