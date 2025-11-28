"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import type { JobFilters, JobType } from "@/lib/types"

interface JobFiltersProps {
  filters: JobFilters
  onFiltersChange: (filters: JobFilters) => void
  locations: string[]
}

const jobTypes: JobType[] = ["Full-time", "Part-time", "Remote", "Contract"]

export function JobFiltersComponent({ filters, onFiltersChange, locations }: JobFiltersProps) {
  const hasFilters = filters.search || filters.location || filters.jobType

  const clearFilters = () => {
    onFiltersChange({})
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title or company..."
            value={filters.search || ""}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select
            value={filters.location || "all"}
            onValueChange={(value) => onFiltersChange({ ...filters, location: value === "all" ? undefined : value })}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.jobType || "all"}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, jobType: value === "all" ? undefined : (value as JobType) })
            }
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {jobTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {hasFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 gap-1 text-xs">
            <X className="h-3 w-3" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
