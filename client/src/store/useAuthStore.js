import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  checkingAuth: true,

  signup: async ({ name, email, password, age, gender, genderPreference }) => {
    try {
    } catch (err) {}
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  },
}));
