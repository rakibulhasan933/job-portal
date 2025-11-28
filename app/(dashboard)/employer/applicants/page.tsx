"use client"

import { useAuth } from "@/lib/auth-context"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Mail, ExternalLink, Loader2 } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function EmployerApplicantsPage() {
  const { user } = useAuth()

  const { data: applications, isLoading } = useSWR(
    user?._id ? `/api/applications?employerId=${user._id}` : null,
    fetcher,
  )

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
        <h1 className="text-2xl font-bold text-foreground">Applicants</h1>
        <p className="text-muted-foreground">Review candidates who have applied to your positions</p>
      </div>

      {!applications || applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No applicants yet</h3>
            <p className="mt-2 text-muted-foreground">Once candidates apply to your jobs, they&apos;ll appear here</p>
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
              }
              seekerId: {
                _id: string
                name: string
                email: string
                skills?: string[]
                resumeUrl?: string
              }
            }) => (
              <Card key={app._id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="text-lg">{app.seekerId?.name}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">Applied for: {app.jobId?.title}</p>
                    </div>
                    <StatusBadge
                      status={app.status as "pending" | "reviewed" | "accepted" | "rejected"}
                      type="application"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${app.seekerId?.email}`} className="hover:text-primary">
                      {app.seekerId?.email}
                    </a>
                  </div>

                  {app.seekerId?.skills && app.seekerId.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {app.seekerId.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {app.seekerId?.resumeUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={app.seekerId.resumeUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Resume
                      </a>
                    </Button>
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
