"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useTime } from "@/context/TimeContext";
import { useState } from "react";
import dayjs from "dayjs";
import { DateRange } from "react-day-picker";

export default function TimeSelector() {
  const { timeState, setTimeState } = useTime();

  const [openEt, setOpenEt] = useState<boolean>(false);

  return (
    <div className="flex items-center justify-end gap-4">
      <div className="flex flex-col gap-3">
        <Popover open={openEt} onOpenChange={setOpenEt}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="justify-between font-normal"
            >
              {timeState?.from
                ? `${dayjs(timeState?.from)?.format("DD MMM YYYY")} - ${dayjs(timeState?.to)?.format("DD MMM YYYY")}`
                : "Select date range"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={timeState?.from}
              selected={timeState}
              captionLayout="dropdown"
              numberOfMonths={2}
              onSelect={(dateRange: DateRange | undefined) => {
                if (dateRange?.from && dateRange?.to) {
                  const start = dayjs(dateRange.from).startOf("day");
                  const end = dayjs(dateRange.to).endOf("day");
                  const diff = end.diff(start, "month", true); // difference in months (float)

                  if (diff > 1) {
                    // If the range exceeds 1 month, clamp it
                    dateRange.to = start.add(1, "month").toDate();
                  }
                }

                setTimeState({
                  value: "custom",
                  from: dateRange?.from,
                  to: dateRange?.to,
                });
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
