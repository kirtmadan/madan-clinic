import { useRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ArrowLeftRightIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import dayjs from "dayjs";
import RescheduleAppointment from "@/components/appointments/RescheduleAppointment";
import CompleteAppointment from "@/components/appointments/CompleteAppointment";
import { toast } from "sonner";
import AppointmentNotes from "@/components/appointments/AppointmentNotes";
import AppointmentStatusRenderer from "@/components/cellRenderers/AppointmentStatusRenderer";

interface AppointmentDrawerProps {
  trigger: React.ReactNode;
  appointmentData: any;
}

export default function AppointmentDrawer({
  trigger,
  appointmentData,
}: AppointmentDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className="sm:w-[800px]! sm:max-w-none!">
        <DrawerHeader className="border-b flex-col w-full gap-3">
          <div className="flex flex-row w-full justify-between items-center">
            <DrawerTitle className="font-medium">
              # {appointmentData?.id}
            </DrawerTitle>
            <DrawerClose className="cursor-pointer" ref={closeRef}>
              <XIcon className="size-4" />
            </DrawerClose>
          </div>

          <div className="w-full h-full">
            <span>Status : </span>
            <AppointmentStatusRenderer status={appointmentData?.status} />
          </div>
        </DrawerHeader>

        <div className="flex flex-col gap-4 p-4 w-full">
          <div className="flex gap-6 items-center w-full">
            <div className="flex items-center gap-4">
              <Avatar className="size-14 cursor-pointer border">
                <AvatarFallback>
                  {appointmentData?.patient?.name?.split(" ")?.[0]?.[0]}
                  {appointmentData?.patient?.name?.split(" ")?.[1]?.[0] ||
                    appointmentData?.patient?.name?.split(" ")?.[0]?.[1]}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1">
                <h3 className="font-medium text-secondary-foreground">
                  {appointmentData?.patient?.name}
                </h3>
              </div>
            </div>

            <ArrowLeftRightIcon className="ml-4 text-muted-foreground" />

            <div className="flex items-center gap-4">
              <Avatar className="size-14 cursor-pointer border">
                <AvatarFallback>
                  {appointmentData?.doctor?.name?.split(" ")?.[0]?.[0]}
                  {appointmentData?.doctor?.name?.split(" ")?.[1]?.[0] ||
                    appointmentData?.doctor?.name?.split(" ")?.[0]?.[1]}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1">
                <h3 className="font-medium text-secondary-foreground">
                  Dr. {appointmentData?.doctor?.name}
                </h3>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-4 w-full">
            <div className="border border-dashed p-3 rounded-lg text-sm w-full h-full flex flex-col gap-1">
              <span>Appointment date</span>
              <span className="text-muted-foreground">
                {dayjs(appointmentData?.date).format("DD MMM YYYY")}
              </span>
            </div>

            <div className="border border-dashed p-3 rounded-lg text-sm w-full h-full flex flex-col gap-1">
              <span>Appointment created at</span>
              <span className="text-muted-foreground">
                {dayjs(appointmentData?.created_at).format("DD MMM YYYY")}
              </span>
            </div>

            <div className="border border-dashed p-3 rounded-lg text-sm w-full h-full flex flex-col gap-1">
              <span>Amount to be charged</span>
              <span className="text-muted-foreground">
                ₹ {appointmentData?.amount_to_charge}
              </span>
            </div>
          </div>

          <AppointmentNotes notes={appointmentData?.notes} />

          <hr className="my-4" />

          {appointmentData?.status !== "completed" && (
            <RescheduleAppointment
              appointmentData={appointmentData}
              onSuccessAction={() => {
                toast.success(`Successfully re-scheduled the appointment`);
              }}
            />
          )}

          {!["cancelled", "completed"].includes(appointmentData?.status) && (
            <CompleteAppointment appointmentData={appointmentData} />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
