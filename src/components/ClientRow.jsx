import ChurnBadge from "./ChurnBadge"

function ClientRow({ client }) {
  const { name, email, lastVisit, churnScore } = client

  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 last:border-b-0">
      <div>
        <div className="text-sm font-medium text-[#1a1a2e]">{name}</div>
        <div className="text-xs text-gray-500 mt-0.5">{email}</div>
        <div className="text-xs text-gray-400 mt-0.5">Last visit: {lastVisit}</div>
      </div>
      <ChurnBadge score={churnScore} />
    </div>
  )
}

export default ClientRow
