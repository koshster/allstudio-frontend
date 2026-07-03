import { useState } from "react"
import Sidebar from "../components/Sidebar"
import Modal from "../components/Modal"
import Toggle from "../components/Toggle"

// eslint-disable-next-line react-refresh/only-export-components
export const mockClassTypes = [
  { id: 1, name: "Hot Pilates", description: "A heated mat-based pilates class that builds core strength, endurance, and flexibility.", duration: 50, capacity: 20, price: 28, active: true },
  { id: 2, name: "Vinyasa Flow", description: "A dynamic yoga practice linking breath to movement, suitable for all experience levels.", duration: 60, capacity: 24, price: 24, active: true },
  { id: 3, name: "Lagree", description: "A high-intensity, low-impact megaformer workout that builds lean muscle fast.", duration: 45, capacity: 12, price: 32, active: true },
  { id: 4, name: "Barre", description: "A ballet-inspired sculpting class combining isometric holds and small pulses.", duration: 50, capacity: 18, price: 26, active: true },
  { id: 5, name: "Power Cycle", description: "A high-energy indoor cycling class set to music, built for cardio conditioning.", duration: 45, capacity: 22, price: 22, active: true },
  { id: 6, name: "Restorative Yoga", description: "A slow-paced, prop-supported practice focused on deep relaxation and recovery.", duration: 60, capacity: 16, price: 20, active: false },
]

const emptyForm = {
  name: "",
  description: "",
  duration: "",
  capacity: "",
  price: "",
  active: true,
}

const inputClasses =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent"

function Classes() {
  const [classes, setClasses] = useState(mockClassTypes)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const openModal = () => {
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newClass = {
      id: Math.max(...classes.map((c) => c.id)) + 1,
      name: form.name,
      description: form.description,
      duration: Number(form.duration),
      capacity: Number(form.capacity),
      price: Number(form.price),
      active: form.active,
    }
    setClasses([newClass, ...classes])
    closeModal()
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-white p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Classes</h1>
          <button
            onClick={openModal}
            className="bg-[#6C63FF] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#5b52e0] transition-colors"
          >
            Add Class Type
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-semibold text-[#1a1a2e]">{cls.name}</h2>
                <span
                  className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${
                    cls.active
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {cls.active ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-sm text-gray-600">{cls.description}</p>

              <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3 mt-auto">
                <span>{cls.duration} min</span>
                <span>Up to {cls.capacity}</span>
                <span className="font-medium text-[#1a1a2e]">${cls.price}</span>
              </div>
            </div>
          ))}
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} title="Add Class Type">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (min)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  required
                  min="1"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  required
                  min="1"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className={inputClasses}
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <Toggle checked={form.active} onChange={handleChange} name="active" />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>

            <button
              type="submit"
              className="w-full bg-[#6C63FF] text-white rounded-md py-2 text-sm font-medium hover:bg-[#5b52e0] transition-colors"
            >
              Add Class Type
            </button>
          </form>
        </Modal>
      </main>
    </div>
  )
}

export default Classes
