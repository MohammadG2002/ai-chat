"use client";
import { useUser } from "@clerk/nextjs";
import { createContext, ReactNode, useContext } from "react";
import { UserResource } from "@clerk/types";

type AppContextType = {
  user: UserResource | null | undefined;
};

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }
  return context;
};

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();

  const value = { user };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
