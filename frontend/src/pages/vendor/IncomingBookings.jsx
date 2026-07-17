import { useEffect, useState } from 'react';
import { getVendorBookings, updateBookingStatus } from '../../api/vendor';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function IncomingBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completingId, setCompletingId] = useState(null);
  const [completeForm, setCompleteForm] = useState({
    laborCost: '', materialCost: '', travelCost: '', beforeImageUrl: '', afterImageUrl: '',
  });

  const loadBookings = () => {
    getVendorBookings()
      .then((res) => setBookings(res.data))
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleAction = async (bookingId, status, extra = {}) => {
    setError('');
    try {
      await updateBookingStatus(bookingId, { status, ...extra });
      loadBookings();
      setCompletingId(null);
      setCompleteForm({ laborCost: '', materialCost: '', travelCost: '', beforeImageUrl: '', afterImageUrl: '' });
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${status.toLowerCase()} booking`);
    }
  };

  const handleCompleteSubmit = (e, bookingId) => {
    e.preventDefault();
    handleAction(bookingId, 'COMPLETED', {
      laborCost: completeForm.laborCost ? Number(completeForm.laborCost) : null,
      materialCost: completeForm.materialCost ? Number(completeForm.materialCost) : null,
      travelCost: completeForm.travelCost ? Number(completeForm.travelCost) : null,
      beforeImageUrl: completeForm.beforeImageUrl || null,
      afterImageUrl: completeForm.afterImageUrl || null,
    });
  };

  if (loading) return <p className="p-8 text-gray-500">Loading bookings...</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Incoming Bookings</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border rounded-lg p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold">{booking.slot.offering.serviceName}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Customer: {booking.customer.name} · {booking.customer.phone || 'no phone'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {booking.slot.slotDate} · {booking.slot.startTime.slice(0, 5)}-{booking.slot.endTime.slice(0, 5)}
                  </p>
                  {booking.isEmergency && (
                    <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded mt-2 inline-block">
                      Emergency
                    </span>
                  )}
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[booking.status]}`}>
                  {booking.status}
                </span>
              </div>

              {booking.status === 'PENDING' && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleAction(booking.id, 'CONFIRMED')}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleAction(booking.id, 'REJECTED')}
                    className="bg-red-50 text-red-600 px-4 py-1.5 rounded text-sm hover:bg-red-100"
                  >
                    Reject
                  </button>
                </div>
              )}

              {booking.status === 'CONFIRMED' && completingId !== booking.id && (
                <button
                  onClick={() => setCompletingId(booking.id)}
                  className="mt-4 bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700"
                >
                  Mark Complete
                </button>
              )}

              {completingId === booking.id && (
                <form onSubmit={(e) => handleCompleteSubmit(e, booking.id)} className="mt-4 pt-4 border-t space-y-2">
                  <p className="text-sm font-medium mb-2">Complete this job:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" placeholder="Labor ₹" value={completeForm.laborCost}
                      onChange={(e) => setCompleteForm({ ...completeForm, laborCost: e.target.value })}
                      className="border rounded px-2 py-1 text-sm" />
                    <input type="number" placeholder="Material ₹" value={completeForm.materialCost}
                      onChange={(e) => setCompleteForm({ ...completeForm, materialCost: e.target.value })}
                      className="border rounded px-2 py-1 text-sm" />
                    <input type="number" placeholder="Travel ₹" value={completeForm.travelCost}
                      onChange={(e) => setCompleteForm({ ...completeForm, travelCost: e.target.value })}
                      className="border rounded px-2 py-1 text-sm" />
                  </div>
                  <input placeholder="Before photo URL (optional)" value={completeForm.beforeImageUrl}
                    onChange={(e) => setCompleteForm({ ...completeForm, beforeImageUrl: e.target.value })}
                    className="w-full border rounded px-2 py-1 text-sm" />
                  <input placeholder="After photo URL (optional)" value={completeForm.afterImageUrl}
                    onChange={(e) => setCompleteForm({ ...completeForm, afterImageUrl: e.target.value })}
                    className="w-full border rounded px-2 py-1 text-sm" />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700">
                      Submit & Complete
                    </button>
                    <button type="button" onClick={() => setCompletingId(null)}
                      className="text-gray-500 px-4 py-1.5 rounded text-sm hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}