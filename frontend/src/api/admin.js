import api from './axios';

export const getAllUsers = () => api.get('/admin/users');
export const getAllVendors = () => api.get('/admin/vendors');
export const deactivateVendor = (id) => api.patch(`/admin/vendors/${id}/deactivate`);
export const reactivateVendor = (id) => api.patch(`/admin/vendors/${id}/reactivate`);
export const updateVerification = (id, type) => api.patch(`/admin/vendors/${id}/verification?type=${type}`);