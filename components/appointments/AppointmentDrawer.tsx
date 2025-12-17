import { useRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  CalendarIcon,
  CalendarPlusIcon,
  IndianRupeeIcon,
  XIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import dayjs from "dayjs";
import RescheduleAppointment from "@/components/appointments/RescheduleAppointment";
import CompleteAppointment from "@/components/appointments/CompleteAppointment";
import { toast } from "sonner";
import AppointmentNotes from "@/components/appointments/AppointmentNotes";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverdueBalance from "@/components/patients/OverdueBalance";
import AppointmentCallingSwitch from "@/components/appointments/AppointmentCallingSwitch";
import PatientAppointments from "@/components/patients/PatientAppointments";
import AddPaymentTransaction from "@/components/AddPaymentTransaction";
import { Button } from "@/components/ui/button";
import AddTreatmentPlan from "@/components/AddTreatmentPlan";
import TreatmentPlans from "@/components/TreatmentPlans";

interface AppointmentDrawerProps {
  trigger: React.ReactNode;
  appointmentData: any;
}

export default function AppointmentDrawer({
  trigger,
  appointmentData,
}: AppointmentDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className="sm:w-full! xl:w-4/5! sm:max-w-none! bg-card overflow-y-auto overflow-x-hidden">
        <DrawerHeader className="border-b flex-col w-full gap-3 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left">
          <div className="flex flex-row w-full justify-between items-center">
            <DrawerTitle className="font-medium">
              {/*# {appointmentData?.appointment_number}*/}
              Appointment Details
            </DrawerTitle>
            <DrawerClose className="cursor-pointer" ref={closeRef}>
              <XIcon className="size-4" />
            </DrawerClose>
          </div>

          {/*<div className="w-full h-full">*/}
          {/*  <span>Status : </span>*/}
          {/*  <AppointmentStatusRenderer status={appointmentData?.status} />*/}
          {/*</div>*/}
        </DrawerHeader>

        <div className="flex flex-col gap-4 p-4 w-full">
          <div className="flex md:flex-row gap-6 md:items-center w-full justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-10 md:size-14 cursor-pointer border uppercase">
                <AvatarFallback>
                  {appointmentData?.patient?.name?.split(" ")?.[0]?.[0]}
                  {appointmentData?.patient?.name?.split(" ")?.[1]?.[0] ||
                    appointmentData?.patient?.name?.split(" ")?.[0]?.[1]}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1">
                <h3 className="font-medium text-secondary-foreground uppercase">
                  {appointmentData?.patient?.name}
                </h3>

                <p className="text-sm font-normal text-muted-foreground">
                  Phone:{" "}
                  <span className="select-all">
                    {appointmentData?.patient?.phone}
                  </span>
                </p>
              </div>
            </div>

            <AddTreatmentPlan
              trigger={
                <Button>
                  <CalendarPlusIcon className="size-4" />
                  Add Treatment Plan
                </Button>
              }
              patientId={appointmentData?.patient?.id}
            />

            {/*<ArrowLeftRightIcon className="ml-4 text-muted-foreground" />*/}

            {/*<div className="flex items-center gap-4">*/}
            {/*  <Avatar className="size-10 md:size-14 cursor-pointer border">*/}
            {/*    <AvatarFallback>*/}
            {/*      {appointmentData?.doctor?.name?.split(" ")?.[0]?.[0]}*/}
            {/*      {appointmentData?.doctor?.name?.split(" ")?.[1]?.[0] ||*/}
            {/*        appointmentData?.doctor?.name?.split(" ")?.[0]?.[1]}*/}
            {/*    </AvatarFallback>*/}
            {/*  </Avatar>*/}

            {/*  <div className="flex flex-col gap-1">*/}
            {/*    <h3 className="font-medium text-secondary-foreground">*/}
            {/*      Dr. {appointmentData?.doctor?.name}*/}
            {/*    </h3>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>

          <Tabs defaultValue="appointment-details" className="w-full">
            <TabsList className="w-full p-0 bg-transparent! shadow-none justify-start border-b rounded-none">
              <TabsTrigger
                value="appointment-details"
                className="rounded-none bg-transparent! h-full data-[state=active]:shadow-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary w-fit!"
              >
                <CalendarIcon />
                Appointment Details
              </TabsTrigger>

              <TabsTrigger
                value="patient-details"
                className="rounded-none bg-transparent! h-full data-[state=active]:shadow-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary w-fit!"
              >
                <IndianRupeeIcon />
                Payment Details
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="appointment-details"
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-2 gap-4 w-full">
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

                {/*<div className="border border-dashed p-3 rounded-lg text-sm w-full h-full flex flex-col gap-1">*/}
                {/*  <span>Amount to be charged</span>*/}
                {/*  <span className="text-muted-foreground">*/}
                {/*    ₹ {appointmentData?.amount_to_charge}*/}
                {/*  </span>*/}
                {/*</div>*/}

                <AppointmentNotes
                  id={appointmentData?.id}
                  notes={appointmentData?.notes}
                />

                <AppointmentCallingSwitch
                  id={appointmentData?.id}
                  call_status={appointmentData?.call_status}
                />
              </div>

              <hr className="my-4" />

              {appointmentData?.status !== "completed" && (
                <RescheduleAppointment
                  appointmentData={appointmentData}
                  onSuccessAction={() => {
                    toast.success(`Successfully re-scheduled the appointment`);
                  }}
                />
              )}

              {!["completed"].includes(appointmentData?.patient?.status) && (
                <CompleteAppointment appointmentData={appointmentData} />
              )}

              <PatientAppointments id={appointmentData?.patient?.id} />

              <TreatmentPlans patientId={appointmentData?.patient?.id} />
            </TabsContent>

            <TabsContent
              value="patient-details"
              className="flex flex-col gap-4"
            >
              <OverdueBalance id={appointmentData?.patient?.id} />
              <AddPaymentTransaction
                trigger={
                  <Button>
                    <IndianRupeeIcon className="size-4" />
                    Add Payment Transaction
                  </Button>
                }
                patientId={appointmentData?.patient?.id}
              />
              {/*<AddTreatmentPlan*/}
              {/*  patientId={appointmentData?.patient?.id}*/}
              {/*  trigger={*/}
              {/*    <div className="flex items-center justify-end">*/}
              {/*      <Button>*/}
              {/*        <CalendarPlusIcon className="size-4" />*/}
              {/*        Add Treatment Plan*/}
              {/*      </Button>*/}
              {/*    </div>*/}
              {/*  }*/}
              {/*/>*/}

              {/*<TreatmentPlans patientId={appointmentData?.patient?.id}  />*/}
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
