"use client"

import { useState } from "react"
import useSWR from "swr"
import { JobCard } from "@/components/job-card"
import { JobFiltersComponent } from "@/components/job-filters"
import type { JobFilters } from "@/lib/types"
import { Briefcase, TrendingUp, Users, Building2, Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function HomePage() {
  const [filters, setFilters] = useState<JobFilters>({})

  // Build query string from filters
  const queryParams = new URLSearchParams()
  if (filters.location) queryParams.set("location", filters.location)
  if (filters.jobType) queryParams.set("jobType", filters.jobType)
  if (filters.search) queryParams.set("search", filters.search)

  const { data: jobs, isLoading: jobsLoading } = useSWR(`/api/jobs?${queryParams.toString()}`, fetcher)

  const { data: locations } = useSWR("/api/jobs/locations", fetcher)

  return (
    <main>
      {/* Hero Section */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Find Your Dream Career Today
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">
              Connect with top employers and discover opportunities that match your skills and aspirations.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Briefcase, label: "Active Jobs", value: jobs?.length || "0" },
              { icon: Building2, label: "Companies", value: "500+" },
              { icon: Users, label: "Job Seekers", value: "10K+" },
              { icon: TrendingUp, label: "Placements", value: "1,200+" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-background p-4 text-center">
                <stat.icon className="mx-auto h-6 w-6 text-primary" />
                <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Latest Opportunities</h2>
            <p className="mt-1 text-muted-foreground">
              {jobsLoading ? "Loading..." : `${jobs?.length || 0} jobs available`}
            </p>
          </div>

          <JobFiltersComponent filters={filters} onFiltersChange={setFilters} locations={locations || []} />

          {jobsLoading ? (
            <div className="mt-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs?.map(
                (job: {
                  _id: string
                  title: string
                  company: string
                  location: string
                  jobType: string
                  salaryRange: string
                  description: string
                  createdAt: string
                }) => (
                  <JobCard key={job._id} job={{ ...job, id: job._id }} />
                ),
              )}
            </div>
          )}

          {!jobsLoading && (!jobs || jobs.length === 0) && (
            <div className="mt-12 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No jobs found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
