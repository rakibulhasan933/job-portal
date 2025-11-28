import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Job from "@/lib/models/job"

// GET single job
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params

    const job = await Job.findById(id)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error("Get job error:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}

// PUT update job
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params

    const body = await request.json()

    const job = await Job.findByIdAndUpdate(id, { $set: body }, { new: true })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error("Update job error:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

// DELETE job
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params

    const job = await Job.findByIdAndDelete(id)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Delete job error:", error)
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}
