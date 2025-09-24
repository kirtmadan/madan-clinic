"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import { useGetAllAppointments } from "@/lib/tanstack-query/appointments/Queries";
import { ArrowDownToLineIcon, CalendarIcon } from "lucide-react";

import dayjs from "dayjs";
import { exportToCSV } from "@/lib/utils";

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
    patient:patient_id ( id, name, phone, status )
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

  const getDataToExport = (row: any) => {
    return {
      "appointment number": row?.appointment_number,
      "call status": row?.call_status ? "done" : "pending",
      "created at": dayjs(row?.created_at).format("DD MMM YYYY"),
      "doctor name": row?.doctor?.name,
      "patient name": row?.patient?.name,
      "patient phone": row?.patient?.phone,
      date: row?.date,
      status: row?.status,
    };
  };

  return (
    <>
      <Button
        variant="outline"
        className="absolute top-0 right-0"
        onClick={() => {
          exportToCSV(
            pendingAppointments?.map(getDataToExport),
            `pending-appointments ${dayjs().format("DD MMM YYYY")}.csv`,
          );

          exportToCSV(
            completedAppointments?.map(getDataToExport),
            `completed-appointments ${dayjs().format("DD MMM YYYY")}.csv`,
          );

          exportToCSV(
            rescheduledAppointments?.map(getDataToExport),
            `rescheduled-appointments ${dayjs().format("DD MMM YYYY")}.csv`,
          );
        }}
      >
        <ArrowDownToLineIcon />
        Export
      </Button>

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
