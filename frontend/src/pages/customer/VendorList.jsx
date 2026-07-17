import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVendorsByCategory } from '../../api/catalog';

export default function VendorList() {
  const { categoryId } = useParams();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getVendorsByCategory(categoryId)
      .then((res) => setVendors(res.data))
      .catch(() => setError('Failed to load vendors'))
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) return <p className="p-8 text-gray-500">Loading vendors...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="p-8">
      <Link to="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Back to categories
      </Link>
      <h1 className="text-2xl font-bold mb-6">
        {vendors[0]?.category?.name || 'Vendors'}
      </h1>

      {vendors.length === 0 ? (
        <p className="text-gray-500">No vendors in this category yet.</p>
      ) : (
        <div className="grid gap-4">
          {vendors.map((vendor) => (
            <Link
              key={vendor.id}
              to={`/vendor/${vendor.id}`}
              className="bg-white border rounded-lg p-5 hover:shadow-md hover:border-blue-400 transition flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">{vendor.businessName}</h2>
                <p className="text-sm text-gray-500 mt-1">{vendor.location}</p>
                <p className="text-sm text-gray-600 mt-1">{vendor.tags}</p>
              </div>
              <div className="text-right">
                <div className="text-yellow-500 font-medium">
                  ★ {vendor.avgRating.toFixed(1)} ({vendor.ratingCount})
                </div>
                {vendor.acceptsCash && (
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded mt-1 inline-block">
                    Cash accepted
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}