import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useState } from "react";

type QueryClientProviderProps = {
  children: React.ReactNode;
};
export const QueryProvider = ({ children }: QueryClientProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};
