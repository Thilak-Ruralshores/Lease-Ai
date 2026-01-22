"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, CheckCircle2, XCircle, Shield, 
  User as UserIcon, MoreVertical, Search,
  Filter, Check, X, ShieldAlert, BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
import { useAuthGuard } from "@/hooks/use-auth-guard";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: "ORG_ADMIN" | "USER";
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  createdAt: string;
}

export default function AdminPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  useAuthGuard();
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "ORG_ADMIN") {
      fetchUsers();
    }
  }, [currentUser]);

  const updateUser = async (userId: string, updates: Partial<User>) => {
    setIsProcessing(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...updates }),
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u));
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (currentUser?.role !== "ORG_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">User Management</h1>
          <p className="text-muted-foreground">Manage members and their roles in {currentUser.organization}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Total Users" 
            value={users.length} 
            icon={<Users className="w-5 h-5 text-blue-500" />} 
          />
          <StatCard 
            title="Pending Approval" 
            value={users.filter(u => u.status === "PENDING").length} 
            icon={<Clock className="w-5 h-5 text-amber-500" />} 
          />
          <StatCard 
            title="Active Admins" 
            value={users.filter(u => u.role === "ORG_ADMIN").length} 
            icon={<Shield className="w-5 h-5 text-indigo-500" />} 
          />
        </div>

        {/* Users Table */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-sm font-semibold">User</th>
                  <th className="px-6 py-4 text-sm font-semibold">Role</th>
                  <th className="px-6 py-4 text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold">Joined</th>
                  <th className="px-6 py-4 text-sm font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    [1, 2, 3].map((i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-10 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                        <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                        <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                        <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                        <td className="px-6 py-4"><div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded ml-auto"></div></td>
                      </tr>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        No users found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <motion.tr 
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center text-primary border border-primary/10">
                              <UserIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-medium">{user.name || "Unknown User"}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            {user.role === "ORG_ADMIN" ? (
                              <Shield className="w-3.5 h-3.5 text-indigo-500" />
                            ) : (
                              <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <span className={user.role === "ORG_ADMIN" ? "font-medium text-indigo-600 dark:text-indigo-400" : ""}>
                              {user.role === "ORG_ADMIN" ? "Admin" : "User"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-border">
                              <Button 
                                size="sm" 
                                variant={user.status === "APPROVED" ? "default" : "ghost"}
                                className={`h-7 px-3 text-xs gap-1.5 transition-all ${
                                  user.status === "APPROVED" 
                                    ? "bg-green-600 hover:bg-green-700 text-white shadow-sm" 
                                    : "text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                }`}
                                onClick={() => user.status !== "APPROVED" && updateUser(user.id, { status: "APPROVED" })}
                                disabled={isProcessing === user.id}
                              >
                                <Check className="w-3 h-3" /> Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant={user.status === "REJECTED" ? "default" : "ghost"}
                                className={`h-7 px-3 text-xs gap-1.5 transition-all ${
                                  user.status === "REJECTED" 
                                    ? "bg-red-600 hover:bg-red-700 text-white shadow-sm" 
                                    : "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                }`}
                                onClick={() => user.status !== "REJECTED" && updateUser(user.id, { status: "REJECTED" })}
                                disabled={isProcessing === user.id}
                              >
                                <X className="w-3 h-3" /> Reject
                              </Button>
                            </div>

                            <div className="flex items-center gap-1 border-l border-border pl-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                title="Toggle Role"
                                onClick={() => updateUser(user.id, { role: user.role === "ORG_ADMIN" ? "USER" : "ORG_ADMIN" })}
                                disabled={isProcessing === user.id}
                              >
                                <Shield className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className={`h-8 w-8 p-0 ${user.status === "SUSPENDED" ? "text-amber-500" : "text-muted-foreground hover:text-amber-500"}`}
                                title={user.status === "SUSPENDED" ? "Unsuspend User" : "Suspend User"}
                                onClick={() => updateUser(user.id, { status: user.status === "SUSPENDED" ? "APPROVED" : "SUSPENDED" })}
                                disabled={isProcessing === user.id}
                              >
                                <ShieldAlert className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-border flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}

function Clock(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
  }

function StatusBadge({ status }: { status: User["status"] }) {
  const configs = {
    PENDING: { label: "Pending", color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-500 dark:border-amber-800" },
    APPROVED: { label: "Active", color: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-500 dark:border-green-800" },
    REJECTED: { label: "Rejected", color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-500 dark:border-red-800" },
    SUSPENDED: { label: "Suspended", color: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-500 dark:border-slate-800" },
  };

  const config = configs[status];

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
}
