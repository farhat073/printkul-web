"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Users, Shield, Search } from "lucide-react"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  role: string
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setUsers(data)
    setIsLoading(false)
  }

  async function promoteToAdmin(user: User) {
    const { error } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", user.id)

    if (!error) {
      fetchUsers()
      toast.success(`${user.email} is now an admin`)
      setSelectedUser(null)
    }
  }

  async function demoteToCustomer(user: User) {
    const { error } = await supabase
      .from("profiles")
      .update({ role: "customer" })
      .eq("id", user.id)

    if (!error) {
      fetchUsers()
      toast.success(`${user.email} is now a customer`)
      setSelectedUser(null)
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      !searchQuery ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">{users.length} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1a1a2e] rounded-full flex items-center justify-center text-white font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{user.full_name || "User"}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Badge variant={user.role === "admin" ? "default" : "outline"}>
                  {user.role === "admin" ? (
                    <>
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </>
                  ) : (
                    "Customer"
                  )}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Joined {new Date(user.created_at).toLocaleDateString("en-IN")}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUser(user)}
                >
                  Edit Role
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No users found</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Role Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit User Role</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#1a1a2e] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {selectedUser.email?.charAt(0).toUpperCase()}
                </div>
                <p className="font-medium">{selectedUser.email}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.full_name}</p>
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full"
                  variant={selectedUser.role === "admin" ? "default" : "outline"}
                  onClick={() => promoteToAdmin(selectedUser)}
                  disabled={selectedUser.role === "admin"}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Make Admin
                </Button>
                <Button
                  className="w-full"
                  variant={selectedUser.role === "customer" ? "default" : "outline"}
                  onClick={() => demoteToCustomer(selectedUser)}
                  disabled={selectedUser.role === "customer"}
                >
                  Remove Admin
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}