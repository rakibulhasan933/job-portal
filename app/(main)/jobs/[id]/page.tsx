"use client"

import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, DollarSign, Clock, Building2, ArrowLeft, CheckCircle2, Briefcase, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import useSWR, { mutate } from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [isApplying, setIsApplying] = useState(false)

  const { data: job, isLoading: jobLoading } = useSWR(params.id ? `/api/jobs/${params.id}` : null, fetcher)

  const { data: applicationStatus, isLoading: statusLoading } = useSWR(
    user?.role === "seeker" && params.id ? `/api/applications/check?jobId=${params.id}&seekerId=${user._id}` : null,
    fetcher,
  )

  if (jobLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!job || job.error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Briefcase className="mx-auto h-16 w-16 text-muted-foreground/50" />
        <h1 className="mt-4 text-2xl font-bold">Job not found</h1>
        <p className="mt-2 text-muted-foreground">This job may have been removed or doesn&apos;t exist.</p>
        <Button asChild className="mt-6">
          <Link href="/">Browse Jobs</Link>
        </Button>
      </div>
    )
  }

  const alreadyApplied = applicationStatus?.hasApplied

  const handleApply = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    setIsApplying(true)

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job._id,
          seekerId: user._id,
        }),
      })

      if (response.ok) {
        // Revalidate the application status
        mutate(`/api/applications/check?jobId=${params.id}&seekerId=${user._id}`)
      }
    } catch (error) {
      console.error("Failed to apply:", error)
    }

    setIsApplying(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6 gap-2">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{job.company}</span>
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0 self-start">
                  {job.jobType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{job.salaryRange}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Job Description</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              {statusLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : alreadyApplied ? (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                  <p className="mt-3 font-medium text-foreground">Application Submitted</p>
                  <p className="mt-1 text-sm text-muted-foreground">You have already applied for this position</p>
                  <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                    <Link href="/seeker/applications">View Applications</Link>
                  </Button>
                </div>
              ) : user?.role === "seeker" ? (
                <Button className="w-full" size="lg" onClick={handleApply} disabled={isApplying}>
                  {isApplying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </Button>
              ) : user?.role === "employer" || user?.role === "admin" ? (
                <p className="text-center text-sm text-muted-foreground">Only job seekers can apply for positions</p>
              ) : (
                <div className="space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/login">Sign in to Apply</Link>
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline">
                      Register
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">About {job.company}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {job.company} is a leading company in its industry, committed to innovation and excellence.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}
