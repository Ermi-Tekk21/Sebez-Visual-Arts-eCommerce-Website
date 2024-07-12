import { create } from "zustand";
interface AuthState {
  isAuthenticated: boolean;
  login: (token: string) => void; // Accept token as parameter
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !(!localStorage.getItem("token")), // Check if token exists in localStorage
  login: (token: string) => {
    localStorage.setItem("token", token); // Replace with actual token storage logic
    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ isAuthenticated: false });
    window.location.reload();
  },
}));

export default useAuthStore;
