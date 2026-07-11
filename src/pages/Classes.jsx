import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Modal from "../components/Modal"
import Toggle from "../components/Toggle"
import Spinner from "../components/Spinner"
import { getClassTypes, createClassType, updateClassType, deleteClassType } from "../services/api"

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
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [modalMode, setModalMode] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState("")

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState("")

  const fetchClassTypes = async () => {
    try {
      const response = await getClassTypes()
      setClasses(Array.isArray(response.data) ? response.data : [])
      setError("")
    } catch {
      setError("Could not load class types. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const retryFetchClassTypes = () => {
    setLoading(true)
    fetchClassTypes()
  }

  useEffect(() => {
    let ignore = false

    async function loadInitialClassTypes() {
      try {
        const response = await getClassTypes()
        if (ignore) return
        setClasses(Array.isArray(response.data) ? response.data : [])
        setError("")
      } catch {
        if (!ignore) setError("Could not load class types. Please try again.")
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadInitialClassTypes()
    return () => {
      ignore = true
    }
  }, [])

  const openAddModal = () => {
    setForm(emptyForm)
    setSelectedClass(null)
    setFormError("")
    setModalMode("add")
  }

  const openEditModal = (cls) => {
    setForm({
      name: cls.name,
      description: cls.description,
      duration: cls.duration,
      capacity: cls.capacity,
      price: cls.price,
      active: cls.active,
    })
    setSelectedClass(cls)
    setFormError("")
    setModalMode("edit")
  }

  const closeModal = () => {
    setModalMode(null)
    setSelectedClass(null)
    setFormError("")
  }

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    const payload = {
      name: form.name,
      description: form.description,
      duration: Number(form.duration),
      capacity: Number(form.capacity),
      price: Number(form.price),
      active: form.active,
    }
    try {
      if (modalMode === "edit" && selectedClass) {
        await updateClassType(selectedClass.id, payload)
      } else {
        await createClassType(payload)
      }
      closeModal()
      fetchClassTypes()
    } catch {
      setFormError("Something went wrong saving this class type. Please try again.")
    }
  }

  const openDeleteConfirm = (cls) => {
    setDeleteError("")
    setDeleteTarget(cls)
  }

  const closeDeleteConfirm = () => {
    setDeleteTarget(null)
    setDeleteError("")
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteClassType(deleteTarget.id)
      setClasses((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch {
      setDeleteError("Could not delete this class type. Please try again.")
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-white p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Classes</h1>
          <button
            onClick={openAddModal}
            className="bg-[#6C63FF] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#5b52e0] transition-colors"
          >
            Add Class Type
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-sm text-red-600 mb-3">{error}</p>
            <button
              onClick={retryFetchClassTypes}
              className="text-sm font-medium text-[#6C63FF] hover:text-[#5b52e0]"
            >
              Try again
            </button>
          </div>
        ) : (
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

                <div className="flex items-center gap-4 text-xs font-medium">
                  <button
                    onClick={() => openEditModal(cls)}
                    className="text-[#6C63FF] hover:text-[#5b52e0]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(cls)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {classes.length === 0 && (
              <p className="text-sm text-gray-400 col-span-3 text-center py-8">
                No class types yet.
              </p>
            )}
          </div>
        )}

        <Modal
          isOpen={modalMode === "add" || modalMode === "edit"}
          onClose={closeModal}
          title={modalMode === "edit" ? "Edit Class Type" : "Add Class Type"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {formError}
              </div>
            )}

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
              {modalMode === "edit" ? "Save Changes" : "Add Class Type"}
            </button>
          </form>
        </Modal>

        <Modal
          isOpen={deleteTarget !== null}
          onClose={closeDeleteConfirm}
          title="Delete Class Type"
        >
          {deleteTarget && (
            <div>
              <p className="text-sm text-gray-600 mb-5">
                Are you sure you want to delete{" "}
                <span className="font-medium text-[#1a1a2e]">{deleteTarget.name}</span>? This
                action cannot be undone.
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
                  Delete Class Type
                </button>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  )
}

export default Classes
