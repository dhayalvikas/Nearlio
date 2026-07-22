import { useEffect, useState } from 'react';
import { TrendingUp, CheckCircle2, XCircle, Ban, Percent } from 'lucide-react';
import { getVendorStats } from '../../api/vendor';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

export default function VendorStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getVendorStats().then((res) => setStats(res.data)).catch(() => setError('Failed to load stats'));
  }, []);

  if (error) return <p className="p-8 text-sindoor text-sm">{error}</p>;
  if (!stats) return <Spinner label="Loading stats..." />;

  const cards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: TrendingUp, color: 'text-ink' },
    { label: 'Completed', value: stats.completedBookings, icon: CheckCircle2, color: 'text-banyan' },
    { label: 'Cancelled', value: stats.cancelledBookings, icon: Ban, color: 'text-ink/40' },
    { label: 'Rejected', value: stats.rejectedBookings, icon: XCircle, color: 'text-sindoor' },
    { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: Percent, color: 'text-terracotta' },
    { label: 'Cancellation Rate', value: `${stats.cancellationRate}%`, icon: Percent, color: 'text-ink/40' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-ink mb-6">Performance</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className="text-center">
            <card.icon className={`mx-auto mb-2 ${card.color}`} size={20} strokeWidth={1.5} />
            <div className={`font-display text-2xl ${card.color}`}>{card.value}</div>
            <div className="text-xs text-ink/50 mt-1">{card.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}