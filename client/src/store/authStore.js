import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: !!localStorage.getItem('accessToken'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('accessToken', res.data.accessToken);
        set({ user: res.data.user, isLoggedIn: true, isLoading: false });
        return { success: true };
      }
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('accessToken');
      set({ user: null, isLoggedIn: false });
    }
  },

  checkAuth: async () => {
    if (!localStorage.getItem('accessToken')) return;
    set({ isLoading: true });
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        set({ user: res.data.user, isLoggedIn: true });
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
      set({ user: null, isLoggedIn: false });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: (userData) => {
    set((state) => ({ user: { ...state.user, ...userData } }));
  },

  updateProfile: async (userData) => {
    set({ isLoading: true });
    try {
      const { user } = useAuthStore.getState();
      const userId = user?.id || user?._id;
      if (!userId) throw new Error('User ID not found');

      const res = await api.put(`/users/${userId}`, userData);
      if (res.data.success) {
        // Ensure standard 'id' field in store
        const updatedUser = res.data.user;
        if (!updatedUser.id && updatedUser._id) updatedUser.id = updatedUser._id;
        
        set({ user: updatedUser, isLoading: false });
        return { success: true };
      }
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
  }
}));
