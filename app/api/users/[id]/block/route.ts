import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/lib/models/user"

// POST toggle block status
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params

    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    user.isBlocked = !user.isBlocked
    await user.save()

    const userResponse = user.toObject()
    delete userResponse.password

    return NextResponse.json(userResponse)
  } catch (error) {
    console.error("Block user error:", error)
    return NextResponse.json({ error: "Failed to toggle block status" }, { status: 500 })
  }
}
