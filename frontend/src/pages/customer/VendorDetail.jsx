import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getVendorProfile, getVendorServices, getOpenSlots } from '../../api/catalog';
import { createBooking, addFavorite } from '../../api/bookings';
import { useAuth } from '../../context/AuthContext';

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
    if (!user) {
      navigate('/login');
      return;
    }
    setBookingError('');
    setBookingSuccess('');
    try {
      await createBooking({ slotId, isEmergency: false });
      setBookingSuccess('Booked! Check "My Bookings" for status.');
      setSlots(slots.filter((s) => s.id !== slotId));
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Booking failed');
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addFavorite(vendorId);
      setBookingSuccess('Added to favorites');
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Could not add favorite');
    }
  };

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;
  if (!vendor) return <p className="p-8 text-red-600">Vendor not found</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link to={`/category/${vendor.category.id}`} className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Back to {vendor.category.name}
      </Link>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{vendor.businessName}</h1>
            <p className="text-gray-500 mt-1">{vendor.location}</p>
            <p className="text-gray-600 mt-2">{vendor.description}</p>
            <p className="text-sm text-gray-500 mt-2">{vendor.tags}</p>
          </div>
          <div className="text-right">
            <div className="text-yellow-500 font-medium text-lg">
              ★ {vendor.avgRating.toFixed(1)} ({vendor.ratingCount})
            </div>
            {vendor.acceptsCash && (
              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded mt-1 inline-block">
                Cash accepted
              </span>
            )}
            {vendor.verificationType !== 'UNVERIFIED' && (
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded mt-1 block">
                {vendor.verificationType.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleFavorite}
          className="mt-4 text-sm text-pink-600 border border-pink-200 px-3 py-1 rounded hover:bg-pink-50"
        >
          ♥ Add to Favorites
        </button>
      </div>

      {bookingError && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{bookingError}</div>
      )}
      {bookingSuccess && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">{bookingSuccess}</div>
      )}

      <h2 className="text-lg font-semibold mb-3">Services</h2>
      <div className="grid gap-3 mb-6">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => handleSelectService(service)}
            className={`text-left border rounded-lg p-4 hover:border-blue-400 transition ${
              selectedService?.id === service.id ? 'border-blue-500 bg-blue-50' : 'bg-white'
            }`}
          >
            <div className="flex justify-between">
              <span className="font-medium">{service.serviceName}</span>
              <span className="font-semibold">₹{service.price}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {service.durationMinutes} min
              {service.warrantyMonths > 0 && ` · ${service.warrantyMonths} month warranty`}
            </p>
          </button>
        ))}
      </div>

      {selectedService && (
        <>
          <h2 className="text-lg font-semibold mb-3">Available Slots</h2>
          {slots.length === 0 ? (
            <p className="text-gray-500">No open slots for this service right now.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleBook(slot.id)}
                  className="border rounded-lg p-3 text-sm bg-white hover:border-blue-400 hover:bg-blue-50 transition"
                >
                  <div className="font-medium">{slot.slotDate}</div>
                  <div className="text-gray-500">
                    {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}