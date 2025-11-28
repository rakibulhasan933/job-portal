import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Application from "@/lib/models/application"
import Job from "@/lib/models/job"

// GET applications
export async function GET(request: Request) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const seekerId = searchParams.get("seekerId")
    const employerId = searchParams.get("employerId")
    const jobId = searchParams.get("jobId")

    const query: Record<string, unknown> = {}

    if (seekerId) {
      query.seekerId = seekerId
    }

    if (jobId) {
      query.jobId = jobId
    }

    // If filtering by employer, first get their job IDs
    if (employerId) {
      const employerJobs = await Job.find({ employerId }).select("_id")
      const jobIds = employerJobs.map((job) => job._id)
      query.jobId = { $in: jobIds }
    }

    const applications = await Application.find(query)
      .populate("jobId")
      .populate("seekerId", "-password")
      .sort({ createdAt: -1 })

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Get applications error:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

// POST create application
export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { jobId, seekerId } = body

    // Check if already applied
    const existingApplication = await Application.findOne({ jobId, seekerId })
    if (existingApplication) {
      return NextResponse.json({ error: "You have already applied for this job" }, { status: 400 })
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId)
    if (!job || !job.isActive) {
      return NextResponse.json({ error: "Job not found or no longer accepting applications" }, { status: 404 })
    }

    const application = await Application.create({
      jobId,
      seekerId,
      status: "pending",
    })

    // Populate the application before returning
    const populatedApplication = await Application.findById(application._id)
      .populate("jobId")
      .populate("seekerId", "-password")

    return NextResponse.json(populatedApplication, { status: 201 })
  } catch (error) {
    console.error("Create application error:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
