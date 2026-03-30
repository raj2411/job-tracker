"use client"

import { useState, useEffect, useMemo } from "react"
import AddApplicationForm from "@/components/AddApplicationForm"
// We'll create this in the next step
import KanbanBoard from "@/components/KanbanBoard"
import {
  Search,
  Filter,
  LayoutList,
  LayoutGrid,
  Plus,
  LogOut,
  Briefcase
} from "lucide-react"

type Application = {
  id: string
  company: string
  role: string
  status: "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED"
  jobUrl: string | null
  notes: string | null
  appliedAt: string
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [showForm, setShowForm] = useState(false)
  const [userName, setUserName] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "board">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    fetchApplications()
    fetchUser()
  }, [])

  async function fetchApplications() {
    const res = await fetch("/api/applications")
    if (!res.ok) return
    const data = await res.json()
    if (Array.isArray(data)) {
      setApplications(data)
    }
  }

  async function fetchUser() {
    const res = await fetch("/api/auth/session")
    const data = await res.json()
    setUserName(data?.user?.name || "")
  }

  // Derived filtered data
  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchSearch = app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.role.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = statusFilter === "ALL" || app.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [applications, searchQuery, statusFilter])

  async function updateStatus(id: string, newStatus: string) {
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      fetchApplications()
    }
  }

  async function deleteApp(id: string) {
    if (!confirm("Are you sure you want to delete this application?")) return
    const res = await fetch(`/api/applications/${id}`, {
      method: "DELETE",
    })
    if (res.ok) {
      fetchApplications()
    }
  }

  const counts = {
    APPLIED: applications.filter(a => a.status === "APPLIED").length,
    INTERVIEW: applications.filter(a => a.status === "INTERVIEW").length,
    OFFER: applications.filter(a => a.status === "OFFER").length,
    REJECTED: applications.filter(a => a.status === "REJECTED").length,
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-black text-white p-1.5 rounded-lg">
                <Briefcase size={20} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Job Tracker</h1>
            </div>
            <p className="text-gray-500 text-sm">
              Welcome back, {userName}
            </p>
          </div>
          <a href="/api/auth/signout" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <LogOut size={16} />
            Sign out
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: "Applied", value: counts.APPLIED, color: "bg-blue-50 text-blue-700", icon: "📋" },
            { label: "Interview", value: counts.INTERVIEW, color: "bg-yellow-50 text-yellow-700", icon: "✨" },
            { label: "Offer", value: counts.OFFER, color: "bg-green-50 text-green-700", icon: "🎉" },
            { label: "Rejected", value: counts.REJECTED, color: "bg-red-50 text-red-700", icon: "❌" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl p-5 border border-white ${stat.color} shadow-sm backdrop-blur-sm`}>
              <div className="flex justify-between items-start mb-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xl">{stat.icon}</div>
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search company or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black appearance-none cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"}`}
                title="List View"
              >
                <LayoutList size={18} />
              </button>
              <button
                onClick={() => setViewMode("board")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "board" ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"}`}
                title="Board View"
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            {/* Add button */}
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-black text-white text-sm px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all shadow-md active:scale-95"
            >
              <Plus size={18} />
              Add Job
            </button>
          </div>
        </div>

        {/* View Content */}
        {viewMode === "board" ? (
          <KanbanBoard
            applications={filteredApps}
            updateStatus={updateStatus}
            deleteApp={deleteApp}
          />
        ) : (
          /* Applications list */
          filteredApps.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="text-4xl mb-3">📋</div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">No applications yet</h2>
              <p className="text-gray-500 text-sm">Add your first job application to get started</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {filteredApps.map((app) => (
                <div key={app.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{app.company}</div>
                    <div className="text-sm text-gray-500">{app.role}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full cursor-pointer outline-none appearance-none border-none text-center ${app.status === "APPLIED" ? "bg-blue-50 text-blue-700" :
                          app.status === "INTERVIEW" ? "bg-yellow-50 text-yellow-700" :
                            app.status === "OFFER" ? "bg-green-50 text-green-700" :
                              "bg-red-50 text-red-700"
                        }`}
                    >
                      <option value="APPLIED">APPLIED</option>
                      <option value="INTERVIEW">INTERVIEW</option>
                      <option value="OFFER">OFFER</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                    <span className="text-xs text-gray-400 w-20 text-right">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => deleteApp(app.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}

      </div>

      {/* Form modal */}
      {showForm && (
        <AddApplicationForm onClose={() => {
          setShowForm(false)
          fetchApplications()
        }} />
      )}
    </main>
  )
}