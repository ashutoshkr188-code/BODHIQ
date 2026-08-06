"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { adminGetUsers, adminUpdateUserRole } from "@/features/dashboard/api";
import { DashboardToast, useToast } from "@/features/dashboard/components/DashboardToast";
import { DashboardSkeleton } from "@/features/dashboard/components/DashboardSkeleton";
import { Search, Shield, User as UserIcon, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";

interface LocalUser {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  role: "user" | "admin";
  created_at: string;
}

export default function UsersPage() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { toast, show: showToast, hide: hideToast } = useToast();

  useEffect(() => {
    loadUsers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function loadUsers(targetPage: number) {
    const token = await getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await adminGetUsers(token, targetPage);
      setUsers(res.items || []);
      setTotalPages(res.total_pages || 1);
    } catch (e) {
      console.error(e);
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }

  async function toggleRole(targetUser: LocalUser) {
    const token = await getToken();
    if (!token) return;
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    setUpdatingId(targetUser.id);
    try {
      await adminUpdateUserRole(token, targetUser.id, newRole);
      showToast(`User role updated to ${newRole}`, "success");
      loadUsers(page);
    } catch (e) {
      console.error(e);
      showToast("Failed to update user role", "error");
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const q = searchQuery.toLowerCase();
    return users.filter((u) => {
      const fullName = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
      return (
        fullName.includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.clerk_id.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery]);

  if (loading && users.length === 0) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 rounded-lg bg-white/[0.04] animate-pulse" />
        <DashboardSkeleton rows={6} cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#d4a853] font-medium mb-2">Accounts</p>
        <h1 className="text-3xl font-serif text-white">Users</h1>
        <p className="text-sm text-gray-500 mt-1">Manage user roles and administrative access</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
        <input
          type="text"
          placeholder="Search users by name, email, or Clerk ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#d4a853]/30 transition"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-white/[0.015] border border-white/[0.04] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.04] bg-white/[0.005]">
              {["User", "Clerk ID", "Role", "Joined Date", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-[9px] uppercase tracking-[0.15em] text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-sm text-gray-500">
                  No users found matching your query
                </td>
              </tr>
            )}
            <AnimatePresence>
              {filteredUsers.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group"
                >
                  {/* User Profile Info */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center">
                        {user.image_url ? (
                          <Image src={user.image_url} alt="" fill className="object-cover" />
                        ) : (
                          <UserIcon size={14} className="text-gray-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {user.first_name || user.last_name
                            ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                            : "Anonymous User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Clerk ID */}
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-600 truncate max-w-[150px]">
                    {user.clerk_id}
                  </td>
                  {/* Role */}
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-medium ${
                      user.role === "admin"
                        ? "bg-[#d4a853]/[0.08] text-[#d4a853]"
                        : "bg-white/[0.04] text-gray-400"
                    }`}>
                      {user.role === "admin" ? (
                        <>
                          <Shield size={10} />
                          Admin
                        </>
                      ) : (
                        <>
                          <UserIcon size={10} />
                          User
                        </>
                      )}
                    </span>
                  </td>
                  {/* Joined Date */}
                  <td className="px-5 py-3.5 text-xs text-gray-400">
                    {new Date(user.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleRole(user)}
                      disabled={updatingId === user.id}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs tracking-wider uppercase font-medium transition-all ${
                        user.role === "admin"
                          ? "border-rose-500/20 bg-rose-500/[0.02] text-rose-400 hover:bg-rose-500/10"
                          : "border-[#d4a853]/20 bg-[#d4a853]/[0.02] text-[#d4a853] hover:bg-[#d4a853]/10"
                      } disabled:opacity-50`}
                    >
                      {updatingId === user.id ? (
                        "Updating..."
                      ) : user.role === "admin" ? (
                        <>
                          <ShieldAlert size={12} />
                          Demote
                        </>
                      ) : (
                        <>
                          <Shield size={12} />
                          Promote
                        </>
                      )}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-white/[0.06] bg-white/[0.01] text-gray-500 hover:text-white hover:bg-white/[0.03] disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-white/[0.06] bg-white/[0.01] text-gray-500 hover:text-white hover:bg-white/[0.03] disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Toast */}
      <DashboardToast {...toast} onClose={hideToast} />
    </div>
  );
}
