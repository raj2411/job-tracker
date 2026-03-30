"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddApplicationForm({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    const body = {
      company: formData.get("company"),
      role: formData.get("role"),
      jobUrl: formData.get("jobUrl"),
      notes: formData.get("notes"),
      salaryExpected: formData.get("salaryExpected"),
      resumeUrl: formData.get("resumeUrl"),
      coverLetterUrl: formData.get("coverLetterUrl"),
    }

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Something went wrong")
      setLoading(false)
      return
    }

    router.refresh()
    onClose()
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Add Application</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Required */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Company *</label>
              <input name="company" required className={inputClass} placeholder="e.g. Google" />
            </div>
            <div>
              <label className={labelClass}>Role *</label>
              <input name="role" required className={inputClass} placeholder="e.g. Software Engineer" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Job URL</label>
            <input name="jobUrl" type="url" className={inputClass} placeholder="https://..." />
          </div>

          {/* Salary */}
          <div>
            <label className={labelClass}>Expected Salary</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input name="salaryExpected" type="number" className={`${inputClass} pl-7`} placeholder="95000" />
            </div>
          </div>

          {/* Documents */}
          <div>
            <label className={labelClass}>Resume Link</label>
            <input name="resumeUrl" type="url" className={inputClass} placeholder="https://drive.google.com/..." />
          </div>

          <div>
            <label className={labelClass}>Cover Letter Link</label>
            <input name="coverLetterUrl" type="url" className={inputClass} placeholder="https://docs.google.com/..." />
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              name="notes"
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Any notes about this role..."
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 text-sm py-2 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-black text-white text-sm py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50">
              {loading ? "Saving..." : "Save Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}