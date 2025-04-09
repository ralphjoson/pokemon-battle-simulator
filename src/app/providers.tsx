"use client";

import { ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryClientConfig,
} from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const queryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes (data is fresh)
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (keep inactive data in memory)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
};

const queryClient = new QueryClient(queryConfig);

// Persist cache to localStorage (client-side only)
if (typeof window !== "undefined") {
  const localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
    key: "pokemon-battle-cache",
  });

  persistQueryClient({
    queryClient,
    persister: localStoragePersister,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
