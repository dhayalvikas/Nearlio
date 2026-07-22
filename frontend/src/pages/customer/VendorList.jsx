import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ArrowLeft, Banknote, ShieldCheck, Users, MapPin, Navigation } from 'lucide-react';
import { getVendorsByCategory, getNearbyVendors } from '../../api/catalog';
import { useGeolocation } from '../../hooks/useGeolocation';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import VendorMap from '../../components/VendorMap';

export default function VendorList() {
  const { categoryId } = useParams();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nearbyMode, setNearbyMode] = useState(false);

  const { location, error: geoError, loading: geoLoading } = useGeolocation();

  const loadAll = () => {
    setLoading(true);
    getVendorsByCategory(categoryId)
      .then((res) => setVendors(res.data))
      .catch(() => setError('Failed to load vendors'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAll(); }, [categoryId]);

  const handleNearbySearch = () => {
    if (!location) return;
    setLoading(true);
    setNearbyMode(true);
    getNearbyVendors(categoryId, location.lat, location.lng, 15)
      .then((res) => setVendors(res.data))
      .catch(() => setError('Failed to load nearby vendors'))
      .finally(() => setLoading(false));
  };

  const handleShowAll = () => {
    setNearbyMode(false);
    loadAll();
  };

  if (loading) return <Spinner label={nearbyMode ? 'Finding vendors near you...' : 'Loading vendors...'} />;
  if (error) return <p className="p-8 text-sindoor text-sm">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition mb-6">
        <ArrowLeft size={15} /> Back to categories
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl text-ink">{vendors[0]?.category?.name || 'Vendors'}</h1>

        {!nearbyMode ? (
          <Button
            variant="outline"
            onClick={handleNearbySearch}
            disabled={geoLoading || !location}
          >
            <Navigation size={14} />
            {geoLoading ? 'Locating...' : 'Show Nearby'}
          </Button>
        ) : (
          <Button variant="ghost" onClick={handleShowAll}>Show All</Button>
        )}
      </div>

      {nearbyMode && location && (
        <div className="mb-6">
          <VendorMap vendors={vendors} center={location} />
        </div>
      )}

      {geoError && !nearbyMode && (
        <p className="text-xs text-ink/40 mb-4">
          Location unavailable — enable location access to see nearby vendors.
        </p>
      )}

      {vendors.length === 0 ? (
        <EmptyState
          icon={Users}
          title={nearbyMode ? 'No vendors nearby' : 'No vendors here yet'}
          description={nearbyMode ? 'Try expanding your search or check back later.' : "This category doesn't have anyone listed nearby yet."}
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
                  <p className="text-sm text-ink/50 mt-1 flex items-center gap-1">
                    <MapPin size={12} /> {vendor.location}
                  </p>
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