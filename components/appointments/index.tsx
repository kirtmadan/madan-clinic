"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChevronDownIcon, PlusIcon, XCircleIcon } from "lucide-react";

import dayjs from "dayjs";
import CreateAppointmentFormWithDrawer from "./CreateAppointmentForm";
import AppointmentsByStatus from "@/components/appointments/AppointmentsByStatus";
import AppointmentsTable from "@/components/appointments/AppointmentsTable";

export default function Appointments() {
  const [openDatepicker, setOpenDatepicker] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string>("scheduled");

  return (
    <>
      <div className="w-full h-full flex items-center justify-between gap-2">
        <div className="w-full h-full flex items-center gap-2">
          <Popover open={openDatepicker} onOpenChange={setOpenDatepicker}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                {date ? dayjs(date).format("DD MMM YYYY") : "Select date"}

                <div className="inline-flex items-center gap-1">
                  {date && (
                    <a
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setDate(undefined);
                      }}
                    >
                      <XCircleIcon className="text-destructive/80 cursor-pointer" />
                    </a>
                  )}
                  <ChevronDownIcon />
                </div>
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDate(date);
                  setOpenDatepicker(false);
                }}
              />
            </PopoverContent>
          </Popover>

          {/*{!date && (*/}
          {/*  <Select value={status} onValueChange={setStatus}>*/}
          {/*    <SelectTrigger className="w-[180px] h-full cursor-pointer">*/}
          {/*      <SelectValue placeholder="Filter with status" />*/}
          {/*    </SelectTrigger>*/}
          {/*    <SelectContent>*/}
          {/*      <SelectItem value="scheduled">*/}
          {/*        <span className="w-3 h-3 rounded-xs bg-yellow-400"></span>*/}
          {/*        Pending*/}
          {/*      </SelectItem>*/}
          {/*      <SelectItem value="completed">*/}
          {/*        <span className="w-3 h-3 rounded-xs bg-green-400"></span>*/}
          {/*        Completed*/}
          {/*      </SelectItem>*/}
          {/*    </SelectContent>*/}
          {/*  </Select>*/}
          {/*)}*/}
        </div>

        <CreateAppointmentFormWithDrawer
          trigger={
            <Button>
              <PlusIcon className="size-4" />
              Add New Appointment
            </Button>
          }
        />
      </div>

      {date ? (
        <AppointmentsByStatus date={date} />
      ) : (
        <AppointmentsTable status={status} />
      )}
    </>
  );
}
