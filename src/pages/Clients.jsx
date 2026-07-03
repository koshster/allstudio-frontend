import { useState } from "react"
import Sidebar from "../components/Sidebar"
import ChurnBadge from "../components/ChurnBadge"
import Modal from "../components/Modal"

const mockClients = [
  { id: 1, firstName: "Sarah", lastName: "Mitchell", email: "sarah.mitchell@gmail.com", phone: "(619) 555-0142", membershipType: "Monthly", lastVisit: "3 weeks ago", classesAttended: 12, churnScore: 88 },
  { id: 2, firstName: "Derek", lastName: "Chen", email: "derek.chen@outlook.com", phone: "(619) 555-0198", membershipType: "Monthly", lastVisit: "24 days ago", classesAttended: 9, churnScore: 82 },
  { id: 3, firstName: "James", lastName: "Okafor", email: "james.okafor@yahoo.com", phone: "(858) 555-0173", membershipType: "Class Pack", lastVisit: "18 days ago", classesAttended: 15, churnScore: 76 },
  { id: 4, firstName: "Priya", lastName: "Nair", email: "priya.nair@gmail.com", phone: "(619) 555-0110", membershipType: "Monthly", lastVisit: "2 weeks ago", classesAttended: 20, churnScore: 71 },
  { id: 5, firstName: "Monica", lastName: "Reyes", email: "monica.reyes@gmail.com", phone: "(858) 555-0165", membershipType: "Class Pack", lastVisit: "16 days ago", classesAttended: 18, churnScore: 65 },
  { id: 6, firstName: "Grace", lastName: "Adeyemi", email: "grace.adeyemi@gmail.com", phone: "(619) 555-0187", membershipType: "Monthly", lastVisit: "1 week ago", classesAttended: 22, churnScore: 55 },
  { id: 7, firstName: "Alex", lastName: "Torres", email: "alex.torres@gmail.com", phone: "(619) 555-0134", membershipType: "Drop-in", lastVisit: "5 days ago", classesAttended: 34, churnScore: 42 },
  { id: 8, firstName: "Nate", lastName: "Sullivan", email: "nate.sullivan@yahoo.com", phone: "(858) 555-0121", membershipType: "Monthly", lastVisit: "4 days ago", classesAttended: 29, churnScore: 35 },
  { id: 9, firstName: "Tom", lastName: "Bradley", email: "tom.bradley@outlook.com", phone: "(619) 555-0156", membershipType: "Class Pack", lastVisit: "3 days ago", classesAttended: 37, churnScore: 22 },
  { id: 10, firstName: "Emily", lastName: "Zhang", email: "emily.zhang@icloud.com", phone: "(858) 555-0143", membershipType: "Monthly", lastVisit: "2 days ago", classesAttended: 41, churnScore: 28 },
  { id: 11, firstName: "Marcus", lastName: "Bell", email: "marcus.bell@gmail.com", phone: "(619) 555-0129", membershipType: "Monthly", lastVisit: "Yesterday", classesAttended: 52, churnScore: 15 },
  { id: 12, firstName: "Lauren", lastName: "Kim", email: "lauren.kim@gmail.com", phone: "(858) 555-0119", membershipType: "Drop-in", lastVisit: "Today", classesAttended: 60, churnScore: 8 },
]

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  membershipType: "Monthly",
}

const inputClasses =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent"

function Clients() {
  const [clients, setClients] = useState(mockClients)
  const [search, setSearch] = useState("")
  const [modalMode, setModalMode] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const filteredClients = clients.filter((client) =>
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(search.toLowerCase())
  )

  const openAddModal = () => {
    setForm(emptyForm)
    setSelectedClient(null)
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
    setModalMode("edit")
  }

  const openViewModal = (client) => {
    setSelectedClient(client)
    setModalMode("view")
  }

  const closeModal = () => {
    setModalMode(null)
    setSelectedClient(null)
  }

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (modalMode === "edit" && selectedClient) {
      setClients(
        clients.map((client) =>
          client.id === selectedClient.id ? { ...client, ...form } : client
        )
      )
    } else {
      const newClient = {
        id: Math.max(...clients.map((c) => c.id)) + 1,
        ...form,
        lastVisit: "Just joined",
        classesAttended: 0,
        churnScore: 10,
      }
      setClients([newClient, ...clients])
    }

    closeModal()
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
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{client.lastVisit}</td>
                  <td className="px-4 py-3 text-gray-600">{client.classesAttended}</td>
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
                      className="text-gray-500 hover:text-gray-700 font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No clients match "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={modalMode === "add" || modalMode === "edit"}
          onClose={closeModal}
          title={modalMode === "edit" ? "Edit Client" : "Add Client"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="text-[#1a1a2e]">{selectedClient.lastVisit}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">Classes Attended</div>
                <div className="text-[#1a1a2e]">{selectedClient.classesAttended}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Churn Risk</div>
                <ChurnBadge score={selectedClient.churnScore} />
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  )
}

export default Clients
