import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyFavorites, removeFavorite } from '../../api/bookings';

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

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (vendorId) => {
    try {
      await removeFavorite(vendorId);
      setFavorites(favorites.filter((f) => f.vendor.id !== vendorId));
    } catch {
      setError('Could not remove favorite');
    }
  };

  if (loading) return <p className="p-8 text-gray-500">Loading favorites...</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>

      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

      {favorites.length === 0 ? (
        <p className="text-gray-500">
          No favorites yet — browse vendors and tap "Add to Favorites" to save them here.
        </p>
      ) : (
        <div className="grid gap-4">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="bg-white border rounded-lg p-5 flex justify-between items-center"
            >
              <Link to={`/vendor/${fav.vendor.id}`} className="flex-1">
                <h2 className="font-semibold text-lg">{fav.vendor.businessName}</h2>
                <p className="text-sm text-gray-500 mt-1">{fav.vendor.location}</p>
                <div className="text-yellow-500 text-sm font-medium mt-1">
                  ★ {fav.vendor.avgRating.toFixed(1)} ({fav.vendor.ratingCount})
                </div>
              </Link>
              <button
                onClick={() => handleRemove(fav.vendor.id)}
                className="text-sm text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}