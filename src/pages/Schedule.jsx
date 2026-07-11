import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Modal from "../components/Modal"
import Spinner from "../components/Spinner"
import { getClassTypes, getSessions, createSession, deleteSession } from "../services/api"

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const emptyForm = {
  classTypeId: "",
  date: "",
  time: "",
  instructor: "",
  capacityOverride: "",
}

const inputClasses =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent"

function getMonday(date) {
  const result = new Date(date)
  const day = result.getDay()
  const diff = day === 0 ? -6 : 1 - day
  result.setDate(result.getDate() + diff)
  result.setHours(0, 0, 0, 0)
  return result
}

function formatWeekRange(monday) {
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const start = monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const end = sunday.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  return `${start} – ${end}`
}

function parseDateOnly(value) {
  if (!value) return null
  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function isSameDay(value, compareDate) {
  const date = parseDateOnly(value)
  if (!date) return false
  return (
    date.getFullYear() === compareDate.getFullYear() &&
    date.getMonth() === compareDate.getMonth() &&
    date.getDate() === compareDate.getDate()
  )
}

function parseTimeToMinutes(time) {
  if (!time) return 0
  const [hours, minutes] = time.split(":").map(Number)
  return (hours || 0) * 60 + (minutes || 0)
}

function formatTimeDisplay(time) {
  if (!time) return "—"
  const [hours, minutes] = time.split(":").map(Number)
  if (isNaN(hours) || isNaN(minutes)) return time
  const period = hours >= 12 ? "PM" : "AM"
  const displayHour = hours % 12 === 0 ? 12 : hours % 12
  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`
}

function getSessionClassName(session, classTypes) {
  if (session.classType && typeof session.classType === "object") return session.classType.name
  if (session.className) return session.className
  if (session.classTypeName) return session.classTypeName
  if (typeof session.classType === "string") return session.classType
  const matched = classTypes.find((c) => c.id === session.classTypeId)
  return matched?.name ?? "Class"
}

function getFillClasses(enrolled, capacity) {
  const percent = ((enrolled ?? 0) / capacity) * 100
  if (percent > 80) return "bg-red-50 border-red-200"
  if (percent >= 50) return "bg-yellow-50 border-yellow-200"
  return "bg-green-50 border-green-200"
}

function Schedule() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))
  const [classTypes, setClassTypes] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState("")

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState("")

  const fetchScheduleData = async () => {
    try {
      const [classTypesRes, sessionsRes] = await Promise.all([getClassTypes(), getSessions()])
      setClassTypes(Array.isArray(classTypesRes.data) ? classTypesRes.data : [])
      setSessions(Array.isArray(sessionsRes.data) ? sessionsRes.data : [])
      setError("")
    } catch {
      setError("Could not load the schedule. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const retryFetchScheduleData = () => {
    setLoading(true)
    fetchScheduleData()
  }

  useEffect(() => {
    let ignore = false

    async function loadInitialSchedule() {
      try {
        const [classTypesRes, sessionsRes] = await Promise.all([getClassTypes(), getSessions()])
        if (ignore) return
        setClassTypes(Array.isArray(classTypesRes.data) ? classTypesRes.data : [])
        setSessions(Array.isArray(sessionsRes.data) ? sessionsRes.data : [])
        setError("")
      } catch {
        if (!ignore) setError("Could not load the schedule. Please try again.")
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadInitialSchedule()
    return () => {
      ignore = true
    }
  }, [])

  const activeClassTypes = classTypes.filter((c) => c.active)

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    return date
  })

  const goToPreviousWeek = () => {
    setWeekStart((prev) => {
      const next = new Date(prev)
      next.setDate(prev.getDate() - 7)
      return next
    })
  }

  const goToNextWeek = () => {
    setWeekStart((prev) => {
      const next = new Date(prev)
      next.setDate(prev.getDate() + 7)
      return next
    })
  }

  const openModal = () => {
    setForm(emptyForm)
    setFormError("")
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormError("")
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

    const classType = activeClassTypes.find((c) => String(c.id) === form.classTypeId)
    const payload = {
      classTypeId: classType?.id,
      date: form.date,
      time: form.time,
      instructor: form.instructor,
      capacity: form.capacityOverride ? Number(form.capacityOverride) : classType?.capacity ?? 0,
    }

    try {
      await createSession(payload)
      closeModal()
      fetchScheduleData()
    } catch {
      setFormError("Something went wrong creating this session. Please try again.")
    }
  }

  const openDeleteConfirm = (session) => {
    setDeleteError("")
    setDeleteTarget(session)
  }

  const closeDeleteConfirm = () => {
    setDeleteTarget(null)
    setDeleteError("")
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteSession(deleteTarget.id)
      setSessions((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch {
      setDeleteError("Could not delete this session. Please try again.")
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-white p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Schedule</h1>
          <button
            onClick={openModal}
            className="bg-[#6C63FF] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#5b52e0] transition-colors"
          >
            Add Session
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousWeek}
            className="text-sm font-medium text-gray-600 hover:text-[#1a1a2e] px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            &lsaquo; Previous Week
          </button>
          <span className="text-sm font-medium text-gray-500">{formatWeekRange(weekStart)}</span>
          <button
            onClick={goToNextWeek}
            className="text-sm font-medium text-gray-600 hover:text-[#1a1a2e] px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Next Week &rsaquo;
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-sm text-red-600 mb-3">{error}</p>
            <button
              onClick={retryFetchScheduleData}
              className="text-sm font-medium text-[#6C63FF] hover:text-[#5b52e0]"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-3">
            {weekDays.map((date, dayIndex) => {
              const sessionsForDay = sessions
                .filter((s) => isSameDay(s.date, date))
                .sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time))

              return (
                <div key={dayIndex} className="flex flex-col gap-2">
                  <div className="text-center pb-2 border-b border-gray-200">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {dayLabels[dayIndex]}
                    </div>
                    <div className="text-sm font-semibold text-[#1a1a2e]">
                      {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {sessionsForDay.map((session) => (
                      <div
                        key={session.id}
                        className={`relative rounded-md border p-2.5 text-xs ${getFillClasses(session.enrolled, session.capacity)}`}
                      >
                        <button
                          onClick={() => openDeleteConfirm(session)}
                          aria-label="Delete session"
                          className="absolute top-1 right-1.5 text-gray-400 hover:text-red-600 leading-none text-sm"
                        >
                          &times;
                        </button>
                        <div className="font-semibold text-[#1a1a2e] pr-4">
                          {formatTimeDisplay(session.time)}
                        </div>
                        <div className="text-[#1a1a2e] mt-0.5">
                          {getSessionClassName(session, classTypes)}
                        </div>
                        <div className="text-gray-500 mt-0.5">{session.instructor}</div>
                        <div className="font-medium text-[#1a1a2e] mt-1.5">
                          {session.enrolled ?? 0}/{session.capacity}
                        </div>
                      </div>
                    ))}
                    {sessionsForDay.length === 0 && (
                      <div className="text-xs text-gray-300 text-center py-4">No sessions</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={closeModal} title="Add Session">
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Type</label>
              <select
                name="classTypeId"
                value={form.classTypeId}
                onChange={handleChange}
                required
                className={inputClasses}
              >
                <option value="" disabled>
                  Select a class type
                </option>
                {activeClassTypes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Name</label>
              <input
                name="instructor"
                value={form.instructor}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity Override <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                name="capacityOverride"
                value={form.capacityOverride}
                onChange={handleChange}
                min="1"
                placeholder="Defaults to class type capacity"
                className={inputClasses}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6C63FF] text-white rounded-md py-2 text-sm font-medium hover:bg-[#5b52e0] transition-colors"
            >
              Add Session
            </button>
          </form>
        </Modal>

        <Modal isOpen={deleteTarget !== null} onClose={closeDeleteConfirm} title="Delete Session">
          {deleteTarget && (
            <div>
              <p className="text-sm text-gray-600 mb-5">
                Are you sure you want to delete the{" "}
                <span className="font-medium text-[#1a1a2e]">
                  {getSessionClassName(deleteTarget, classTypes)}
                </span>{" "}
                session at{" "}
                <span className="font-medium text-[#1a1a2e]">
                  {formatTimeDisplay(deleteTarget.time)}
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
                  Delete Session
                </button>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  )
}

export default Schedule
