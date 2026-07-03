import { useState } from "react"
import Sidebar from "../components/Sidebar"
import Modal from "../components/Modal"
import { mockClassTypes } from "./Classes"

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const mockSessions = [
  { id: 1, dayIndex: 0, time: "6:00 AM", sortTime: 360, classType: "Vinyasa Flow", instructor: "Maya Lin", enrolled: 9, capacity: 24 },
  { id: 2, dayIndex: 0, time: "9:00 AM", sortTime: 540, classType: "Hot Pilates", instructor: "Jordan Cruz", enrolled: 18, capacity: 20 },
  { id: 3, dayIndex: 0, time: "5:30 PM", sortTime: 1050, classType: "Lagree", instructor: "Ava Brooks", enrolled: 9, capacity: 12 },

  { id: 4, dayIndex: 1, time: "7:00 AM", sortTime: 420, classType: "Power Cycle", instructor: "Diego Ramirez", enrolled: 7, capacity: 22 },
  { id: 5, dayIndex: 1, time: "12:00 PM", sortTime: 720, classType: "Barre", instructor: "Kayla Simmons", enrolled: 15, capacity: 18 },
  { id: 6, dayIndex: 1, time: "6:00 PM", sortTime: 1080, classType: "Vinyasa Flow", instructor: "Maya Lin", enrolled: 12, capacity: 24 },

  { id: 7, dayIndex: 2, time: "6:00 AM", sortTime: 360, classType: "Hot Pilates", instructor: "Jordan Cruz", enrolled: 6, capacity: 20 },
  { id: 8, dayIndex: 2, time: "9:00 AM", sortTime: 540, classType: "Lagree", instructor: "Ava Brooks", enrolled: 10, capacity: 12 },
  { id: 9, dayIndex: 2, time: "5:30 PM", sortTime: 1050, classType: "Barre", instructor: "Kayla Simmons", enrolled: 9, capacity: 18 },

  { id: 10, dayIndex: 3, time: "7:00 AM", sortTime: 420, classType: "Power Cycle", instructor: "Diego Ramirez", enrolled: 14, capacity: 22 },
  { id: 11, dayIndex: 3, time: "9:00 AM", sortTime: 540, classType: "Vinyasa Flow", instructor: "Maya Lin", enrolled: 5, capacity: 24 },
  { id: 12, dayIndex: 3, time: "6:00 PM", sortTime: 1080, classType: "Hot Pilates", instructor: "Jordan Cruz", enrolled: 19, capacity: 20 },

  { id: 13, dayIndex: 4, time: "6:00 AM", sortTime: 360, classType: "Lagree", instructor: "Ava Brooks", enrolled: 4, capacity: 12 },
  { id: 14, dayIndex: 4, time: "9:00 AM", sortTime: 540, classType: "Barre", instructor: "Kayla Simmons", enrolled: 11, capacity: 18 },
  { id: 15, dayIndex: 4, time: "5:30 PM", sortTime: 1050, classType: "Power Cycle", instructor: "Diego Ramirez", enrolled: 20, capacity: 22 },

  { id: 16, dayIndex: 5, time: "8:00 AM", sortTime: 480, classType: "Vinyasa Flow", instructor: "Maya Lin", enrolled: 20, capacity: 24 },
  { id: 17, dayIndex: 5, time: "9:30 AM", sortTime: 570, classType: "Hot Pilates", instructor: "Jordan Cruz", enrolled: 10, capacity: 20 },
  { id: 18, dayIndex: 5, time: "11:00 AM", sortTime: 660, classType: "Lagree", instructor: "Ava Brooks", enrolled: 3, capacity: 12 },

  { id: 19, dayIndex: 6, time: "9:00 AM", sortTime: 540, classType: "Barre", instructor: "Kayla Simmons", enrolled: 6, capacity: 18 },
  { id: 20, dayIndex: 6, time: "10:30 AM", sortTime: 630, classType: "Power Cycle", instructor: "Diego Ramirez", enrolled: 11, capacity: 22 },
]

const emptyForm = {
  classType: "",
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

function formatTime(hours, minutes) {
  const period = hours >= 12 ? "PM" : "AM"
  const displayHour = hours % 12 === 0 ? 12 : hours % 12
  const displayMinute = String(minutes).padStart(2, "0")
  return `${displayHour}:${displayMinute} ${period}`
}

function getFillClasses(enrolled, capacity) {
  const percent = (enrolled / capacity) * 100
  if (percent > 80) return "bg-red-50 border-red-200"
  if (percent >= 50) return "bg-yellow-50 border-yellow-200"
  return "bg-green-50 border-green-200"
}

function Schedule() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))
  const [sessions, setSessions] = useState(mockSessions)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const activeClassTypes = mockClassTypes.filter((c) => c.active)

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
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const classType = activeClassTypes.find((c) => c.name === form.classType)
    const dateObj = new Date(`${form.date}T00:00:00`)
    const dayIndex = (dateObj.getDay() + 6) % 7
    const [hours, minutes] = form.time.split(":").map(Number)

    const newSession = {
      id: Math.max(...sessions.map((s) => s.id), 0) + 1,
      dayIndex,
      time: formatTime(hours, minutes),
      sortTime: hours * 60 + minutes,
      classType: form.classType,
      instructor: form.instructor,
      enrolled: 0,
      capacity: form.capacityOverride ? Number(form.capacityOverride) : classType?.capacity ?? 0,
    }

    setSessions([...sessions, newSession])
    closeModal()
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

        <div className="grid grid-cols-7 gap-3">
          {weekDays.map((date, dayIndex) => {
            const sessionsForDay = sessions
              .filter((s) => s.dayIndex === dayIndex)
              .sort((a, b) => a.sortTime - b.sortTime)

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
                      className={`rounded-md border p-2.5 text-xs ${getFillClasses(session.enrolled, session.capacity)}`}
                    >
                      <div className="font-semibold text-[#1a1a2e]">{session.time}</div>
                      <div className="text-[#1a1a2e] mt-0.5">{session.classType}</div>
                      <div className="text-gray-500 mt-0.5">{session.instructor}</div>
                      <div className="font-medium text-[#1a1a2e] mt-1.5">
                        {session.enrolled}/{session.capacity}
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

        <Modal isOpen={isModalOpen} onClose={closeModal} title="Add Session">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Type</label>
              <select
                name="classType"
                value={form.classType}
                onChange={handleChange}
                required
                className={inputClasses}
              >
                <option value="" disabled>
                  Select a class type
                </option>
                {activeClassTypes.map((c) => (
                  <option key={c.id} value={c.name}>
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
      </main>
    </div>
  )
}

export default Schedule
