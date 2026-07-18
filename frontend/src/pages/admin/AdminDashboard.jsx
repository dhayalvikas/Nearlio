import { useEffect, useState } from 'react';
import { getAllVendors, deactivateVendor, reactivateVendor, updateVerification } from '../../api/admin';

export default function AdminDashboard() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadVendors = () => {
    getAllVendors()
      .then((res) => setVendors(res.data))
      .catch(() => setError('Failed to load vendors'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleToggleActive = async (vendor) => {
    try {
      if (vendor.isActive) {
        await deactivateVendor(vendor.id);
      } else {
        await reactivateVendor(vendor.id);
      }
      loadVendors();
    } catch {
      setError('Failed to update vendor status');
    }
  };

  const handleVerificationChange = async (vendorId, type) => {
    try {
      await updateVerification(vendorId, type);
      loadVendors();
    } catch {
      setError('Failed to update verification');
    }
  };

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin — Manage Vendors</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

      <div className="grid gap-4">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="bg-white border rounded-lg p-5 flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{vendor.businessName}</h2>
              <p className="text-sm text-gray-500">{vendor.user.email} · {vendor.category.name}</p>
              <p className="text-sm text-gray-500">
                ★ {vendor.avgRating.toFixed(1)} ({vendor.ratingCount})
              </p>
              <span
                className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                  vendor.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {vendor.isActive ? 'Active' : 'Deactivated'}
              </span>
            </div>

            <div className="flex flex-col items-end gap-2">
              <select
                value={vendor.verificationType}
                onChange={(e) => handleVerificationChange(vendor.id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="UNVERIFIED">Unverified</option>
                <option value="ID_VERIFIED">ID Verified</option>
                <option value="GST_REGISTERED">GST Registered</option>
              </select>

              <button
                onClick={() => handleToggleActive(vendor)}
                className={`text-sm px-3 py-1 rounded ${
                  vendor.isActive
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                {vendor.isActive ? 'Deactivate' : 'Reactivate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}