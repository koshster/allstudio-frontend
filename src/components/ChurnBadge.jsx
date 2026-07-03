function ChurnBadge({ score }) {
  let label = "Low Risk"
  let classes = "bg-green-50 text-green-700 border-green-200"

  if (score > 70) {
    label = "High Risk"
    classes = "bg-red-50 text-red-700 border-red-200"
  } else if (score >= 50) {
    label = "Medium Risk"
    classes = "bg-yellow-50 text-yellow-700 border-yellow-200"
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${classes}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}

export default ChurnBadge
