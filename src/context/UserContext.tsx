"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type UserRole = "USER" | "ADMIN";

interface AuthUser {
  username: string;
  displayName: string;
  role: UserRole;
  imagePath?: string;
}

interface UserContextType {
  currentUser: string | null;
  currentUsername: string | null;
  role: UserRole | null;
  isAdmin: boolean;
  imagePath: string | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const USER_STORAGE_KEY = "userSession";

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedSession = localStorage.getItem(USER_STORAGE_KEY);

    if (storedSession) {
      try {
        setUser(JSON.parse(storedSession) as AuthUser);
        return;
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    const legacyUser = localStorage.getItem("currentUser");
    if (legacyUser) {
      setUser({
        username: legacyUser,
        displayName: legacyUser,
        role: "USER",
      });
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem("currentUser", user.displayName);
      if (user.imagePath) {
        localStorage.setItem("userImage", user.imagePath);
      }
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userImage");
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        currentUser: user?.displayName ?? null,
        currentUsername: user?.username ?? null,
        role: user?.role ?? null,
        isAdmin: user?.role === "ADMIN",
        imagePath: user?.imagePath ?? null,
        login: setUser,
        logout: () => setUser(null),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
