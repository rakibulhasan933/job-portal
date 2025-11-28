"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, ShieldOff, Search, Mail, Calendar, Loader2 } from "lucide-react"
import useSWR, { mutate } from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const { data: users, isLoading } = useSWR("/api/users", fetcher)

  const filteredUsers =
    users?.filter(
      (user: {
        _id: string
        name: string
        email: string
        role: string
        isBlocked: boolean
      }) => {
        if (user.role === "admin") return false
        if (roleFilter !== "all" && user.role !== roleFilter) return false
        if (searchTerm) {
          const search = searchTerm.toLowerCase()
          return user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search)
        }
        return true
      },
    ) || []

  const toggleBlock = async (userId: string) => {
    setActionLoading(userId)
    try {
      await fetch(`/api/users/${userId}/block`, { method: "POST" })
      mutate("/api/users")
    } catch (error) {
      console.error("Failed to toggle block:", error)
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
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">View and manage all platform users</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="seeker">Job Seekers</SelectItem>
            <SelectItem value="employer">Employers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredUsers.map(
          (user: {
            _id: string
            name: string
            email: string
            role: string
            isBlocked: boolean
            createdAt: string
          }) => (
            <Card key={user._id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {user.name}
                      {user.isBlocked && <Badge variant="destructive">Blocked</Badge>}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1 capitalize">
                      {user.role}
                    </Badge>
                  </div>
                  <Button
                    variant={user.isBlocked ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleBlock(user._id)}
                    className="gap-2"
                    disabled={actionLoading === user._id}
                  >
                    {actionLoading === user._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : user.isBlocked ? (
                      <>
                        <Shield className="h-4 w-4" />
                        Unblock
                      </>
                    ) : (
                      <>
                        <ShieldOff className="h-4 w-4" />
                        Block
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ),
        )}

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No users found</p>
            </CardContent>
          </Card>
        )}
      </div>
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
