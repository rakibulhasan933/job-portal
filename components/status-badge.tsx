import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle, Shield } from "lucide-react"
import type { EmployerStatus, Application } from "@/lib/types"

interface StatusBadgeProps {
  status: EmployerStatus | Application["status"]
  type?: "employer" | "application"
}

export function StatusBadge({ status, type = "employer" }: StatusBadgeProps) {
  if (type === "employer") {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-success text-success-foreground gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  // Application status
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      )
    case "reviewed":
      return (
        <Badge className="bg-primary/20 text-primary gap-1">
          <Shield className="h-3 w-3" />
          Reviewed
        </Badge>
      )
    case "accepted":
      return (
        <Badge className="bg-success text-success-foreground gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Accepted
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>
      )
    default:
      return null
  }
}
