import api from './axios';

export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings/my');
export const addFavorite = (vendorId) => api.post(`/favorites/${vendorId}`);
export const removeFavorite = (vendorId) => api.delete(`/favorites/${vendorId}`);
export const getMyFavorites = () => api.get('/favorites');
export const submitRating = (data) => api.post('/ratings', data);
export const cancelBooking = (bookingId, reason) =>
  api.patch(`/bookings/${bookingId}/status`, { status: 'CANCELLED', cancellationReason: reason });