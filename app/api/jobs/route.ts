import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Job from "@/lib/models/job"

// GET all jobs (with optional filters)
export async function GET(request: Request) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location")
    const jobType = searchParams.get("jobType")
    const search = searchParams.get("search")
    const employerId = searchParams.get("employerId")
    const activeOnly = searchParams.get("activeOnly") !== "false"

    // Build query
    const query: Record<string, unknown> = {}

    if (activeOnly) {
      query.isActive = true
    }

    if (location) {
      query.location = location
    }

    if (jobType) {
      query.jobType = jobType
    }

    if (employerId) {
      query.employerId = employerId
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Get jobs error:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

// POST create new job
export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { title, company, location, jobType, salaryRange, description, employerId } = body

    const job = await Job.create({
      title,
      company,
      location,
      jobType,
      salaryRange,
      description,
      employerId,
      isActive: true,
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error("Create job error:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
