import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Tracker</h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back, {session.user?.name}
            </p>
          </div>
          <a href="/api/auth/signout" className="text-sm text-gray-500 hover:text-gray-900">
            Sign out
          </a>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Applied", value: 0, color: "bg-blue-50 text-blue-700" },
            { label: "Interview", value: 0, color: "bg-yellow-50 text-yellow-700" },
            { label: "Offer", value: 0, color: "bg-green-50 text-green-700" },
            { label: "Rejected", value: 0, color: "bg-red-50 text-red-700" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            No applications yet
          </h2>
          <p className="text-gray-500 text-sm">
            Add your first job application to get started
          </p>
          <button className="mt-4 bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800">
            Add Application
          </button>
        </div>
      </div>
    </main>
  )
}