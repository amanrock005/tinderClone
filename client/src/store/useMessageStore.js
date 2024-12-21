import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set) => ({
  messages: [],
  loading: true,
  sendMessage: async (receiverId, content) => {
    try {
      // show message in chat immediately
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
      const res = await axiosInstance.post("/messages/send", {
        receiverId,
        content,
      });
      // console.log("message sent", res.data);
    } catch (err) {
      toast.error(err.response.data.message || "Something went wrong");
    }
  },
  getMessage: async (userId) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get(`/messages/conversation/${userId}`);
      set({ messages: res.data.message });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  subscribeToMessages: () => {
    const socket = getSocket();
    socket.on("newMessages", ({ message }) => {
      set((state) => ({ messages: [...state.messages, message] }));
    });
  },
  unsubscribeFromMessages: () => {
    const socket = getSocket();
    socket.off("newMessage");
  },
}));
