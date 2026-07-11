import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import StatCard from "../components/StatCard"
import ClientRow from "../components/ClientRow"
import Spinner from "../components/Spinner"
import { getAnalyticsSummary, getAtRiskClients, recalculateChurn } from "../services/api"

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
})

function formatDate(value) {
  if (!value) return "—"
  const date = new Date(value)
  if (isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function Dashboard() {
  const [summary, setSummary] = useState({ totalClients: 0, activeThisMonth: 0, atRiskCount: 0 })
  const [atRiskClients, setAtRiskClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [recalculating, setRecalculating] = useState(false)
  const [recalculateError, setRecalculateError] = useState("")

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, atRiskRes] = await Promise.all([getAnalyticsSummary(), getAtRiskClients()])
      setSummary(summaryRes.data ?? {})
      setAtRiskClients(Array.isArray(atRiskRes.data) ? atRiskRes.data : [])
      setError("")
    } catch {
      setError("Could not load dashboard data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const retryFetchDashboard = () => {
    setLoading(true)
    fetchDashboardData()
  }

  useEffect(() => {
    let ignore = false

    async function loadInitialDashboard() {
      try {
        const [summaryRes, atRiskRes] = await Promise.all([getAnalyticsSummary(), getAtRiskClients()])
        if (ignore) return
        setSummary(summaryRes.data ?? {})
        setAtRiskClients(Array.isArray(atRiskRes.data) ? atRiskRes.data : [])
        setError("")
      } catch {
        if (!ignore) setError("Could not load dashboard data. Please try again.")
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadInitialDashboard()
    return () => {
      ignore = true
    }
  }, [])

  const handleRefreshScores = async () => {
    setRecalculating(true)
    setRecalculateError("")
    try {
      await recalculateChurn()
      await fetchDashboardData()
    } catch {
      setRecalculateError("Could not refresh churn scores. Please try again.")
    } finally {
      setRecalculating(false)
    }
  }

  const stats = [
    { title: "Total Clients", value: summary.totalClients ?? 0, subtitle: "All active + inactive", color: "#6C63FF" },
    {
      title: "Active This Month",
      value: summary.activeThisMonth ?? 0,
      subtitle: summary.totalClients
        ? `${Math.round(((summary.activeThisMonth ?? 0) / summary.totalClients) * 100)}% of total clients`
        : "No clients yet",
      color: "#22c55e",
    },
    { title: "At Risk Clients", value: summary.atRiskCount ?? 0, subtitle: "Needs attention", color: "#ef4444" },
    { title: "Monthly Revenue", value: "$4,200", subtitle: "Across all memberships", color: "#6C63FF" },
  ]

  const sortedAtRiskClients = [...atRiskClients]
    .sort((a, b) => b.churnScore - a.churnScore)
    .map((c) => ({
      name: `${c.firstName} ${c.lastName}`,
      email: c.email,
      lastVisit: formatDate(c.lastVisit),
      churnScore: c.churnScore,
    }))

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-white p-8">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Dashboard</h1>
          <span className="text-sm text-gray-400">{today}</span>
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-sm text-red-600 mb-3">{error}</p>
            <button
              onClick={retryFetchDashboard}
              className="text-sm font-medium text-[#6C63FF] hover:text-[#5b52e0]"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>

            <section className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#1a1a2e]">At Risk Clients</h2>
                <button
                  onClick={handleRefreshScores}
                  disabled={recalculating}
                  className="text-xs font-medium text-[#6C63FF] hover:text-[#5b52e0] disabled:opacity-50 disabled:cursor-not-allowed border border-[#6C63FF]/30 hover:bg-[#6C63FF]/5 px-3 py-1.5 rounded-md transition-colors"
                >
                  {recalculating ? "Refreshing…" : "Refresh Scores"}
                </button>
              </div>

              {recalculateError && (
                <div className="mx-5 mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {recalculateError}
                </div>
              )}

              {sortedAtRiskClients.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-400 text-sm">
                  No at-risk clients right now.
                </div>
              ) : (
                sortedAtRiskClients.map((client) => <ClientRow key={client.email} client={client} />)
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard
