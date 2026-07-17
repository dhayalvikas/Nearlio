import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Browse from './pages/customer/Browse';
import VendorList from './pages/customer/VendorList';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import VendorDetail from './pages/customer/VendorDetail';
import MyBookings from './pages/customer/MyBookings';

function App() {
  const { loading } = useAuth();

  if (loading) return null;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Browse />} />
        <Route path="/category/:categoryId" element={<VendorList />} />
        <Route path="/vendor/:vendorId" element={<VendorDetail />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </>
  );
}

export default App;