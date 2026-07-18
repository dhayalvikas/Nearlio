import { useEffect, useState } from 'react';
import { PlusCircle, Store, Wrench, CalendarPlus } from 'lucide-react';
import { createVendorProfile, addVendorService, createSlot, getMyVendorProfile } from '../../api/vendor';
import { getCategories, getVendorServices } from '../../api/catalog';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export default function VendorDashboard() {
  const [categories, setCategories] = useState([]);
  const [myVendorId, setMyVendorId] = useState(null);
  const [myServices, setMyServices] = useState([]);

  const [profileForm, setProfileForm] = useState({
    categoryId: '', businessName: '', description: '', tags: '',
    location: '', workingHoursStart: '09:00', workingHoursEnd: '18:00', acceptsCash: false,
  });
  const [serviceForm, setServiceForm] = useState({ serviceName: '', price: '', durationMinutes: '', warrantyMonths: 0 });
  const [slotForm, setSlotForm] = useState({ offeringId: '', slotDate: '', startTime: '', endTime: '' });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearMessages = () => { setMessage(''); setError(''); };

  const loadMyServices = () => {
    getMyVendorProfile()
      .then((res) => {
        setMyVendorId(res.data.id);
        return getVendorServices(res.data.id);
      })
      .then((res) => setMyServices(res.data))
      .catch(() => {
        // No profile yet — expected for a brand-new vendor before their first save.
        setMyVendorId(null);
        setMyServices([]);
      });
  };

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
    loadMyServices();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await createVendorProfile({ ...profileForm, categoryId: Number(profileForm.categoryId) });
      setMessage('Profile saved.');
      loadMyServices();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save profile');
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
      setMessage('Service added.');
      setServiceForm({ serviceName: '', price: '', durationMinutes: '', warrantyMonths: 0 });
      loadMyServices();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add service');
    }
  };

  const handleSlotSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await createSlot({ ...slotForm, offeringId: Number(slotForm.offeringId) });
      setMessage('Slot created.');
      setSlotForm({ ...slotForm, slotDate: '', startTime: '', endTime: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create slot');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-ink mb-6">Vendor Dashboard</h1>

      {message && <p className="text-banyan text-sm mb-4">{message}</p>}
      {error && <p className="text-sindoor text-sm mb-4">{error}</p>}

      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Store size={18} className="text-terracotta" />
          <h2 className="font-display text-lg text-ink">Business Profile</h2>
        </div>
        <form onSubmit={handleProfileSubmit} className="space-y-3">
          <Select
            label="Category"
            value={profileForm.categoryId}
            onChange={(e) => setProfileForm({ ...profileForm, categoryId: e.target.value })}
            required
          >
            <option value="">Choose a category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Input label="Business Name" value={profileForm.businessName}
            onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })} required />
          <label className="block">
            <span className="block text-sm font-medium text-ink/80 mb-1.5">Description</span>
            <textarea
              value={profileForm.description}
              onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
              className="w-full border border-ink/15 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta"
            />
          </label>
          <Input label="Tags (comma separated)" value={profileForm.tags}
            onChange={(e) => setProfileForm({ ...profileForm, tags: e.target.value })} />
          <Input label="Location" value={profileForm.location}
            onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" checked={profileForm.acceptsCash}
              onChange={(e) => setProfileForm({ ...profileForm, acceptsCash: e.target.checked })} />
            Accepts cash
          </label>
          <Button type="submit" variant="primary">Save Profile</Button>
        </form>
      </Card>

      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Wrench size={18} className="text-terracotta" />
          <h2 className="font-display text-lg text-ink">Add a Service</h2>
        </div>
        <form onSubmit={handleServiceSubmit} className="space-y-3">
          <Input label="Service Name" value={serviceForm.serviceName}
            onChange={(e) => setServiceForm({ ...serviceForm, serviceName: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price (₹)" type="number" value={serviceForm.price}
              onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} required />
            <Input label="Duration (min)" type="number" value={serviceForm.durationMinutes}
              onChange={(e) => setServiceForm({ ...serviceForm, durationMinutes: e.target.value })} required />
          </div>
          <Input label="Warranty (months, 0 if none)" type="number" value={serviceForm.warrantyMonths}
            onChange={(e) => setServiceForm({ ...serviceForm, warrantyMonths: e.target.value })} />
          <Button type="submit" variant="primary"><PlusCircle size={15} /> Add Service</Button>
        </form>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <CalendarPlus size={18} className="text-terracotta" />
          <h2 className="font-display text-lg text-ink">Open a Slot</h2>
        </div>
        <form onSubmit={handleSlotSubmit} className="space-y-3">
          <Select
            label="Service"
            value={slotForm.offeringId}
            onChange={(e) => setSlotForm({ ...slotForm, offeringId: e.target.value })}
            required
          >
            <option value="">Choose a service</option>
            {myServices.map((s) => (
              <option key={s.id} value={s.id}>{s.serviceName} — ₹{s.price}</option>
            ))}
          </Select>
          <Input label="Date" type="date" value={slotForm.slotDate}
            onChange={(e) => setSlotForm({ ...slotForm, slotDate: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start" type="time" value={slotForm.startTime}
              onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })} required />
            <Input label="End" type="time" value={slotForm.endTime}
              onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })} required />
          </div>
          <Button type="submit" variant="primary"><CalendarPlus size={15} /> Create Slot</Button>
        </form>
      </Card>
    </div>
  );
}