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
    <div className="w-full h-full flex gap-6">
      {showSidebar && <Sidebar />}

      <div
        className={cn("flex flex-col w-full transition-[width] duration-300")}
      >
        <Header
          showMenu
          menuButtonFunction={() => setShowSidebar((prev) => !prev)}
        />

        <main
          className={cn("w-full h-full overflow-x-auto ml-auto bg-background")}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
