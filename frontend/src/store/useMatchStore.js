import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { getSocket } from '../../socket/socket.client';

export const useMatchStore = create((set) => ({
  matches: [],
  loadingMatches: false,
  userProfiles: [],
  loadingUserProfiles: false,
  swipeFeedback: null,

  getMyMatches: async () => {
    try {
      set({ loadingMatches: true });
      const response = await axiosInstance.get('/matches');
      set({ matches: response.data.matches });
    } catch (error) {
      set({ matches: [] });
      toast.error(error.response.data.message || 'Something went wrong');
    } finally {
      set({ loadingMatches: false });
    }
  },

  getUsersProfiles: async () => {
    try {
      set({ loadingUserProfiles: true });
      const response = await axiosInstance.get('/matches/my-feed');
      set({ userProfiles: response.data.users });
    } catch (error) {
      set({ userProfiles: [] });
      toast.error(error.response.data.message || 'Something went wrong');
    } finally {
      set({ loadingUserProfiles: false });
    }
  },

  swipeLeft: async (user) => {
    try {
      set({ swipeFeedback: 'passed' });
      await axiosInstance.post(`/matches/swipe-left/${user._id}`);
      // set((state) => ({
      //   userProfiles: state.userProfiles.filter((u) => u._id !== user._id),
      // }));
    } catch (error) {
      console.log('Error in swipe left', error);
      toast.error(error.response.data.message || 'Something went wrong');
    } finally {
      setTimeout(() => {
        set({ swipeFeedback: null });
      }, 1500);
    }
  },

  swipeRight: async (user) => {
    try {
      set({ swipeFeedback: 'liked' });
      await axiosInstance.post(`/matches/swipe-right/${user._id}`);
      // set((state) => ({
      //   userProfiles: state.userProfiles.filter((u) => u._id !== user._id),
      // }));
    } catch (error) {
      console.log('Error in swipe right', error);
      toast.error(error.response.data.message || 'Something went wrong');
    } finally {
      setTimeout(() => {
        set({ swipeFeedback: null });
      }, 1500);
    }
  },

  subScribeToNewMatches: () => {
    try {
      const socket = getSocket();
      socket.on('newMatch', (newMatch) => {
        set((state) => ({
          matches: [...state.matches, newMatch],
        }));
        toast.success('Its a match!');
      });
    } catch (error) {
      console.log('Error in subscribing to new matches', error);
      toast.error('Something went wrong');
    }
  },

  unSubscribeToNewMatches: () => {
    try {
      const socket = getSocket();
      socket.off('newMatch');
    } catch (error) {
      console.log('Error in unsubscribing to new matches', error);
    }
  },
}));
