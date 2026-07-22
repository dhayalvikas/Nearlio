import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { getMyFavorites, removeFavorite } from '../../api/bookings';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFavorites = () => {
    getMyFavorites()
      .then((res) => setFavorites(res.data))
      .catch(() => setError('Failed to load favorites'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadFavorites(); }, []);

  const handleRemove = async (vendorId) => {
    try {
      await removeFavorite(vendorId);
      setFavorites(favorites.filter((f) => f.vendor.id !== vendorId));
    } catch {
      setError('Could not remove favorite');
    }
  };

  if (loading) return <Spinner label="Loading favorites..." />;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-ink mb-6">My Favorites</h1>

      {error && <p className="text-sindoor text-sm mb-4">{error}</p>}

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description='Browse vendors and tap "Add to Favorites" to save them here.'
        />
      ) : (
        <div className="grid gap-4">
          {favorites.map((fav) => (
            <Card key={fav.id} className="flex justify-between items-center">
              <Link to={`/vendor/${fav.vendor.id}`} className="flex-1">
                <h2 className="font-display text-lg text-ink">{fav.vendor.businessName}</h2>
                <p className="text-sm text-ink/50 mt-1">{fav.vendor.location}</p>
                <div className="flex items-center gap-1 text-terracotta text-sm font-medium mt-1">
                  <Star size={13} fill="currentColor" />
                  {fav.vendor.avgRating.toFixed(1)}
                  <span className="text-ink/40 font-normal">({fav.vendor.ratingCount})</span>
                </div>
              </Link>
              <Button variant="danger" onClick={() => handleRemove(fav.vendor.id)}>
                Remove
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}