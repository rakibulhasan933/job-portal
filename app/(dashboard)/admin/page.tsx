"use client"

import { useState } from "react"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Building2, Mail, Clock, Loader2 } from "lucide-react"
import useSWR, { mutate } from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminApprovalsPage() {
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const { data: pendingEmployers, isLoading } = useSWR("/api/users?isApproved=false", fetcher)

  const handleApprove = async (userId: string) => {
    setActionLoading(userId)
    try {
      await fetch(`/api/users/${userId}/approve`, { method: "POST" })
      mutate("/api/users?role=employer&isApproved=false")
    } catch (error) {
      console.error("Failed to approve:", error)
    }
    setActionLoading(null)
  }

  const handleReject = async (userId: string) => {
    setActionLoading(userId)
    try {
      // For rejection, we'll just block the user
      await fetch(`/api/users/${userId}/block`, { method: "POST" })
      mutate("/api/users?role=employer&isApproved=false")
    } catch (error) {
      console.error("Failed to reject:", error)
    }
    setActionLoading(null)
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Employer Approvals</h1>
        <p className="text-muted-foreground">Review and approve pending employer accounts</p>
      </div>

      {!pendingEmployers || pendingEmployers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <h3 className="mt-4 text-lg font-medium">All caught up!</h3>
            <p className="mt-2 text-muted-foreground">No pending employer approvals at this time</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingEmployers.map(
            (employer: {
              _id: string
              name: string
              email: string
              company?: string
              isApproved: boolean
              createdAt: string
            }) => (
              <Card key={employer._id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="text-lg">{employer.name}</CardTitle>
                      {employer.company && (
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-3.5 w-3.5" />
                          <span>{employer.company}</span>
                        </div>
                      )}
                    </div>
                    <StatusBadge status="pending" type="employer" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{employer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Registered {formatDate(employer.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApprove(employer._id)}
                      className="gap-2"
                      disabled={actionLoading === employer._id}
                    >
                      {actionLoading === employer._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(employer._id)}
                      className="gap-2 text-destructive hover:text-destructive"
                      disabled={actionLoading === employer._id}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
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
