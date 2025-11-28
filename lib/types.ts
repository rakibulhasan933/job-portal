// Core types for the Job Portal

export type UserRole = "jobseeker" | "employer" | "admin"

export type JobType = "Full-time" | "Part-time" | "Remote" | "Contract"

export type EmployerStatus = "pending" | "approved" | "rejected"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  isBlocked: boolean
  createdAt: Date
  // Job Seeker specific
  bio?: string
  skills?: string[]
  resumeUrl?: string
  // Employer specific
  company?: string
  employerStatus?: EmployerStatus
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  jobType: JobType
  salaryRange: string
  description: string
  employerId: string
  createdAt: Date
  isActive: boolean
}

export interface Application {
  id: string
  jobId: string
  jobSeekerId: string
  status: "pending" | "reviewed" | "accepted" | "rejected"
  appliedAt: Date
  job?: Job
  applicant?: User
}

// Filter types
export interface JobFilters {
  location?: string
  jobType?: JobType
  search?: string
}
