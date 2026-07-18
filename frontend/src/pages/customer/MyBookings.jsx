import { useEffect, useState, useCallback } from 'react';
import { getMyBookings, submitRating } from '../../api/bookings';
import { useSSE } from '../../hooks/useSSE';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveUpdate, setLiveUpdate] = useState('');
  const [ratingBookingId, setRatingBookingId] = useState(null);
  const [ratingForm, setRatingForm] = useState({ rating: 5, review: '' });
  const [ratedBookings, setRatedBookings] = useState(new Set());

  const loadBookings = () => {
    getMyBookings()
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleRatingSubmit = async (e, bookingId) => {
    e.preventDefault();
    try {
      await submitRating({ bookingId, rating: Number(ratingForm.rating), review: ratingForm.review });
      setRatedBookings((prev) => new Set(prev).add(bookingId));
      setRatingBookingId(null);
      setRatingForm({ rating: 5, review: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit rating');
    }
  };

  const handleSSEMessage = useCallback((payload) => {
    setLiveUpdate(`Booking #${payload.bookingId} updated to ${payload.status}`);
    loadBookings();
    setTimeout(() => setLiveUpdate(''), 4000);
  }, []);

  useSSE(handleSSEMessage);

  if (loading) return <p className="p-8 text-gray-500">Loading your bookings...</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">My Bookings</h1>

      {liveUpdate && (
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded mb-4 text-sm animate-pulse">
          🔔 {liveUpdate}
        </div>
      )}

      {bookings.length === 0 ? (
        <p className="text-gray-500 mt-4">No bookings yet — go browse some services!</p>
      ) : (
        <div className="grid gap-4 mt-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border rounded-lg p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold">
                    {booking.slot.offering.serviceName}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {booking.slot.offering.vendor.businessName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {booking.slot.slotDate} · {booking.slot.startTime.slice(0, 5)}-
                    {booking.slot.endTime.slice(0, 5)}
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

              {booking.status === 'COMPLETED' && (
                <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                  {booking.laborCost && <p>Labor: ₹{booking.laborCost}</p>}
                  {booking.materialCost && <p>Material: ₹{booking.materialCost}</p>}
                  {booking.travelCost && <p>Travel: ₹{booking.travelCost}</p>}
                  {booking.warrantyExpiresAt && (
                    <p className="text-green-600 mt-1">
                      Warranty until {booking.warrantyExpiresAt}
                    </p>
                  )}
                </div>
              )}

              {booking.status === 'COMPLETED' && !ratedBookings.has(booking.id) && (
                <div className="mt-3 pt-3 border-t">
                  {ratingBookingId === booking.id ? (
                    <form onSubmit={(e) => handleRatingSubmit(e, booking.id)} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Rating:</label>
                        <select
                          value={ratingForm.rating}
                          onChange={(e) => setRatingForm({ ...ratingForm, rating: e.target.value })}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>{n} ★</option>
                          ))}
                        </select>
                      </div>
                      <textarea
                        placeholder="Write a review (optional)"
                        value={ratingForm.review}
                        onChange={(e) => setRatingForm({ ...ratingForm, review: e.target.value })}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">
                          Submit Rating
                        </button>
                        <button type="button" onClick={() => setRatingBookingId(null)} className="text-gray-500 text-sm">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setRatingBookingId(booking.id)}
                      className="text-sm text-yellow-600 border border-yellow-200 px-3 py-1 rounded hover:bg-yellow-50"
                    >
                      ★ Rate this service
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}