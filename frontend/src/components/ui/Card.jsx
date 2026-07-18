export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-white border border-ink/10 rounded-lg p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}