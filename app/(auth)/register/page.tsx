"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Briefcase, AlertCircle, Loader2, User, Building2 } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"seeker" | "employer">("seeker")
  const [company, setCompany] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await register({
      name,
      email,
      password,
      role,
      company: role === "employer" ? company : undefined,
    })

    if (result.success) {
      router.push(role === "employer" ? "/employer" : "/seeker")
    } else {
      setError(result.error || "Registration failed")
    }
    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold">JobConnect</span>
        </Link>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Get started with JobConnect</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-3">
              <Label>I want to</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as "seeker" | "employer")}
                className="grid grid-cols-2 gap-3"
              >
                <Label
                  htmlFor="seeker"
                  className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    role === "seeker" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="seeker" id="seeker" className="sr-only" />
                  <User className={`h-6 w-6 ${role === "seeker" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">Find a Job</span>
                </Label>
                <Label
                  htmlFor="employer"
                  className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    role === "employer" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="employer" id="employer" className="sr-only" />
                  <Building2 className={`h-6 w-6 ${role === "employer" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">Hire Talent</span>
                </Label>
              </RadioGroup>
            </div>

            {role === "employer" && (
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Note: Employer accounts require admin approval before posting jobs.
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
