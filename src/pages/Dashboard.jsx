import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import StatCard from "../components/StatCard"
import ClientRow from "../components/ClientRow"
import Spinner from "../components/Spinner"
import { getClients } from "../services/api"

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

function isWithinLast30Days(value) {
  if (!value) return false
  const date = new Date(value)
  if (isNaN(date.getTime())) return false
  const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays <= 30
}

function Dashboard() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchClients = async () => {
    try {
      const response = await getClients()
      setClients(Array.isArray(response.data) ? response.data : [])
      setError("")
    } catch {
      setError("Could not load dashboard data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const retryFetchClients = () => {
    setLoading(true)
    fetchClients()
  }

  useEffect(() => {
    let ignore = false

    async function loadInitialClients() {
      try {
        const response = await getClients()
        if (ignore) return
        setClients(Array.isArray(response.data) ? response.data : [])
        setError("")
      } catch {
        if (!ignore) setError("Could not load dashboard data. Please try again.")
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadInitialClients()
    return () => {
      ignore = true
    }
  }, [])

  const totalClients = clients.length
  const activeThisMonth = clients.filter((c) => isWithinLast30Days(c.lastVisit)).length
  const atRiskCount = clients.filter((c) => c.churnScore > 70).length

  const stats = [
    { title: "Total Clients", value: totalClients, subtitle: "All active + inactive", color: "#6C63FF" },
    {
      title: "Active This Month",
      value: activeThisMonth,
      subtitle: totalClients ? `${Math.round((activeThisMonth / totalClients) * 100)}% of total clients` : "No clients yet",
      color: "#22c55e",
    },
    { title: "At Risk Clients", value: atRiskCount, subtitle: "Needs attention", color: "#ef4444" },
    { title: "Monthly Revenue", value: "$4,200", subtitle: "Across all memberships", color: "#6C63FF" },
  ]

  const atRiskClients = clients
    .filter((c) => c.churnScore > 70)
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
              onClick={retryFetchClients}
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
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-[#1a1a2e]">At Risk Clients</h2>
              </div>
              {atRiskClients.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-400 text-sm">
                  No at-risk clients right now.
                </div>
              ) : (
                atRiskClients.map((client) => <ClientRow key={client.email} client={client} />)
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard
