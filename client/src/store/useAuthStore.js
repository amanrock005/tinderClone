import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { disconnectSocket, initializeSocket } from "../socket/socket.client";

export const useAuthStore = create((set) => ({
  authUser: null,
  checkingAuth: true,
  loading: false,

  signup: async (signupData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/auth/signup", signupData);
      set({ authUser: res.data.user });
      initializeSocket(res.data.user._id);
      toast.success("account created successfully");
    } catch (err) {
      console.log("err in zustand signup ", err);
      toast.error(err.response.data.message || "something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  login: async (loginData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/auth/login", loginData);
      set({ authUser: res.data.user });
      initializeSocket(res.data.user._id);
      toast.success("logged in successfully");
    } catch (err) {
      toast.error(err.response.data.message || "something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      disconnectSocket();
      if (res.status === 200) {
        set({ authUser: null });
      }
    } catch (err) {
      toast.error(err.response.data.message || "something went wrong");
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      initializeSocket(res.data.user._id);
      set({ authUser: res.data.user });
    } catch (err) {
      set({ authUser: null });
      console.log(err);
    } finally {
      set({ checkingAuth: false });
    }
  },
}));
