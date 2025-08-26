"use client";

import { Button } from "@/components/ui/button";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import { useGetAllAppointments } from "@/lib/tanstack-query/appointments/Queries";
import { CalendarIcon } from "lucide-react";
import { useMemo } from "react";

import dayjs from "dayjs";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppointmentsByStatus({
  date,
}: {
  date: Date | undefined;
}) {
  const filters = useMemo(() => {
    if (!date) return undefined;

    return [(q: any) => q.eq("date", dayjs(date).format("YYYY-MM-DD"))];
  }, [date]);

  const { data, isFetching } = useGetAllAppointments({
    filters,
    select: `
    id,
    date,
    status,
    notes,
    amount_to_charge,
    created_at,
    doctor:doctor_id ( id, name ),
    patient:patient_id ( id, name )
    `,
    queryKeys: [date?.toDateString()],
  });

  const pendingAppointments = Array.isArray(data)
    ? data?.filter((appointment) => appointment.status === "scheduled")
    : [];

  const completedAppointments = Array.isArray(data)
    ? data?.filter((appointment) => appointment.status === "completed")
    : [];

  const cancelledAppointments = Array.isArray(data)
    ? data?.filter((appointment) => appointment.status === "cancelled")
    : [];

  return (
    <>
      <div className="w-full h-full bg-white rounded-lg border max-w-full">
        {Array.isArray(data) && data?.length > 0 ? (
          <div className="grid grid-cols-3 gap-6 p-4 max-w-full w-full">
            <div className="w-full flex flex-col gap-4">
              <Button className="cursor-pointer w-full" variant="secondary">
                Pending Appointments
              </Button>

              <div className="w-full flex flex-col gap-4">
                {isFetching ? (
                  <div className="w-full flex flex-col gap-4">
                    <Skeleton className="h-52 w-full" />
                    <Skeleton className="h-52 w-full" />
                    <Skeleton className="h-52 w-full" />
                  </div>
                ) : (
                  <>
                    {pendingAppointments?.map((appointment: any) => (
                      <AppointmentCard key={appointment.id} {...appointment} />
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="w-full flex flex-col gap-4">
              <Button className="cursor-pointer w-full">
                Completed Appointments
              </Button>

              <div className="w-full flex flex-col gap-4">
                {isFetching ? (
                  <div className="w-full flex flex-col gap-4">
                    <Skeleton className="h-52 w-full" />
                    <Skeleton className="h-52 w-full" />
                    <Skeleton className="h-52 w-full" />
                  </div>
                ) : (
                  <>
                    {completedAppointments?.map((appointment: any) => (
                      <AppointmentCard key={appointment.id} {...appointment} />
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="w-full flex flex-col gap-4">
              <Button className="cursor-pointer w-full" variant="destructive">
                Cancelled Appointments
              </Button>

              <div className="w-full flex flex-col gap-4">
                {isFetching ? (
                  <div className="w-full flex flex-col gap-4">
                    <Skeleton className="h-52 w-full" />
                    <Skeleton className="h-52 w-full" />
                    <Skeleton className="h-52 w-full" />
                  </div>
                ) : (
                  <>
                    {cancelledAppointments?.map((appointment: any) => (
                      <AppointmentCard key={appointment.id} {...appointment} />
                    ))}
                  </>
                )}
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
