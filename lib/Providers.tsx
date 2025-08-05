"use client";

import { Provider as ReduxProvider } from "react-redux";
import { store as reduxStore } from "@/lib/redux/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ReduxProvider store={reduxStore}>{children}</ReduxProvider>;
}
