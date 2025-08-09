"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/setup";
import { redirect, usePathname } from "next/navigation";

export default function RouteProtector() {
  const pathname = usePathname();
  const [user, loading] = useAuthState(auth);
  console.log(user, loading);

  if (!loading && !user && pathname !== "/login") {
    redirect("/login");
  }
}
