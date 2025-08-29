import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpDownIcon } from "lucide-react";
import dayjs from "dayjs";
import AppointmentDrawer from "@/components/appointments/AppointmentDrawer";

interface AppointmentCardProps {
  created_at: string | number;
  date: string;
  doctor_id: string;
  id: string;
  notes: string;
  patient_id: string;
  status: string;
  patient: {
    id: string;
    name: string;
  };
  doctor: {
    id: string;
    name: string;
  };
}

export default function AppointmentCard(props: AppointmentCardProps) {
  const { created_at, patient, doctor } = props;

  return (
    <AppointmentDrawer
      trigger={
        <div className="w-full bg-secondary border-dashed border p-4 rounded-lg flex flex-col gap-1 cursor-pointer">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 cursor-pointer border">
              <AvatarFallback>
                {patient?.name?.split(" ")?.[0]?.[0]}
                {patient?.name?.split(" ")?.[1]?.[0] ||
                  patient?.name?.split(" ")?.[0]?.[1]}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-secondary-foreground">
                {patient?.name}
              </h3>

              {/*<p className="text-sm text-muted-foreground">*/}
              {/*  Amount : ₹ {amount_to_charge}*/}
              {/*</p>*/}

              <p className="text-sm text-muted-foreground">
                Created at : {dayjs(created_at).format("DD MMM YYYY")}
              </p>
            </div>
          </div>

          <ArrowUpDownIcon className="ml-4 text-muted-foreground" />

          <div className="flex items-center gap-4">
            <Avatar className="size-14 cursor-pointer border">
              <AvatarFallback>
                {doctor?.name?.split(" ")?.[0]?.[0]}
                {doctor?.name?.split(" ")?.[1]?.[0] ||
                  doctor?.name?.split(" ")?.[0]?.[1]}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-secondary-foreground">
                Dr. {doctor?.name}
              </h3>
            </div>
          </div>

          {/*<div className="grid grid-cols-2 gap-2 w-full border-t pt-5 mt-5">*/}
          {/*  <Button className="cursor-pointer" variant="ghost">*/}
          {/*    View*/}
          {/*  </Button>*/}

          {/*  <Button*/}
          {/*    className="cursor-pointer"*/}
          {/*    variant="destructive"*/}
          {/*    disabled={["completed", "cancelled"].includes(status)}*/}
          {/*  >*/}
          {/*    Cancel*/}
          {/*  </Button>*/}
          {/*</div>*/}
        </div>
      }
      appointmentData={{ ...props, patient, doctor }}
    />
  );
}
