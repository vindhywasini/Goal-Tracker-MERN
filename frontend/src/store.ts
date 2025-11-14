// src/store.ts
import create from "zustand";

export type User = { id: string; email: string; name?: string } | null;

interface AuthState {
  user: User;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const getInitialAuth = (): { user: User; token: string | null } => {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }
  try {
    const token = window.localStorage.getItem("token");
    const userRaw = window.localStorage.getItem("user");
    const user = userRaw ? (JSON.parse(userRaw) as User) : null;
    return { user, token };
  } catch {
    return { user: null, token: null };
  }
};

export const useAuthStore = create<AuthState>((set) => {
  const { user, token } = getInitialAuth();

  return {
    user,
    token,
    setAuth: (user, token) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("token", token);
        window.localStorage.setItem("user", JSON.stringify(user));
      }
      set({ user, token });
    },
    logout: () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
      }
      set({ user: null, token: null });
    },
  };
});
