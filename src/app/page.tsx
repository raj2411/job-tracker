import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="font-bold text-lg text-gray-900">JobTracker</div>
        <div className="flex items-center gap-4">
          <Link
            href="/api/auth/signin"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Sign in
          </Link>
          <Link
            href="/api/auth/signin"
            className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-24">
        <div className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
          AI-powered job tracking
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 max-w-2xl leading-tight">
          Stop losing track of your job applications
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-xl">
          Track every application in one place. Get AI-generated cover letters,
          interview prep, and follow-up emails — all from your dashboard.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/api/auth/signin"
            className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            Start tracking for free
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            View dashboard →
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-12 mt-16 pt-16 border-t border-gray-100">
          {[
            { value: "100%", label: "Free to use" },
            { value: "AI", label: "Powered features" },
            { value: "1-click", label: "Google sign in" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-100">
        Built with Next.js, Neon, and Claude AI
      </footer>

    </main>
  )
}