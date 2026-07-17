import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../api/catalog';

export default function Browse() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setError('Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8 text-gray-500">Loading categories...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Browse Services</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.id}`}
            className="bg-white border rounded-lg p-6 text-center hover:shadow-md hover:border-blue-400 transition"
          >
            <span className="font-medium">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}