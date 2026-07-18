import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Banknote, ShieldCheck, Heart, Clock, ShieldCheck as WarrantyIcon } from 'lucide-react';
import { getVendorProfile, getVendorServices, getOpenSlots } from '../../api/catalog';
import { createBooking, addFavorite } from '../../api/bookings';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

export default function VendorDetail() {
  const { vendorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    Promise.all([getVendorProfile(vendorId), getVendorServices(vendorId)])
      .then(([vendorRes, servicesRes]) => {
        setVendor(vendorRes.data);
        setServices(servicesRes.data);
      })
      .catch(() => setBookingError('Failed to load vendor details'))
      .finally(() => setLoading(false));
  }, [vendorId]);

  const handleSelectService = (service) => {
    setSelectedService(service);
    setSlots([]);
    getOpenSlots(service.id).then((res) => setSlots(res.data));
  };

  const handleBook = async (slotId) => {
    if (!user) { navigate('/login'); return; }
    setBookingError(''); setBookingSuccess('');
    try {
      await createBooking({ slotId, isEmergency: false });
      setBookingSuccess('Booked. Track it under "My Bookings".');
      setSlots(slots.filter((s) => s.id !== slotId));
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Booking failed');
    }
  };

  const handleFavorite = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await addFavorite(vendorId);
      setBookingSuccess('Added to favorites');
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Could not add favorite');
    }
  };

  if (loading) return <Spinner label="Loading vendor..." />;
  if (!vendor) return <p className="p-8 text-sindoor text-sm">Vendor not found</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link
        to={`/category/${vendor.category.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition mb-6"
      >
        <ArrowLeft size={15} /> Back to {vendor.category.name}
      </Link>

      <Card className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl text-ink">{vendor.businessName}</h1>
              {vendor.verificationType !== 'UNVERIFIED' && (
                <ShieldCheck size={18} className="text-banyan" strokeWidth={2} />
              )}
            </div>
            <p className="text-ink/50 text-sm mt-1">{vendor.location}</p>
            <p className="text-ink/70 mt-3 leading-relaxed">{vendor.description}</p>
            <p className="text-sm text-ink/50 mt-2 font-mono">{vendor.tags}</p>
          </div>

          <div className="text-right shrink-0 ml-4">
            <div className="flex items-center justify-end gap-1 text-terracotta font-medium text-lg">
              <Star size={17} fill="currentColor" />
              {vendor.avgRating.toFixed(1)}
              <span className="text-ink/40 text-sm font-normal">({vendor.ratingCount})</span>
            </div>
            {vendor.acceptsCash && (
              <div className="flex items-center justify-end gap-1 text-xs text-banyan mt-2">
                <Banknote size={13} /> Cash accepted
              </div>
            )}
            {vendor.verificationType !== 'UNVERIFIED' && (
              <p className="text-xs text-ink/40 mt-1 font-mono">
                {vendor.verificationType.replace('_', ' ')}
              </p>
            )}
          </div>
        </div>

        <Button variant="outline" className="mt-4" onClick={handleFavorite}>
          <Heart size={15} /> Add to Favorites
        </Button>
      </Card>

      {bookingError && <p className="text-sindoor text-sm mb-4">{bookingError}</p>}
      {bookingSuccess && <p className="text-banyan text-sm mb-4">{bookingSuccess}</p>}

      <h2 className="font-display text-xl text-ink mb-3">Services</h2>
      <div className="grid gap-3 mb-8">
        {services.map((service) => (
          <button key={service.id} onClick={() => handleSelectService(service)} className="text-left">
            <Card
              className={`hover:border-terracotta transition ${
                selectedService?.id === service.id ? 'border-terracotta ring-1 ring-terracotta/30' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-ink">{service.serviceName}</span>
                <span className="font-mono font-semibold text-ink">₹{service.price}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-ink/50 mt-2">
                <span className="flex items-center gap-1"><Clock size={12} /> {service.durationMinutes} min</span>
                {service.warrantyMonths > 0 && (
                  <span className="flex items-center gap-1">
                    <WarrantyIcon size={12} /> {service.warrantyMonths}mo warranty
                  </span>
                )}
              </div>
            </Card>
          </button>
        ))}
      </div>

      {selectedService && (
        <>
          <h2 className="font-display text-xl text-ink mb-3">Available Slots</h2>
          {slots.length === 0 ? (
            <EmptyState title="No open slots" description="Nothing available for this service right now — check back later." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {slots.map((slot) => (
                <button key={slot.id} onClick={() => handleBook(slot.id)}>
                  <Card className="hover:border-terracotta hover:bg-terracotta/5 transition text-sm">
                    <div className="font-medium text-ink">{slot.slotDate}</div>
                    <div className="text-ink/50 font-mono text-xs mt-0.5">
                      {slot.startTime.slice(0, 5)}–{slot.endTime.slice(0, 5)}
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}