import { useEffect, useState, useCallback } from 'react';
import { CalendarClock, Star, ShieldCheck } from 'lucide-react';
import { getMyBookings, submitRating } from '../../api/bookings';
import { useSSE } from '../../hooks/useSSE';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

const statusVariant = {
  PENDING: 'pending', CONFIRMED: 'confirmed', COMPLETED: 'completed',
  CANCELLED: 'cancelled', REJECTED: 'rejected',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveUpdate, setLiveUpdate] = useState('');
  const [ratingBookingId, setRatingBookingId] = useState(null);
  const [ratingForm, setRatingForm] = useState({ rating: 5, review: '' });
  const [ratedBookings, setRatedBookings] = useState(new Set());

  const loadBookings = () => {
    getMyBookings().then((res) => setBookings(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadBookings(); }, []);

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

  if (loading) return <Spinner label="Loading your bookings..." />;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-ink mb-2">My Bookings</h1>
      <p className="text-ink/50 text-sm mb-6">Every booking is a token — track it here.</p>

      {liveUpdate && (
        <div className="bg-terracotta/10 text-terracotta px-4 py-2 rounded mb-4 text-sm font-mono">
          ● {liveUpdate}
        </div>
      )}

      {bookings.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No bookings yet"
          description="Go find someone nearby and book your first service."
        />
      ) : (
        <div className="grid gap-5">
          {bookings.map((booking) => (
            <div key={booking.id} className="relative">
              {/* Receipt stub */}
              <div className="bg-white border border-ink/10 border-dashed rounded-lg overflow-hidden">
                <div className="flex items-start justify-between p-5">
                  <div>
                    <p className="font-mono text-xs text-ink/40 mb-1">
                      TOKEN #{String(booking.id).padStart(4, '0')}
                    </p>
                    <h2 className="font-display text-lg text-ink">
                      {booking.slot.offering.serviceName}
                    </h2>
                    <p className="text-sm text-ink/60 mt-1">
                      {booking.slot.offering.vendor.businessName}
                    </p>
                    <p className="font-mono text-xs text-ink/40 mt-2">
                      {booking.slot.slotDate} · {booking.slot.startTime.slice(0, 5)}–{booking.slot.endTime.slice(0, 5)}
                    </p>
                    {booking.isEmergency && (
                      <span className="inline-block mt-2"><Badge variant="rejected">Emergency</Badge></span>
                    )}
                  </div>
                  <Badge variant={statusVariant[booking.status]}>{booking.status}</Badge>
                </div>

                {booking.status === 'COMPLETED' && (
                  <div className="border-t border-dashed border-ink/10 px-5 py-4 bg-cream/50 font-mono text-xs text-ink/60 space-y-1">
                    {booking.laborCost && <p>Labor .......... ₹{booking.laborCost}</p>}
                    {booking.materialCost && <p>Material ....... ₹{booking.materialCost}</p>}
                    {booking.travelCost && <p>Travel ......... ₹{booking.travelCost}</p>}
                    {booking.warrantyExpiresAt && (
                      <p className="flex items-center gap-1 text-banyan mt-2">
                        <ShieldCheck size={12} /> Warranty until {booking.warrantyExpiresAt}
                      </p>
                    )}
                  </div>
                )}

                {booking.status === 'COMPLETED' && !ratedBookings.has(booking.id) && (
                  <div className="border-t border-dashed border-ink/10 px-5 py-4">
                    {ratingBookingId === booking.id ? (
                      <form onSubmit={(e) => handleRatingSubmit(e, booking.id)} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-ink/70">Rating:</span>
                          <select
                            value={ratingForm.rating}
                            onChange={(e) => setRatingForm({ ...ratingForm, rating: e.target.value })}
                            className="border border-ink/15 rounded px-2 py-1 text-sm"
                          >
                            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
                          </select>
                        </div>
                        <textarea
                          placeholder="Write a review (optional)"
                          value={ratingForm.review}
                          onChange={(e) => setRatingForm({ ...ratingForm, review: e.target.value })}
                          className="w-full border border-ink/15 rounded px-2 py-1 text-sm"
                        />
                        <div className="flex gap-2">
                          <Button type="submit" variant="accent">Submit Rating</Button>
                          <Button type="button" variant="ghost" onClick={() => setRatingBookingId(null)}>Cancel</Button>
                        </div>
                      </form>
                    ) : (
                      <Button variant="outline" onClick={() => setRatingBookingId(booking.id)}>
                        <Star size={14} /> Rate this service
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Perforation dots between stub sections */}
              <div className="absolute left-0 right-0 top-0 h-full pointer-events-none">
                <div className="absolute -left-1.5 top-1/2 w-3 h-3 rounded-full bg-cream border border-ink/10" />
                <div className="absolute -right-1.5 top-1/2 w-3 h-3 rounded-full bg-cream border border-ink/10" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}