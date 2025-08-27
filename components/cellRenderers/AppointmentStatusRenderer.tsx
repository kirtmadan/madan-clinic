import React from "react";
import { cn } from "@/lib/utils";

const statusClasses = {
  scheduled: "bg-yellow-100 text-yellow-700 border-yellow-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
} as const;

type Status = keyof typeof statusClasses;

export default function AppointmentStatusRenderer({
  status,
  children,
}: {
  children?: React.ReactNode;
  status: Status;
}) {
  return (
    <span
      className={cn(
        "py-1 text-sm px-2 rounded-lg border",
        statusClasses[status],
      )}
    >
      {children ? children : status}
    </span>
  );
}
