import { useState } from 'react';
import { createVendorProfile, addVendorService, createSlot } from '../../api/vendor';

export default function VendorDashboard() {
  const [profileForm, setProfileForm] = useState({
    categoryId: '', businessName: '', description: '', tags: '',
    location: '', workingHoursStart: '09:00', workingHoursEnd: '18:00', acceptsCash: false,
  });
  const [serviceForm, setServiceForm] = useState({ serviceName: '', price: '', durationMinutes: '', warrantyMonths: 0 });
  const [slotForm, setSlotForm] = useState({ offeringId: '', slotDate: '', startTime: '', endTime: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearMessages = () => { setMessage(''); setError(''); };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await createVendorProfile({ ...profileForm, categoryId: Number(profileForm.categoryId) });
      setMessage('Profile created successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create profile');
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await addVendorService({
        ...serviceForm,
        price: Number(serviceForm.price),
        durationMinutes: Number(serviceForm.durationMinutes),
      });
      setMessage('Service added successfully');
      setServiceForm({ serviceName: '', price: '', durationMinutes: '', warrantyMonths: 0 });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add service');
    }
  };

  const handleSlotSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await createSlot({ ...slotForm, offeringId: Number(slotForm.offeringId) });
      setMessage('Slot created successfully');
      setSlotForm({ ...slotForm, slotDate: '', startTime: '', endTime: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create slot');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>

      {message && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

      <section className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">1. Create/Update Profile</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-3">
          <input placeholder="Category ID (e.g. 1 for Plumbing)" value={profileForm.categoryId}
            onChange={(e) => setProfileForm({ ...profileForm, categoryId: e.target.value })}
            className="w-full border rounded px-3 py-2" required />
          <input placeholder="Business Name" value={profileForm.businessName}
            onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })}
            className="w-full border rounded px-3 py-2" required />
          <textarea placeholder="Description" value={profileForm.description}
            onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
            className="w-full border rounded px-3 py-2" />
          <input placeholder="Tags (comma separated)" value={profileForm.tags}
            onChange={(e) => setProfileForm({ ...profileForm, tags: e.target.value })}
            className="w-full border rounded px-3 py-2" />
          <input placeholder="Location" value={profileForm.location}
            onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
            className="w-full border rounded px-3 py-2" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={profileForm.acceptsCash}
              onChange={(e) => setProfileForm({ ...profileForm, acceptsCash: e.target.checked })} />
            Accepts Cash
          </label>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Save Profile
          </button>
        </form>
      </section>

      <section className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">2. Add a Service</h2>
        <form onSubmit={handleServiceSubmit} className="space-y-3">
          <input placeholder="Service Name" value={serviceForm.serviceName}
            onChange={(e) => setServiceForm({ ...serviceForm, serviceName: e.target.value })}
            className="w-full border rounded px-3 py-2" required />
          <input type="number" placeholder="Price" value={serviceForm.price}
            onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
            className="w-full border rounded px-3 py-2" required />
          <input type="number" placeholder="Duration (minutes)" value={serviceForm.durationMinutes}
            onChange={(e) => setServiceForm({ ...serviceForm, durationMinutes: e.target.value })}
            className="w-full border rounded px-3 py-2" required />
          <input type="number" placeholder="Warranty (months, 0 if none)" value={serviceForm.warrantyMonths}
            onChange={(e) => setServiceForm({ ...serviceForm, warrantyMonths: e.target.value })}
            className="w-full border rounded px-3 py-2" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Service
          </button>
        </form>
      </section>

      <section className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold text-lg mb-4">3. Create a Slot</h2>
        <form onSubmit={handleSlotSubmit} className="space-y-3">
          <input placeholder="Service ID (from above)" value={slotForm.offeringId}
            onChange={(e) => setSlotForm({ ...slotForm, offeringId: e.target.value })}
            className="w-full border rounded px-3 py-2" required />
          <input type="date" value={slotForm.slotDate}
            onChange={(e) => setSlotForm({ ...slotForm, slotDate: e.target.value })}
            className="w-full border rounded px-3 py-2" required />
          <div className="flex gap-3">
            <input type="time" value={slotForm.startTime}
              onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
              className="w-full border rounded px-3 py-2" required />
            <input type="time" value={slotForm.endTime}
              onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
              className="w-full border rounded px-3 py-2" required />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Create Slot
          </button>
        </form>
      </section>
    </div>
  );
}