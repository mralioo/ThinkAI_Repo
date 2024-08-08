export const TextInput = ({ placeholder, value, onChange }) => (
  <input
    className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);
