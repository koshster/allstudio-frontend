function Toggle({ checked, onChange, name }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <span className="w-10 h-5 bg-gray-300 peer-checked:bg-[#6C63FF] rounded-full transition-colors" />
      <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
    </label>
  )
}

export default Toggle
