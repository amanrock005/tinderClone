import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useUserStore = create((set) => ({
  loading: false,
  updateProfile: async (data) => {
    try {
      set({ loading: true });
      await axiosInstance.put("/users/update", data);
      toast.success("profile updated successfully");
    } catch (err) {
      toast.error(err.response.data.message || "something went wrong");
    } finally {
      set({ loading: false });
    }
  },
}));
