export default function Input({
  label,
  svg,
  id,
  placeholder,
  children,
  props,
  type,
  onChange,
  error,
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
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200 pl-12 pr-12 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 pl-3 flex items-center pointer-events-none">
          {svg}
        </div>
        {children}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
