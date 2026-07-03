import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import StatCard from "../components/StatCard"
import ClientRow from "../components/ClientRow"
import api from "../services/api"

const mockStats = [
  { title: "Total Clients", value: 47, subtitle: "All active + inactive", color: "#6C63FF" },
  { title: "Active This Month", value: 31, subtitle: "66% of total clients", color: "#22c55e" },
  { title: "At Risk Clients", value: 8, subtitle: "Needs attention", color: "#ef4444" },
  { title: "Monthly Revenue", value: "$4,200", subtitle: "Across all memberships", color: "#6C63FF" },
]

const mockAtRiskClients = [
  { name: "Sarah Mitchell", email: "sarah.mitchell@gmail.com", lastVisit: "3 weeks ago", churnScore: 88 },
  { name: "Derek Chen", email: "derek.chen@outlook.com", lastVisit: "24 days ago", churnScore: 82 },
  { name: "James Okafor", email: "james.okafor@yahoo.com", lastVisit: "18 days ago", churnScore: 76 },
  { name: "Priya Nair", email: "priya.nair@gmail.com", lastVisit: "2 weeks ago", churnScore: 71 },
  { name: "Monica Reyes", email: "monica.reyes@gmail.com", lastVisit: "16 days ago", churnScore: 65 },
]

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
})

function Dashboard() {
  const [stats, setStats] = useState(mockStats)
  const [atRiskClients, setAtRiskClients] = useState(mockAtRiskClients)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      try {
        const response = await api.get("/dashboard")
        if (!cancelled && response.data) {
          if (response.data.stats) setStats(response.data.stats)
          if (response.data.atRiskClients) setAtRiskClients(response.data.atRiskClients)
        }
      } catch {
        if (!cancelled) setError("Showing sample data — could not reach the dashboard API.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDashboard()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-white p-8">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Dashboard</h1>
          <span className="text-sm text-gray-400">{today}</span>
        </div>

        {error && (
          <div className="mb-6 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <section className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#1a1a2e]">At Risk Clients</h2>
            {loading && <span className="text-xs text-gray-400">Refreshing…</span>}
          </div>
          {atRiskClients.map((client) => (
            <ClientRow key={client.email} client={client} />
          ))}
        </section>
      </main>
    </div>
  )
}

export default Dashboard
