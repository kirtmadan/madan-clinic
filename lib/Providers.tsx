"use client";

import { Provider as ReduxProvider } from "react-redux";
import { store as reduxStore } from "@/lib/redux/store";
import QueryProvider from "@/lib/tanstack-query/QueryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={reduxStore}>
      <QueryProvider>{children}</QueryProvider>
    </ReduxProvider>
  );
}
