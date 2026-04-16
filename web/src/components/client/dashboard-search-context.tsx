"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type DashboardSearchContextValue = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
};

const DashboardSearchContext = createContext<DashboardSearchContextValue | null>(null);

export function DashboardSearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const value = useMemo(() => ({ searchQuery, setSearchQuery }), [searchQuery]);
  return <DashboardSearchContext.Provider value={value}>{children}</DashboardSearchContext.Provider>;
}

export function useDashboardSearch() {
  const ctx = useContext(DashboardSearchContext);
  if (!ctx) {
    throw new Error("useDashboardSearch must be used within DashboardSearchProvider");
  }
  return ctx;
}
