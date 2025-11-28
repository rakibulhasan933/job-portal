"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, Clock, Building2, Loader2 } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminJobsPage() {
  const { data: jobs, isLoading } = useSWR("/api/jobs?activeOnly=false", fetcher)

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">All Jobs</h1>
        <p className="text-muted-foreground">View all job postings on the platform (read-only)</p>
      </div>

      {!jobs || jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No jobs posted yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map(
            (job: {
              _id: string
              title: string
              company: string
              location: string
              salaryRange: string
              jobType: string
              isActive: boolean
              createdAt: string
            }) => (
              <Card key={job._id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>{job.company}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={job.isActive ? "default" : "secondary"}>
                        {job.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{job.jobType}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>{job.salaryRange}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Posted {formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ),
          )}
        </div>
      )}
    </div>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
