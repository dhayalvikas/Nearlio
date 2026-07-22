import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { registerUser } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CUSTOMER', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await registerUser(form);
      login(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-10">
      <Card className="w-full max-w-sm">
        <div className="text-center mb-6">
          <UserPlus className="mx-auto mb-2 text-terracotta" size={22} strokeWidth={1.5} />
          <h1 className="font-display text-2xl text-ink">Join Nearlio</h1>
          <p className="text-sm text-ink/50 mt-1">Find help, or offer it</p>
        </div>

        {error && <p className="text-sindoor text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required />
          <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
          <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
          <Input label="Phone (optional)" name="phone" value={form.phone} onChange={handleChange} />
          <Select label="I am a" name="role" value={form.role} onChange={handleChange}>
            <option value="CUSTOMER">Customer — looking for services</option>
            <option value="VENDOR">Vendor — offering services</option>
          </Select>
          <Button type="submit" variant="primary" className="w-full justify-center" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        <p className="text-sm text-center text-ink/60 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-terracotta hover:underline">Login</Link>
        </p>
      </Card>
    </div>
  );
}