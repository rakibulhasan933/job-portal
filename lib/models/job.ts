import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IJob extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  company: string
  location: string
  jobType: "Full-time" | "Part-time" | "Remote"
  salaryRange: string
  description: string
  employerId: mongoose.Types.ObjectId
  isActive?: boolean
  createdAt: Date
  updatedAt: Date
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    jobType: { type: String, enum: ["Full-time", "Part-time", "Remote"], required: true },
    salaryRange: { type: String, required: true },
    description: { type: String, required: true },
    employerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema)

export default Job
