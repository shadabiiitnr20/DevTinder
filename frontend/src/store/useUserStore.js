import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useUserStore = create((set) => ({
  loading: false,
  //TODO: Re check the update api again
  updateProfile: async (updatedData) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.put(
        '/users/update-profile',
        updatedData
      );
      const { data } = response.data;
      useAuthStore.getState().setAuthUser(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong');
    } finally {
      set({ loading: false });
    }
  },
}));
