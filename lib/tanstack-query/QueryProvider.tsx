"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface Props {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: Props) {
  const queryClientOptions = {
    defaultOptions: {
      queries: {
        // staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  };

  const [queryClient] = useState(() => new QueryClient(queryClientOptions));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
