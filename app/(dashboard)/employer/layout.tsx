"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { AuthProvider } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard-shell"
import { Briefcase, Users, Plus } from "lucide-react"
import { redirect } from "next/navigation"
import { useEffect } from "react"

const navItems = [
  { title: "My Jobs", href: "/employer", icon: <Briefcase className="h-4 w-4" /> },
  { title: "Post Job", href: "/employer/post", icon: <Plus className="h-4 w-4" /> },
  { title: "Applicants", href: "/employer/applicants", icon: <Users className="h-4 w-4" /> },
]

function EmployerLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "employer")) {
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

  if (!user || user.role !== "employer") {
    return null
  }

  return (
    <DashboardShell navItems={navItems} title="Employer Dashboard">
      {children}
    </DashboardShell>
  )
}

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <EmployerLayoutContent>{children}</EmployerLayoutContent>
    </AuthProvider>
  )
}
