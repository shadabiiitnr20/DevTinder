import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { getSocket } from '../../socket/socket.client';
import { useAuthStore } from './useAuthStore';

export const useMessageStore = create((set) => ({
  messages: [],
  loading: true,

  sendMessage: async (content, receiverId) => {
    try {
      //mockup a message and show in the chat immediately
      set((state) => ({
        messages: [
          ...state.messages,
          {
            _id: Date.now(),
            sender: useAuthStore.getState().authUser._id,
            content,
          },
        ],
      }));
      await axiosInstance.post('/messages/send', {
        content,
        receiverId,
      });
      // const { data } = response.data;
      // console.log('message send', data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || 'Something went wrong');
    }
  },

  getMessages: async (userId) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get(
        `/messages/conversation/${userId}`
      );
      set({ messages: response.data.messages, loading: false });
    } catch (error) {
      console.log(error);
      set({ messages: [] });
    } finally {
      set({ loading: false });
    }
  },

  subscribeToMessages: () => {
    try {
      const socket = getSocket();
      socket.on('newMessage', ({ message }) => {
        set((state) => ({ messages: [...state.messages, message] }));
      });
    } catch (error) {
      console.log('Error in subscribing to new matches', error);
      toast.error('Something went wrong');
    }
  },

  unsubscribeFromMessages: () => {
    try {
      const socket = getSocket();
      socket.off('newMessage');
    } catch (error) {
      console.log('Error in unsubscribing to new messages', error);
    }
  },
}));
