import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench, Zap, Scissors, GraduationCap, Sparkles,
  Hammer, Paintbrush, Bug, Snowflake, LayoutGrid, Search
} from 'lucide-react';
import { getCategories } from '../../api/catalog';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

const categoryIcons = {
  'Plumbing': Wrench,
  'Electrical': Zap,
  'Salon & Beauty': Scissors,
  'Tutoring': GraduationCap,
  'Cleaning': Sparkles,
  'Appliance Repair': Hammer,
  'Carpentry': Hammer,
  'Painting': Paintbrush,
  'Pest Control': Bug,
  'AC & Refrigeration': Snowflake,
};

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

  return (
    <div>
      {/* Hero */}
      <section className="bg-cream px-6 py-20 border-b border-ink/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs tracking-widest text-terracotta uppercase mb-4">
            For your street, your neighbours
          </p>
          <h1 className="font-display text-5xl font-semibold text-ink leading-tight mb-4">
            Find local help your neighbours already trust.
          </h1>
          <p className="text-ink/60 text-lg max-w-xl mx-auto">
            Plumbers, electricians, tutors and more — booked directly,
            paid fairly, rated by people who actually live nearby.
          </p>
        </div>
      </section>

      {/* Category grid */}
      <section className="px-6 py-14 max-w-5xl mx-auto">
        <h2 className="font-display text-2xl text-ink mb-6">What do you need?</h2>

        {loading && <Spinner label="Loading categories..." />}
        {error && <p className="text-sindoor text-sm">{error}</p>}

        {!loading && !error && categories.length === 0 && (
          <EmptyState
            icon={LayoutGrid}
            title="No categories yet"
            description="Categories will appear here once the backend is running."
          />
        )}

        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.name] || Search;
              return (
                <Link key={cat.id} to={`/category/${cat.id}`}>
                  <Card className="text-center hover:border-terracotta hover:shadow-sm transition group">
                    <Icon
                      className="mx-auto mb-2 text-ink/40 group-hover:text-terracotta transition"
                      size={26}
                      strokeWidth={1.5}
                    />
                    <span className="font-medium text-sm text-ink">{cat.name}</span>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}