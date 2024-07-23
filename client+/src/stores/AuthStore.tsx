import { create } from "zustand";
interface AuthState {
  isAuthenticated: boolean;
  login: (token: string) => void; // Accept token as parameter
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: typeof window !== 'undefined' && !!localStorage.getItem("token"), // Check if token exists in localStorage
  login: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("token", token); // Replace with actual token storage logic
      set({ isAuthenticated: true });
    }
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
      set({ isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
