import api from './axios';

export const getCategories = () => api.get('/categories');
export const getVendorsByCategory = (categoryId) => api.get(`/categories/${categoryId}/vendors`);
export const getVendorProfile = (vendorId) => api.get(`/vendor/${vendorId}`);
export const getVendorServices = (vendorId) => api.get(`/vendor/${vendorId}/services`);
export const getOpenSlots = (offeringId) => api.get(`/slots/offering/${offeringId}`);
export const getNearbyVendors = (categoryId, lat, lng, radiusKm = 10) =>
  api.get(`/categories/${categoryId}/vendors/nearby`, { params: { lat, lng, radiusKm } });