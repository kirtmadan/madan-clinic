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
import {
  useAddAppointment,
  useUpdateAppointment,
} from "@/lib/tanstack-query/appointments/Mutations";
import dayjs from "dayjs";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function RescheduleAppointment({
  appointmentData,
  onSuccessAction,
}: {
  appointmentData: any;
  onSuccessAction?: () => void;
}) {
  const { mutateAsync: updateAppointment, isPending } = useUpdateAppointment();
  const { mutateAsync: addAppointment } = useAddAppointment();

  const [open, setOpen] = useState(false);
  const [reOpen, setReOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [reDate, setReDate] = useState<Date | undefined>(undefined);

  const checkDuplicateAppointment = async (doc: { date: string }) => {
    try {
      const supabase = createClient();

      const { data: existing, error: fetchError } = await supabase
        .from("appointments")
        .select("*")
        .eq("patient_id", appointmentData?.patient?.id)
        .neq("status", "completed")
        .neq("status", "p_completed")
        .eq("date", doc?.date);

      if (fetchError) {
        throw new Error("Error adding appointment. Please try again.");
      } else if (existing.length > 0) {
        throw new Error(
          "An appointment for the patient is already existing on the date " +
            dayjs(doc?.date).format("DD MMM YYYY"),
        );
      }
    } catch (error: any) {
      console.log(error);
      return {
        error: error?.message || "Something went wrong. Please try again.",
      };
    }
  };

  const rescheduleAppointment = async (date: Date) => {
    const check = await checkDuplicateAppointment({
      date: day(date).format("YYYY-MM-DD"),
    });

    if (check?.error) {
      setReDate(undefined);
      return toast.error(check?.error, {
        position: "top-right",
      });
    }

    await updateAppointment({
      doc: {
        status: "rescheduled",
        call_status: 0,
        rs_date: day().format("YYYY-MM-DD"),
        date: day(date).format("YYYY-MM-DD"),
      },
      documentId: appointmentData?.id,
      onSuccess: () => {
        setReDate(undefined);
        onSuccessAction?.();
      },
    });
  };

  const completeAndAppointNew = async (date: Date) => {
    const check = await checkDuplicateAppointment({
      date: day(date).format("YYYY-MM-DD"),
    });

    if (check?.error) {
      setDate(undefined);
      return toast.error(check?.error, {
        position: "top-right",
      });
    }

    await updateAppointment({
      doc: {
        status: "completed",
      },
      documentId: appointmentData?.id,
      onSuccess: () => {
        setDate(undefined);
        onSuccessAction?.();
      },
    });

    await addAppointment({
      doc: {
        patient_id: appointmentData?.patient?.id,
        date: day(date).format("YYYY-MM-DD"),
        status: "scheduled",
        call_status: 0,
        notes: undefined,
        created_at: new Date().toISOString(),
      },
      forced: true,
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

        <Popover modal open={open} onOpenChange={setOpen}>
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

                if (date) await completeAndAppointNew(date);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Label htmlFor="date" className="px-1 font-normal">
          Reschedule Date
        </Label>

        <Popover modal open={reOpen} onOpenChange={setReOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-48 justify-between font-normal"
              disabled={isPending}
            >
              {reDate ? day(reDate).format("DD MMM YYYY") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={reDate}
              disabled={(date) => {
                return !day(date).isToday() && date < new Date();
              }}
              captionLayout="dropdown"
              onSelect={async (date) => {
                setReDate(date);
                setReOpen(false);

                if (date) await rescheduleAppointment(date);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
