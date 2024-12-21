import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";

export const useMatchStore = create((set) => ({
  matches: [],
  isLoadingMyMatches: false,
  isLoadingUserProfiles: false,
  userProfiles: [],
  swipeFeedback: null,

  getMyMatches: async () => {
    try {
      set({ isLoadingMyMatches: true });
      const res = await axiosInstance.get("/matches");
      set({ matches: res.data.matches });
    } catch (err) {
      set({ matches: [] });
      toast.error(err.response.data.message || "something went wrong");
    } finally {
      set({ isLoadingMyMatches: false });
    }
  },
  getUserProfiles: async () => {
    try {
      set({ isLoadingUserProfiles: true });
      const res = await axiosInstance.get("/matches/user-profiles");
      set({ userProfiles: res.data.users });
    } catch (err) {
      set({ userProfiles: [] });
      toast.error(err.response.data.message || "something went wrong");
    } finally {
      set({ isLoadingUserProfiles: false });
    }
  },

  swipeLeft: async (user) => {
    try {
      set({ swipeFeedback: "passed" });
      await axiosInstance.post("/matches/swipe-left/" + user._id);
    } catch (err) {
      console.log(err);
      toast.error("failed to swipe left");
    } finally {
      setTimeout(() => set({ swipeFeedback: null }), 1500);
    }
  },

  swipeRight: async (user) => {
    try {
      set({ swipeFeedback: "liked" });
      await axiosInstance.post("/matches/swipe-right/" + user._id);
    } catch (err) {
      console.log(err);
      toast.error("failed to swipe right");
    } finally {
      setTimeout(() => set({ swipeFeedback: null }), 1500);
    }
  },

  subscribeToNewMatches: () => {
    try {
      const socket = getSocket();
      socket.on("newMatch", (newMatch) => {
        set((state) => ({
          matches: [...state.matches, newMatch],
        }));
        toast.success("You got a new match!");
      });
    } catch (err) {
      console.error(err);
    }
  },

  unsubscribeFromNewMatches: () => {
    try {
      const socket = getSocket();
      socket.off("newMatch");
    } catch (err) {
      console.error(err);
    }
  },
}));
