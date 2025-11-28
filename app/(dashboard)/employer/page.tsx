"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MapPin, DollarSign, Clock, Plus, Edit, AlertTriangle, Loader2 } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function EmployerDashboardPage() {
  const { user } = useAuth()

  const isPending = !user?.isApproved

  const { data: myJobs, isLoading } = useSWR(
    user?._id && user?.isApproved ? `/api/jobs?employerId=${user._id}&activeOnly=false` : null,
    fetcher,
  )

  if (isPending) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employer Dashboard</h1>
          <p className="text-muted-foreground">Manage your job postings</p>
        </div>

        <Alert className="border-warning bg-warning/10">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <AlertTitle className="text-warning-foreground">Account Pending Approval</AlertTitle>
          <AlertDescription className="text-warning-foreground/80">
            Your employer account is pending approval by an administrator. You&apos;ll be able to post jobs once your
            account is approved.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Job Postings</h1>
          <p className="text-muted-foreground">{myJobs?.length || 0} positions</p>
        </div>
        <Button asChild>
          <Link href="/employer/post">
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </div>

      {!myJobs || myJobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Plus className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No jobs posted yet</h3>
            <p className="mt-2 text-muted-foreground">Create your first job posting to start receiving applications</p>
            <Button asChild className="mt-4">
              <Link href="/employer/post">Post a Job</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {myJobs.map(
            (job: {
              _id: string
              title: string
              company: string
              location: string
              salaryRange: string
              jobType: string
              isActive: boolean
            }) => (
              <Card key={job._id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="mt-1">{job.company}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={job.isActive ? "default" : "secondary"}>
                        {job.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/employer/edit/${job._id}`}>
                          <Edit className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </Button>
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
                      <span>{job.jobType}</span>
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
