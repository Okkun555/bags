import { useMe } from "@/repositories/me/useMeApi";
import type { CurrentUser } from "@/types/user";
import { createContext, useContext, type ReactNode } from "react";

type AuthContextValue = {
  currentUser: CurrentUser | undefined;
  isLoading: boolean;
  hasError: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, error } = useMe();

  const value: AuthContextValue = {
    currentUser: {
      userId: data?.id ?? 0,
      email: data?.email ?? "",
    },
    isLoading: isLoading,
    hasError: !!error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
