"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Header } from "./header"
import type { ReactNode } from "react"

interface NavItem {
  title: string
  href: string
  icon: ReactNode
}

interface DashboardShellProps {
  children: ReactNode
  navItems: NavItem[]
  title: string
}

export function DashboardShell({ children, navItems, title }: DashboardShellProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-2">
              <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
              <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
