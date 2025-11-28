"use client"

import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Building2, User, Clock, Loader2, Mail, ExternalLink } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminApplicationsPage() {
  const { data: applications, isLoading } = useSWR("/api/applications", fetcher)

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
        <h1 className="text-2xl font-bold text-foreground">All Applications</h1>
        <p className="text-muted-foreground">View all job applications on the platform (read-only)</p>
      </div>

      {!applications || applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No applications yet</h3>
            <p className="mt-2 text-muted-foreground">Applications will appear here once job seekers start applying</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map(
            (app: {
              _id: string
              status: string
              createdAt: string
              jobId: {
                _id: string
                title: string
                company: string
              }
              seekerId: {
                _id: string
                name: string
                email?: string
                skills?: string[]
                resumeUrl?: string
              }
            }) => (
              <Card key={app._id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-lg">{app.seekerId?.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>
                          Applied for: {app.jobId?.title} at {app.jobId?.company}
                        </span>
                      </div>
                    </div>
                    <StatusBadge
                      status={app.status as "pending" | "reviewed" | "accepted" | "rejected"}
                      type="application"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {app.seekerId?.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{app.seekerId.email}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Applied {formatDate(app.createdAt)}</span>
                    </div>
                  </div>

                  {app.seekerId?.skills && app.seekerId.skills.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-sm font-medium text-muted-foreground">Skills:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {app.seekerId.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {app.seekerId?.resumeUrl && (
                    <div className="flex items-center gap-2 pt-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={app.seekerId.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        View Resume
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
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
