export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16 px-6">
      {Icon && <Icon className="mx-auto mb-4 text-ink/20" size={40} strokeWidth={1.5} />}
      <h3 className="font-display text-lg text-ink mb-1">{title}</h3>
      {description && <p className="text-sm text-ink/50 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}