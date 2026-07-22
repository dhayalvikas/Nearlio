import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, Users, Store, Mail, Phone } from 'lucide-react';
import { getAllVendors, getAllUsers, deactivateVendor, reactivateVendor, updateVerification } from '../../api/admin';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

const verificationIcon = { GST_REGISTERED: ShieldCheck, ID_VERIFIED: ShieldAlert, UNVERIFIED: ShieldX };
const verificationColor = { GST_REGISTERED: 'text-banyan', ID_VERIFIED: 'text-terracotta', UNVERIFIED: 'text-ink/30' };

const roleColor = { ADMIN: 'text-sindoor', VENDOR: 'text-terracotta', CUSTOMER: 'text-indigo-600' };

export default function AdminDashboard() {
  const [tab, setTab] = useState('vendors');
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAll = () => {
    Promise.all([getAllVendors(), getAllUsers()])
      .then(([vendorsRes, usersRes]) => {
        setVendors(vendorsRes.data);
        setUsers(usersRes.data);
      })
      .catch(() => setError('Failed to load platform data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAll(); }, []);

  const handleToggleActive = async (vendor) => {
    try {
      if (vendor.isActive) await deactivateVendor(vendor.id);
      else await reactivateVendor(vendor.id);
      loadAll();
    } catch {
      setError('Failed to update vendor status');
    }
  };

  const handleVerificationChange = async (vendorId, type) => {
    try {
      await updateVerification(vendorId, type);
      loadAll();
    } catch {
      setError('Failed to update verification');
    }
  };

  if (loading) return <Spinner label="Loading platform data..." />;

  const activeCount = vendors.filter((v) => v.isActive).length;
  const unverifiedCount = vendors.filter((v) => v.verificationType === 'UNVERIFIED').length;
  const customerCount = users.filter((u) => u.role === 'CUSTOMER').length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-ink mb-6">Admin</h1>

      {error && <p className="text-sindoor text-sm mb-4">{error}</p>}

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <Store className="mx-auto mb-2 text-ink/60" size={18} strokeWidth={1.5} />
          <div className="font-display text-2xl text-ink">{vendors.length}</div>
          <div className="text-xs text-ink/50 mt-1">Vendors</div>
        </Card>
        <Card className="text-center">
          <ShieldCheck className="mx-auto mb-2 text-banyan" size={18} strokeWidth={1.5} />
          <div className="font-display text-2xl text-banyan">{activeCount}</div>
          <div className="text-xs text-ink/50 mt-1">Active</div>
        </Card>
        <Card className="text-center">
          <ShieldX className="mx-auto mb-2 text-terracotta" size={18} strokeWidth={1.5} />
          <div className="font-display text-2xl text-terracotta">{unverifiedCount}</div>
          <div className="text-xs text-ink/50 mt-1">Unverified</div>
        </Card>
        <Card className="text-center">
          <Users className="mx-auto mb-2 text-indigo-600" size={18} strokeWidth={1.5} />
          <div className="font-display text-2xl text-indigo-600">{customerCount}</div>
          <div className="text-xs text-ink/50 mt-1">Customers</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-ink/10">
        <button
          onClick={() => setTab('vendors')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            tab === 'vendors' ? 'border-terracotta text-ink' : 'border-transparent text-ink/50 hover:text-ink'
          }`}
        >
          Vendors
        </button>
        <button
          onClick={() => setTab('users')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            tab === 'users' ? 'border-terracotta text-ink' : 'border-transparent text-ink/50 hover:text-ink'
          }`}
        >
          Users
        </button>
      </div>

      {tab === 'vendors' && (
        vendors.length === 0 ? (
          <EmptyState icon={Store} title="No vendors yet" description="Vendors will appear here once they register." />
        ) : (
          <div className="grid gap-4">
            {vendors.map((vendor) => {
              const VerifIcon = verificationIcon[vendor.verificationType];
              return (
                <Card key={vendor.id} className="flex justify-between items-center gap-4">
                  <div className="flex items-start gap-3">
                    <VerifIcon className={`mt-0.5 shrink-0 ${verificationColor[vendor.verificationType]}`} size={20} />
                    <div>
                      <h3 className="font-display text-base text-ink">{vendor.businessName}</h3>
                      <p className="text-xs text-ink/50 mt-0.5">{vendor.user.email} · {vendor.category.name}</p>
                      <p className="text-xs text-ink/50 mt-0.5 font-mono">★ {vendor.avgRating.toFixed(1)} ({vendor.ratingCount})</p>
                      <span className="inline-block mt-2">
                        <Badge variant={vendor.isActive ? 'completed' : 'cancelled'}>
                          {vendor.isActive ? 'Active' : 'Deactivated'}
                        </Badge>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Select
                      value={vendor.verificationType}
                      onChange={(e) => handleVerificationChange(vendor.id, e.target.value)}
                      className="text-xs"
                    >
                      <option value="UNVERIFIED">Unverified</option>
                      <option value="ID_VERIFIED">ID Verified</option>
                      <option value="GST_REGISTERED">GST Registered</option>
                    </Select>
                    <Button variant={vendor.isActive ? 'danger' : 'success'} onClick={() => handleToggleActive(vendor)}>
                      {vendor.isActive ? 'Deactivate' : 'Reactivate'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      )}

      {tab === 'users' && (
        users.length === 0 ? (
          <EmptyState icon={Users} title="No users yet" description="Registered users will appear here." />
        ) : (
          <div className="grid gap-3">
            {users.map((u) => (
              <Card key={u.id} className="flex justify-between items-center">
                <div>
                  <h3 className="font-display text-base text-ink">{u.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-ink/50 mt-1">
                    <span className="flex items-center gap-1"><Mail size={12} /> {u.email}</span>
                    {u.phone && <span className="flex items-center gap-1"><Phone size={12} /> {u.phone}</span>}
                  </div>
                </div>
                <span className={`text-xs font-mono font-medium ${roleColor[u.role]}`}>{u.role}</span>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
}