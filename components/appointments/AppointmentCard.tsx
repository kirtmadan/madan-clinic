import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import dayjs from "dayjs";
import AppointmentDrawer from "@/components/appointments/AppointmentDrawer";
import AppointmentCallingSwitch from "@/components/appointments/AppointmentCallingSwitch";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";

interface AppointmentCardProps {
  created_at: string | number;
  date: string;
  id: string;
  notes: string;
  patient_id: string;
  status: string;
  call_status: number;
  ar_status: string;
  patient: {
    id: string;
    name: string;
    phone: string;
  };
}

export default function AppointmentCard(props: AppointmentCardProps) {
  const { created_at, patient, ar_status } = props;

  const { data: isCapPatient } = useQuery({
    queryKey: ["is_cap_patient", patient?.id],
    queryFn: async () => {
      const supabase = createClient();

      const { data: treatments } = await supabase
        .from("treatment_plans")
        .select(
          "id, treatment_plan_items!inner(treatment_id!inner(id,name,color))",
        )
        .eq("patient_id", patient?.id)
        .ilike("treatment_plan_items.treatment_id.name", "%CAP%");

      console.log(treatments);

      if (
        treatments &&
        treatments?.length > 0 &&
        treatments[0]?.treatment_plan_items &&
        treatments[0]?.treatment_plan_items?.length > 0
      ) {
        return treatments[0]?.treatment_plan_items[0]?.treatment_id;
      }

      return null;
    },
    enabled: !!patient?.id,
    retry: false,
  });

  return (
    <AppointmentDrawer
      trigger={
        <div className="w-full bg-white/80 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.06),0_12px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 p-4 rounded-lg flex flex-col gap-1 cursor-pointer">
          <div className="flex items-center justify-between gap-4 relative">
            <div className="flex items-center gap-4 w-full flex-[1]">
              {isCapPatient && (isCapPatient as any)?.color && (
                <Badge
                  className="h-5 min-w-5 rounded-full px-1 font-regular font-mono tabular-nums absolute right-0 -top-[5px]"
                  style={{ backgroundColor: (isCapPatient as any)?.color }}
                  variant="destructive"
                >
                  {(isCapPatient as any)?.name || "CAP"}
                </Badge>
              )}

              <Avatar className="cursor-pointer size-14">
                <AvatarFallback
                  className={cn(
                    "uppercase",
                    ar_status === "completed"
                      ? "bg-green-500/10"
                      : ar_status === "rescheduled"
                        ? "bg-blue-500/10"
                        : "bg-amber-500/10",
                  )}
                >
                  {patient?.name?.split(" ")?.[0]?.[0]}
                  {patient?.name?.split(" ")?.[1]?.[0] ||
                    patient?.name?.split(" ")?.[0]?.[1]}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1">
                <h3 className="font-medium text-secondary-foreground uppercase text-sm whitespace-nowrap">
                  {patient?.name}{" "}
                </h3>

                {/*<p className="text-sm text-muted-foreground">*/}
                {/*  Amount : ₹ {amount_to_charge}*/}
                {/*</p>*/}

                <p className="text-sm text-muted-foreground">
                  {dayjs(created_at).format("DD MMM")}
                </p>

                <p className="text-sm text-muted-foreground">
                  {patient?.phone}
                </p>
              </div>
            </div>

            <AppointmentCallingSwitch
              call_status={props?.call_status}
              id={props?.id}
              className="border-none w-fit"
            />
          </div>

          {/*<ArrowUpDownIcon className="ml-4 text-muted-foreground" />*/}

          {/*<div className="flex items-center gap-4">*/}
          {/*  <Avatar className="size-14 cursor-pointer border">*/}
          {/*    <AvatarFallback>*/}
          {/*      {doctor?.name?.split(" ")?.[0]?.[0]}*/}
          {/*      {doctor?.name?.split(" ")?.[1]?.[0] ||*/}
          {/*        doctor?.name?.split(" ")?.[0]?.[1]}*/}
          {/*    </AvatarFallback>*/}
          {/*  </Avatar>*/}

          {/*  <div className="flex flex-col gap-1">*/}
          {/*    <h3 className="font-medium text-secondary-foreground">*/}
          {/*      Dr. {doctor?.name}*/}
          {/*    </h3>*/}
          {/*  </div>*/}
          {/*</div>*/}

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
      appointmentData={{ ...props, patient }}
    />
  );
}
