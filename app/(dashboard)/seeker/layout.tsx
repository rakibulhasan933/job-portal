"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { AuthProvider } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard-shell"
import { User, FileText, Briefcase } from "lucide-react"
import { redirect } from "next/navigation"
import { useEffect } from "react"

const navItems = [
  { title: "Profile", href: "/seeker", icon: <User className="h-4 w-4" /> },
  { title: "Applied Jobs", href: "/seeker/applications", icon: <FileText className="h-4 w-4" /> },
  { title: "Browse Jobs", href: "/", icon: <Briefcase className="h-4 w-4" /> },
]

function SeekerLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "seeker")) {
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

  if (!user || user.role !== "seeker") {
    return null
  }

  return (
    <DashboardShell navItems={navItems} title="Job Seeker Dashboard">
      {children}
    </DashboardShell>
  )
}

export default function SeekerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SeekerLayoutContent>{children}</SeekerLayoutContent>
    </AuthProvider>
  )
}
