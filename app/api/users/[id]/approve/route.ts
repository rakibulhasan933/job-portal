import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/lib/models/user"

// POST approve employer
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params

    const user = await User.findByIdAndUpdate(id, { $set: { isApproved: true } }, { new: true }).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Approve user error:", error)
    return NextResponse.json({ error: "Failed to approve user" }, { status: 500 })
  }
}
