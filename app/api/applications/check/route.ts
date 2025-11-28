import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Application from "@/lib/models/application"

export async function GET(request: Request) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")
    const seekerId = searchParams.get("seekerId")

    if (!jobId || !seekerId) {
      return NextResponse.json({ error: "Missing jobId or seekerId" }, { status: 400 })
    }

    const application = await Application.findOne({ jobId, seekerId })

    return NextResponse.json({ hasApplied: !!application })
  } catch (error) {
    console.error("Check application error:", error)
    return NextResponse.json({ error: "Failed to check application status" }, { status: 500 })
  }
}
