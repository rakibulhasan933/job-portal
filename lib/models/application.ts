import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId
  jobId: mongoose.Types.ObjectId
  seekerId: mongoose.Types.ObjectId
  status: "pending" | "reviewed" | "accepted" | "rejected"
  createdAt: Date
  updatedAt: Date
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    seekerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "reviewed", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true },
)

// Ensure a seeker can only apply once per job
ApplicationSchema.index({ jobId: 1, seekerId: 1 }, { unique: true })

const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema)

export default Application
