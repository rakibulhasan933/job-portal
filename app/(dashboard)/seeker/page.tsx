"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, X, Plus } from "lucide-react"

export default function SeekerProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    skills: user?.skills?.join(", ") || "",
    resumeUrl: user?.resumeUrl || "",
  })
  const [newSkill, setNewSkill] = useState("")

  const handleSave = async () => {
    if (!user?._id) return

    setIsSaving(true)

    const skillsArray = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: skillsArray,
          resumeUrl: formData.resumeUrl,
        }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        updateUser(updatedUser)
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
    }

    setIsSaving(false)
    setIsEditing(false)
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      const currentSkills = formData.skills ? formData.skills.split(",").map((s) => s.trim()) : []
      if (!currentSkills.includes(newSkill.trim())) {
        setFormData({
          ...formData,
          skills: [...currentSkills, newSkill.trim()].join(", "),
        })
      }
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    setFormData({
      ...formData,
      skills: currentSkills.filter((s) => s !== skillToRemove).join(", "),
    })
  }

  const skillsArray = formData.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground">Manage your profile information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your skills and resume</CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <p className="mt-1 font-medium">{user?.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="mt-1 font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" variant="outline" onClick={addSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillsArray.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user?.skills && user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No skills added yet</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumeUrl">Resume URL</Label>
            {isEditing ? (
              <Input
                id="resumeUrl"
                type="url"
                placeholder="https://example.com/my-resume.pdf"
                value={formData.resumeUrl}
                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              />
            ) : (
              <p className="text-muted-foreground">
                {user?.resumeUrl ? (
                  <a
                    href={user.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Resume
                  </a>
                ) : (
                  "No resume added yet"
                )}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
