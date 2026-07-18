import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ArrowLeft, Banknote, ShieldCheck, Users } from 'lucide-react';
import { getVendorsByCategory } from '../../api/catalog';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

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

  if (loading) return <Spinner label="Finding vendors nearby..." />;
  if (error) return <p className="p-8 text-sindoor text-sm">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition mb-6"
      >
        <ArrowLeft size={15} /> Back to categories
      </Link>

      <h1 className="font-display text-3xl text-ink mb-6">
        {vendors[0]?.category?.name || 'Vendors'}
      </h1>

      {vendors.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No vendors here yet"
          description="This category doesn't have anyone listed nearby yet — check back soon."
        />
      ) : (
        <div className="grid gap-4">
          {vendors.map((vendor) => (
            <Link key={vendor.id} to={`/vendor/${vendor.id}`}>
              <Card className="hover:border-terracotta hover:shadow-sm transition flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg text-ink">{vendor.businessName}</h2>
                    {vendor.verificationType !== 'UNVERIFIED' && (
                      <ShieldCheck size={16} className="text-banyan" strokeWidth={2} />
                    )}
                  </div>
                  <p className="text-sm text-ink/50 mt-1">{vendor.location}</p>
                  <p className="text-sm text-ink/60 mt-1.5">{vendor.tags}</p>
                </div>

                <div className="text-right shrink-0 ml-4">
                  <div className="flex items-center justify-end gap-1 text-terracotta font-medium">
                    <Star size={15} fill="currentColor" />
                    {vendor.avgRating.toFixed(1)}
                    <span className="text-ink/40 font-normal">({vendor.ratingCount})</span>
                  </div>
                  {vendor.acceptsCash && (
                    <div className="flex items-center justify-end gap-1 text-xs text-banyan mt-2">
                      <Banknote size={13} /> Cash accepted
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}