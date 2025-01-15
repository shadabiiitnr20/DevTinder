import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  checkingAuth: true,
  loading: false,

  signup: async (signUpData) => {
    console.log(signUpData);
    try {
      set({ loading: true });
      const response = await axiosInstance.post('/auth/signup', signUpData);
      const { data } = response.data;
      set({ authUser: data });
      toast.success('Account created successfully');
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong');
    } finally {
      set({ loading: false });
    }
  },

  login: async (loginData) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.post('/auth/login', loginData);
      const { data } = response.data;
      set({ authUser: data });
      toast.success('Logged In successfully');
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong');
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post('/auth/logout');
      if (response.status === 200) set({ authUser: null });
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong');
    }
  },

  checkAuth: async () => {
    console.log('checkAuth');
    try {
      const response = await axiosInstance.get('/auth/me');
      set({ authUser: response.data.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ checkingAuth: false });
    }
  },
}));
