"use client";

import type { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store as reduxStore } from "@/lib/redux/store";
import QueryProvider from "@/lib/tanstack-query/QueryProvider";
import { TimeContextProvider } from "@/context/TimeContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={reduxStore}>
      <QueryProvider>
        <TimeContextProvider>{children}</TimeContextProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
