export default function Select({ label, className = '', children, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink/80 mb-1.5">{label}</span>}
      <select
        className={`w-full border border-ink/15 rounded px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta bg-white ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}