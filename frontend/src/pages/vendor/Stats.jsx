import { useEffect, useState } from 'react';
import { getVendorStats } from '../../api/vendor';

export default function VendorStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getVendorStats()
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load stats'));
  }, []);

  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!stats) return <p className="p-8 text-gray-500">Loading stats...</p>;

  const cards = [
    { label: 'Total Bookings', value: stats.totalBookings, color: 'text-gray-800' },
    { label: 'Completed', value: stats.completedBookings, color: 'text-green-600' },
    { label: 'Cancelled', value: stats.cancelledBookings, color: 'text-gray-500' },
    { label: 'Rejected', value: stats.rejectedBookings, color: 'text-red-500' },
    { label: 'Completion Rate', value: `${stats.completionRate}%`, color: 'text-blue-600' },
    { label: 'Cancellation Rate', value: `${stats.cancellationRate}%`, color: 'text-orange-500' },
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Performance Stats</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border rounded-lg p-5 text-center">
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <div className="text-sm text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}