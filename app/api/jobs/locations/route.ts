import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Job from "@/lib/models/job"

export async function GET() {
  try {
    await connectToDatabase()

    const locations = await Job.distinct("location", { isActive: true })

    return NextResponse.json(locations)
  } catch (error) {
    console.error("Get locations error:", error)
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 })
  }
}
