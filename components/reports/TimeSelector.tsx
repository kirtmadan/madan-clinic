"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TimeOptions = [
  {
    label: "Today",
    value: "1d",
  },
  {
    label: "This week",
    value: "7d",
  },
  {
    label: "This month",
    value: "30d",
  },
];

export default function TimeSelector({
  timeRange,
  setTimeRangeAction,
}: {
  timeRange: string;
  setTimeRangeAction: (timeRange: string) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-4">
      <Select value={timeRange} onValueChange={setTimeRangeAction}>
        <SelectTrigger
          className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
          size="sm"
          aria-label="Select a value"
        >
          <SelectValue placeholder="Last 3 months" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {TimeOptions.map((item) => (
            <SelectItem
              value={item.value}
              key={item.value}
              className="rounded-lg"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
