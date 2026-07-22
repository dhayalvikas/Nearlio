import api from './axios';

export const createVendorProfile = (data) => api.post('/vendor/profile', data);
export const addVendorService = (data) => api.post('/vendor/services', data);
export const createSlot = (data) => api.post('/slots', data);
export const getVendorBookings = () => api.get('/bookings/vendor');
export const updateBookingStatus = (bookingId, data) => api.patch(`/bookings/${bookingId}/status`, data);
export const getVendorStats = () => api.get('/vendor/stats');
export const getVendorServices = (vendorId) => api.get(`/vendor/${vendorId}/services`);
export const getMyVendorProfile = () => api.get('/vendor/me');
export const getMySlots = () => api.get('/slots/mine');
export const deleteService = (id) => api.delete(`/vendor/services/${id}`);
export const deleteSlot = (id) => api.delete(`/slots/${id}`);