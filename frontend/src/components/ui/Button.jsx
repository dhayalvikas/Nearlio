export default function Button({ variant = 'primary', className = '', children, ...props }) {
  const base = 'px-4 py-2 rounded font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2';

  const variants = {
    primary: 'bg-ink text-cream hover:bg-ink/90',
    accent: 'bg-terracotta text-cream hover:bg-terracotta/90',
    outline: 'border border-ink/20 text-ink hover:bg-ink/5',
    danger: 'bg-sindoor/10 text-sindoor hover:bg-sindoor/20',
    success: 'bg-banyan text-cream hover:bg-banyan/90',
    ghost: 'text-ink/70 hover:text-ink',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}