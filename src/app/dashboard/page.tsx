"use client"

import { useState, useEffect } from "react"
import AddApplicationForm from "@/components/AddApplicationForm"

type Application = {
  id: string
  company: string
  role: string
  status: string
  jobUrl: string | null
  notes: string | null
  appliedAt: string
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [showForm, setShowForm] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    fetchApplications()
    fetchUser()
  }, [])

  async function fetchApplications() {
    const res = await fetch("/api/applications")
    const data = await res.json()
    setApplications(data)
  }

  async function fetchUser() {
    const res = await fetch("/api/auth/session")
    const data = await res.json()
    setUserName(data?.user?.name || "")
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
            <h1 className="text-2xl font-bold text-gray-900">Job Tracker</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, {userName}</p>
          </div>
          <a href="/api/auth/signout" className="text-sm text-gray-500 hover:text-gray-900">
            Sign out
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Applied", value: counts.APPLIED, color: "bg-blue-50 text-blue-700" },
            { label: "Interview", value: counts.INTERVIEW, color: "bg-yellow-50 text-yellow-700" },
            { label: "Offer", value: counts.OFFER, color: "bg-green-50 text-green-700" },
            { label: "Rejected", value: counts.REJECTED, color: "bg-red-50 text-red-700" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Add button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            + Add Application
          </button>
        </div>

        {/* Applications list */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-3">📋</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">No applications yet</h2>
            <p className="text-gray-500 text-sm">Add your first job application to get started</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {applications.map((app) => (
              <div key={app.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{app.company}</div>
                  <div className="text-sm text-gray-500">{app.role}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    app.status === "APPLIED" ? "bg-blue-50 text-blue-700" :
                    app.status === "INTERVIEW" ? "bg-yellow-50 text-yellow-700" :
                    app.status === "OFFER" ? "bg-green-50 text-green-700" :
                    "bg-red-50 text-red-700"
                  }`}>
                    {app.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

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