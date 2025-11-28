import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign, Building2 } from "lucide-react"

interface JobCardProps {
  job: {
    id?: string
    _id?: string
    title: string
    company: string
    location: string
    jobType: string
    salaryRange: string
    description: string
    createdAt: string | Date
  }
}

const jobTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "Full-time":
      return "default"
    case "Part-time":
      return "secondary"
    case "Remote":
      return "outline"
    case "Contract":
      return "secondary"
    default:
      return "default"
  }
}

export function JobCard({ job }: JobCardProps) {
  const jobId = job.id || job._id

  return (
    <Link href={`/jobs/${jobId}`}>
      <Card className="group h-full transition-all duration-200 hover:border-primary/50 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {job.title}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                <span>{job.company}</span>
              </div>
            </div>
            <Badge variant={jobTypeBadgeVariant(job.jobType)} className="shrink-0">
              {job.jobType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" />
              <span>{job.salaryRange}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Posted {formatDate(job.createdAt)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function formatDate(date: string | Date) {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return "today"
  if (days === 1) return "yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}
