import type React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { Header } from "@/components/header"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        {children}
      </div>
    </AuthProvider>
  )
}
