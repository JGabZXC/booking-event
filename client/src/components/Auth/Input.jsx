export default function Input({
  label,
  svg,
  id,
  placeholder,
  children,
  props,
  type,
  onChange,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          id={id}
          name={id}
          placeholder={placeholder}
          type={type}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-pink-500 focus:outline-pink-500 transition duration-200 pl-12"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {svg}
        </div>
        {children}
      </div>
    </div>
  );
}
