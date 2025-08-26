"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChevronDownIcon } from "lucide-react";
import day from "@/lib/day";
import { useUpdateAppointment } from "@/lib/tanstack-query/appointments/Mutations";

export default function RescheduleAppointment({
  appointmentData,
  onSuccessAction,
}: {
  appointmentData: any;
  onSuccessAction?: () => void;
}) {
  const { mutateAsync: updateAppointment, isPending } = useUpdateAppointment();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const rescheduleAppointment = async (date: Date) => {
    await updateAppointment({
      doc: { status: "scheduled", date: day(date).format("YYYY-MM-DD") },
      documentId: appointmentData?.id,
      onSuccess: () => {
        setDate(undefined);
        onSuccessAction?.();
      },
    });
  };

  return (
    <div className="w-full h-full border p-4 border-dashed flex flex-col gap-4 rounded-lg">
      <h3 className="font-medium">Re-schedule Appointment</h3>

      <div className="grid grid-cols-3 gap-3">
        <Label htmlFor="date" className="px-1 font-normal">
          Current Appointment Date
        </Label>

        <Button
          variant="outline"
          id="date"
          className="w-48 justify-between font-normal"
          disabled
        >
          {appointmentData?.date
            ? day(appointmentData?.date).format("DD MMM YYYY")
            : "Unknown"}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Label htmlFor="date" className="px-1 font-normal">
          New Appointment Date
        </Label>

        <Popover modal={true} open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-48 justify-between font-normal"
              disabled={isPending}
            >
              {date ? day(date).format("DD MMM YYYY") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              disabled={(date) => {
                return !day(date).isToday() && date < new Date();
              }}
              captionLayout="dropdown"
              onSelect={async (date) => {
                setDate(date);
                setOpen(false);

                if (date) await rescheduleAppointment(date);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
