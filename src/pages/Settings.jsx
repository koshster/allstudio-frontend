import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Modal from "../components/Modal"
import Toggle from "../components/Toggle"

const tabs = [
  { key: "profile", label: "Studio Profile" },
  { key: "notifications", label: "Notification Preferences" },
  { key: "security", label: "Account & Security" },
]

const notificationItems = [
  {
    key: "churnAlerts",
    label: "Email alerts for high churn risk clients",
    description: "Get notified by email whenever a client's churn score crosses into high risk.",
  },
  {
    key: "weeklySummary",
    label: "Weekly retention summary report",
    description: "Receive a weekly digest summarizing client retention and at-risk trends.",
  },
  {
    key: "newClientAlerts",
    label: "New client registration alerts",
    description: "Get notified whenever a new client signs up or is added to the roster.",
  },
  {
    key: "capacityWarnings",
    label: "Class capacity warnings",
    description: "Get notified when a class session fills past 80% of capacity.",
  },
]

const inputClasses =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent"

const cardClasses = "bg-white border border-gray-200 rounded-lg shadow-sm p-6"

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function Settings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [toast, setToast] = useState("")

  const [profile, setProfile] = useState({
    studioName: "Tranquil Tree Yoga",
    ownerName: "Emma Rodriguez",
    email: "emma@tranquiltreeyoga.com",
    phone: "(619) 555-0134",
    address: "1420 Garnet Ave, San Diego, CA 92109",
    studioType: "Yoga",
  })

  const [notifications, setNotifications] = useState({
    churnAlerts: true,
    weeklySummary: true,
    newClientAlerts: false,
    capacityWarnings: true,
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(""), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  const showToast = (message) => setToast(message)

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    showToast("Studio profile updated successfully.")
  }

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] })
  }

  const handleNotificationsSave = () => {
    showToast("Notification preferences saved.")
  }

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
    setPasswordError("")
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation do not match.")
      return
    }
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    showToast("Password updated successfully.")
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-white p-8">
        <h1 className="text-2xl font-semibold text-[#1a1a2e] mb-6">Settings</h1>

        <div className="flex gap-2 border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.key
                  ? "border-[#6C63FF] text-[#6C63FF]"
                  : "border-transparent text-gray-500 hover:text-[#1a1a2e]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className={`${cardClasses} max-w-2xl`}>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Studio Name</label>
                  <input
                    name="studioName"
                    value={profile.studioName}
                    onChange={handleProfileChange}
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                  <input
                    name="ownerName"
                    value={profile.ownerName}
                    onChange={handleProfileChange}
                    required
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    required
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
                  required
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Studio Type</label>
                <select
                  name="studioType"
                  value={profile.studioType}
                  onChange={handleProfileChange}
                  className={inputClasses}
                >
                  <option value="Yoga">Yoga</option>
                  <option value="Pilates">Pilates</option>
                  <option value="Lagree">Lagree</option>
                  <option value="Barre">Barre</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-[#6C63FF] text-white rounded-md px-5 py-2 text-sm font-medium hover:bg-[#5b52e0] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className={`${cardClasses} max-w-2xl`}>
            <div>
              {notificationItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-start justify-between gap-4 py-4 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <div className="text-sm font-medium text-[#1a1a2e]">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  </div>
                  <Toggle
                    checked={notifications[item.key]}
                    onChange={() => toggleNotification(item.key)}
                  />
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={handleNotificationsSave}
                className="bg-[#6C63FF] text-white rounded-md px-5 py-2 text-sm font-medium hover:bg-[#5b52e0] transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6 max-w-2xl">
            <div className={cardClasses}>
              <h2 className="text-base font-semibold text-[#1a1a2e] mb-4">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className={inputClasses}
                  />
                </div>

                {passwordError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {passwordError}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#6C63FF] text-white rounded-md px-5 py-2 text-sm font-medium hover:bg-[#5b52e0] transition-colors"
                  >
                    Save Password
                  </button>
                </div>
              </form>
            </div>

            <div className="border border-red-200 bg-red-50 rounded-lg p-6">
              <h2 className="text-base font-semibold text-red-700 mb-1">Danger Zone</h2>
              <p className="text-sm text-red-600 mb-4">
                Deleting your account will permanently remove all studio data, clients, and
                schedules. This action cannot be undone.
              </p>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="bg-red-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Account"
        >
          <p className="text-sm text-gray-600 mb-5">
            Are you sure you want to delete your account? This will permanently remove all
            studio data and cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-red-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </Modal>

        {toast && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-md shadow-lg">
            <CheckIcon className="w-4 h-4" />
            {toast}
          </div>
        )}
      </main>
    </div>
  )
}

export default Settings
