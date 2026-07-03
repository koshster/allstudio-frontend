import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import ChurnBadge from "../components/ChurnBadge"
import Modal from "../components/Modal"
import Spinner from "../components/Spinner"
import { getClients, createClient, updateClient, deleteClient } from "../services/api"

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  membershipType: "Monthly",
}

const inputClasses =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent"

function formatDate(value) {
  if (!value) return "—"
  const date = new Date(value)
  if (isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [modalMode, setModalMode] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState("")

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState("")

  const fetchClients = async () => {
    try {
      const response = await getClients()
      setClients(Array.isArray(response.data) ? response.data : [])
      setError("")
    } catch {
      setError("Could not load clients. Please try again.")
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
        if (!ignore) setError("Could not load clients. Please try again.")
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadInitialClients()
    return () => {
      ignore = true
    }
  }, [])

  const filteredClients = clients.filter((client) =>
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(search.toLowerCase())
  )

  const openAddModal = () => {
    setForm(emptyForm)
    setSelectedClient(null)
    setFormError("")
    setModalMode("add")
  }

  const openEditModal = (client) => {
    setForm({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      membershipType: client.membershipType,
    })
    setSelectedClient(client)
    setFormError("")
    setModalMode("edit")
  }

  const openViewModal = (client) => {
    setSelectedClient(client)
    setModalMode("view")
  }

  const closeModal = () => {
    setModalMode(null)
    setSelectedClient(null)
    setFormError("")
  }

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    try {
      if (modalMode === "edit" && selectedClient) {
        await updateClient(selectedClient.id, form)
      } else {
        await createClient(form)
      }
      closeModal()
      fetchClients()
    } catch {
      setFormError("Something went wrong saving this client. Please try again.")
    }
  }

  const openDeleteConfirm = (client) => {
    setDeleteError("")
    setDeleteTarget(client)
  }

  const closeDeleteConfirm = () => {
    setDeleteTarget(null)
    setDeleteError("")
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteClient(deleteTarget.id)
      setClients((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch {
      setDeleteError("Could not delete this client. Please try again.")
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-white p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Clients</h1>
          <button
            onClick={openAddModal}
            className="bg-[#6C63FF] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#5b52e0] transition-colors"
          >
            Add Client
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients by name..."
            className={`max-w-xs ${inputClasses}`}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
          {loading ? (
            <Spinner />
          ) : error ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-red-600 mb-3">{error}</p>
              <button
                onClick={retryFetchClients}
                className="text-sm font-medium text-[#6C63FF] hover:text-[#5b52e0]"
              >
                Try again
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Last Visit</th>
                  <th className="px-4 py-3">Classes Attended</th>
                  <th className="px-4 py-3">Churn Score</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#1a1a2e] whitespace-nowrap">
                      {client.firstName} {client.lastName}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{client.email}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {formatDate(client.lastVisit)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{client.classesAttended ?? 0}</td>
                    <td className="px-4 py-3">
                      <ChurnBadge score={client.churnScore} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(client)}
                        className="text-[#6C63FF] hover:text-[#5b52e0] font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openViewModal(client)}
                        className="text-gray-500 hover:text-gray-700 font-medium mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(client)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      {clients.length === 0 ? "No clients yet." : `No clients match "${search}"`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <Modal
          isOpen={modalMode === "add" || modalMode === "edit"}
          onClose={closeModal}
          title={modalMode === "edit" ? "Edit Client" : "Add Client"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleFormChange}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleFormChange}
                  required
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleFormChange}
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleFormChange}
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
              <select
                name="membershipType"
                value={form.membershipType}
                onChange={handleFormChange}
                className={inputClasses}
              >
                <option value="Monthly">Monthly</option>
                <option value="Class Pack">Class Pack</option>
                <option value="Drop-in">Drop-in</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#6C63FF] text-white rounded-md py-2 text-sm font-medium hover:bg-[#5b52e0] transition-colors"
            >
              {modalMode === "edit" ? "Save Changes" : "Add Client"}
            </button>
          </form>
        </Modal>

        <Modal isOpen={modalMode === "view"} onClose={closeModal} title="Client Details">
          {selectedClient && (
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">Name</div>
                <div className="text-[#1a1a2e] font-medium">
                  {selectedClient.firstName} {selectedClient.lastName}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">Email</div>
                <div className="text-[#1a1a2e]">{selectedClient.email}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">Phone</div>
                <div className="text-[#1a1a2e]">{selectedClient.phone}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">Membership</div>
                <div className="text-[#1a1a2e]">{selectedClient.membershipType}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">Last Visit</div>
                <div className="text-[#1a1a2e]">{formatDate(selectedClient.lastVisit)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">Classes Attended</div>
                <div className="text-[#1a1a2e]">{selectedClient.classesAttended ?? 0}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Churn Risk</div>
                <ChurnBadge score={selectedClient.churnScore} />
              </div>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={deleteTarget !== null}
          onClose={closeDeleteConfirm}
          title="Delete Client"
        >
          {deleteTarget && (
            <div>
              <p className="text-sm text-gray-600 mb-5">
                Are you sure you want to delete{" "}
                <span className="font-medium text-[#1a1a2e]">
                  {deleteTarget.firstName} {deleteTarget.lastName}
                </span>
                ? This action cannot be undone.
              </p>

              {deleteError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
                  {deleteError}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeDeleteConfirm}
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Client
                </button>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  )
}

export default Clients
