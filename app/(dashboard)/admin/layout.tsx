"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { AuthProvider } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard-shell"
import { Shield, Users, Briefcase, FileText } from "lucide-react"
import { redirect } from "next/navigation"
import { useEffect } from "react"

const navItems = [
  { title: "Approvals", href: "/admin", icon: <Shield className="h-4 w-4" /> },
  { title: "Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
  { title: "All Jobs", href: "/admin/jobs", icon: <Briefcase className="h-4 w-4" /> },
  { title: "Applications", href: "/admin/applications", icon: <FileText className="h-4 w-4" /> },
]

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      redirect("/login")
    }
  }, [user, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <DashboardShell navItems={navItems} title="Admin Dashboard">
      {children}
    </DashboardShell>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  )
}
