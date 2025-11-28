import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  password: string
  role: "seeker" | "employer" | "admin"
  skills?: string[]
  resumeUrl?: string
  company?: string
  isApproved: boolean
  isBlocked: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["seeker", "employer", "admin"], required: true },
    skills: [{ type: String }],
    resumeUrl: { type: String },
    company: { type: String },
    isApproved: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
