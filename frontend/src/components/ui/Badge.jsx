const styles = {
  neutral: 'bg-ink/5 text-ink/70',
  pending: 'bg-terracotta/10 text-terracotta',
  confirmed: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-banyan/10 text-banyan',
  cancelled: 'bg-ink/5 text-ink/50',
  rejected: 'bg-sindoor/10 text-sindoor',
};

export default function Badge({ variant = 'neutral', children }) {
  return (
    <span className={`text-xs px-3 py-1 rounded-full font-mono font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}