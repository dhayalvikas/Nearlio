import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, PackageCheck, Inbox } from 'lucide-react';
import { getVendorBookings, updateBookingStatus } from '../../api/vendor';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

const statusVariant = {
  PENDING: 'pending', CONFIRMED: 'confirmed', COMPLETED: 'completed',
  CANCELLED: 'cancelled', REJECTED: 'rejected',
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

  useEffect(() => { loadBookings(); }, []);

  const handleAction = async (bookingId, status, extra = {}) => {
    setError('');
    try {
      await updateBookingStatus(bookingId, { status, ...extra });
      loadBookings();
      setCompletingId(null);
      setCompleteForm({ laborCost: '', materialCost: '', travelCost: '', beforeImageUrl: '', afterImageUrl: '' });
    } catch (err) {
      setError(err.response?.data?.error || `Failed to update booking`);
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

  if (loading) return <Spinner label="Loading bookings..." />;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-ink mb-6">Incoming Bookings</h1>

      {error && <p className="text-sindoor text-sm mb-4">{error}</p>}

      {bookings.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Nothing yet"
          description="Bookings from customers will show up here as they come in."
        />
      ) : (
        <div className="grid gap-5">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-ink/10 border-dashed rounded-lg overflow-hidden">
              <div className="flex items-start justify-between p-5">
                <div>
                  <p className="font-mono text-xs text-ink/40 mb-1">
                    TOKEN #{String(booking.id).padStart(4, '0')}
                  </p>
                  <h2 className="font-display text-lg text-ink">{booking.slot.offering.serviceName}</h2>
                  <p className="text-sm text-ink/60 mt-1">
                    {booking.customer.name} {booking.customer.phone && `· ${booking.customer.phone}`}
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

              {booking.status === 'PENDING' && (
                <div className="border-t border-dashed border-ink/10 px-5 py-4 flex gap-2">
                  <Button variant="primary" onClick={() => handleAction(booking.id, 'CONFIRMED')}>
                    <CheckCircle2 size={15} /> Confirm
                  </Button>
                  <Button variant="danger" onClick={() => handleAction(booking.id, 'REJECTED')}>
                    <XCircle size={15} /> Reject
                  </Button>
                </div>
              )}

              {booking.status === 'CONFIRMED' && completingId !== booking.id && (
                <div className="border-t border-dashed border-ink/10 px-5 py-4">
                  <Button variant="success" onClick={() => setCompletingId(booking.id)}>
                    <PackageCheck size={15} /> Mark Complete
                  </Button>
                </div>
              )}

              {completingId === booking.id && (
                <form
                  onSubmit={(e) => handleCompleteSubmit(e, booking.id)}
                  className="border-t border-dashed border-ink/10 px-5 py-4 space-y-3"
                >
                  <p className="text-sm font-medium text-ink/70">Close out this job</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="0" label="Labor ₹" type="number" value={completeForm.laborCost}
                      onChange={(e) => setCompleteForm({ ...completeForm, laborCost: e.target.value })} />
                    <Input placeholder="0" label="Material ₹" type="number" value={completeForm.materialCost}
                      onChange={(e) => setCompleteForm({ ...completeForm, materialCost: e.target.value })} />
                    <Input placeholder="0" label="Travel ₹" type="number" value={completeForm.travelCost}
                      onChange={(e) => setCompleteForm({ ...completeForm, travelCost: e.target.value })} />
                  </div>
                  <Input label="Before photo URL (optional)" value={completeForm.beforeImageUrl}
                    onChange={(e) => setCompleteForm({ ...completeForm, beforeImageUrl: e.target.value })} />
                  <Input label="After photo URL (optional)" value={completeForm.afterImageUrl}
                    onChange={(e) => setCompleteForm({ ...completeForm, afterImageUrl: e.target.value })} />
                  <div className="flex gap-2">
                    <Button type="submit" variant="success">Submit & Complete</Button>
                    <Button type="button" variant="ghost" onClick={() => setCompletingId(null)}>Cancel</Button>
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