"use client";

import { Button } from "@/components/ui/button";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import { useGetAllAppointments } from "@/lib/tanstack-query/appointments/Queries";
import { CalendarIcon } from "lucide-react";
import { useMemo } from "react";

import dayjs from "dayjs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function AppointmentsByStatus({
  date,
}: {
  date: Date | undefined;
}) {
  const formattedDate = dayjs(date).format("YYYY-MM-DD");

  const filters = useMemo(() => {
    if (!date) return undefined;

    return [
      (q: any) => q.or(`date.eq.${formattedDate},rs_date.eq.${formattedDate}`),
      // (q: any) =>
      //   q.order("name", { referencedTable: "patient", ascending: true }),
    ];
  }, [formattedDate, date]);

  const { data } = useGetAllAppointments({
    filters,
    select: `
    id,
    appointment_number,
    date,
    rs_date,
    status,
    notes,
    call_status,
    created_at,
    doctor:doctor_id ( id, name ),
    patient:patient_id ( id, name, phone )
    `,
    queryKeys: [date?.toDateString()],
  });

  const pendingAppointments = Array.isArray(data)
    ? data
        ?.filter(
          (appointment) =>
            ["scheduled", "rescheduled"].includes(appointment?.status) &&
            appointment?.rs_date !== formattedDate,
        )
        ?.sort((a, b) =>
          a?.patient?.name
            ?.trim()
            ?.toLowerCase()
            ?.localeCompare(b?.patient?.name?.trim()?.toLowerCase()),
        )
    : [];

  const completedAppointments = Array.isArray(data)
    ? data
        ?.filter((appointment) => appointment.status === "completed")
        ?.sort((a, b) =>
          a?.patient?.name
            ?.trim()
            ?.toLowerCase()
            ?.localeCompare(b?.patient?.name?.trim()?.toLowerCase()),
        )
    : [];

  const rescheduledAppointments = Array.isArray(data)
    ? data
        ?.filter(
          (appointment) =>
            appointment.status === "rescheduled" &&
            appointment?.rs_date === formattedDate,
        )
        ?.sort((a, b) =>
          a?.patient?.name
            ?.trim()
            ?.toLowerCase()
            ?.localeCompare(b?.patient?.name?.trim()?.toLowerCase()),
        )
    : [];

  return (
    <>
      <div className="w-full h-full bg-white rounded-lg border max-w-full">
        {Array.isArray(data) && data?.length > 0 ? (
          <div className="grid grid-cols-3 gap-6 p-4 max-w-full w-full">
            <div className="w-full flex flex-col gap-4">
              <Button className="cursor-pointer w-full bg-amber-500 hover:bg-amber-600">
                Pending Appointments
              </Button>

              <div className="w-full flex flex-col gap-4">
                {pendingAppointments?.map((appointment: any) => (
                  <AppointmentCard key={appointment.id} {...appointment} />
                ))}
              </div>
            </div>

            <div className="w-full flex flex-col gap-4">
              <Button className="cursor-pointer w-full">
                Completed Appointments
              </Button>

              <div className="w-full flex flex-col gap-4">
                {completedAppointments?.map((appointment: any) => (
                  <AppointmentCard key={appointment.id} {...appointment} />
                ))}
              </div>
            </div>

            <div className="w-full flex flex-col gap-4">
              <Button className="cursor-pointer w-full bg-blue-500 hover:bg-blue-600">
                Re-scheduled Appointments
              </Button>

              <div className="w-full flex flex-col gap-4">
                {rescheduledAppointments?.map((appointment: any) => (
                  <AppointmentCard key={appointment.id} {...appointment} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-60 flex items-center text-primary justify-center gap-2">
            <CalendarIcon className="size-5" />
            <span className="text-base">
              No appointments found for the selected date...
            </span>
          </div>
        )}
      </div>
    </>
  );
}
