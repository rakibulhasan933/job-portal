"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Clock, FileText, Loader2 } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function SeekerApplicationsPage() {
  const { user } = useAuth()

  const { data: applications, isLoading } = useSWR(user?._id ? `/api/applications?seekerId=${user._id}` : null, fetcher)

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
        <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
        <p className="text-muted-foreground">Track the status of your job applications</p>
      </div>

      {!applications || applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No applications yet</h3>
            <p className="mt-2 text-muted-foreground">Start applying to jobs to see them here</p>
            <Button asChild className="mt-4">
              <Link href="/">Browse Jobs</Link>
            </Button>
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
                location: string
              }
            }) => (
              <Card key={app._id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        <Link href={`/jobs/${app.jobId?._id}`} className="hover:text-primary transition-colors">
                          {app.jobId?.title}
                        </Link>
                      </CardTitle>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>{app.jobId?.company}</span>
                      </div>
                    </div>
                    <StatusBadge
                      status={app.status as "pending" | "reviewed" | "accepted" | "rejected"}
                      type="application"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{app.jobId?.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Applied {formatDate(app.createdAt)}</span>
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
