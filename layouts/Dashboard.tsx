"use client";

import { useState } from "react";

import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";

import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}

export default function Dashboard({ children }: Props) {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="w-full h-full flex">
      {showSidebar && <Sidebar />}

      <div
        className={cn(
          "flex flex-col relative w-full overflow-x-auto transition-[width] duration-300",
        )}
      >
        <Header />

        <main
          className={cn(
            "w-full h-full overflow-x-auto px-8 my-6 ml-auto bg-background",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
