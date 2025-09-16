import { Switch } from "@/components/ui/switch";
import { useUpdateAppointment } from "@/lib/tanstack-query/appointments/Mutations";
import { cn } from "@/lib/utils";

export default function AppointmentCallingSwitch({
  call_status,
  id,
  className,
}: {
  call_status: number;
  id: string;
  className?: string;
}) {
  const { mutateAsync: updateAppointment, isPending } = useUpdateAppointment();

  return (
    <div
      className={cn(
        "w-full h-full border p-4 border-dashed flex flex-col gap-4 rounded-lg",
        className,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="text-sm">Calling done</span>

      <Switch
        checked={call_status === 1}
        disabled={isPending}
        onCheckedChange={async (checked: boolean) => {
          if (checked) {
            await updateAppointment({
              documentId: id,
              doc: { call_status: 1 },
            });
          } else {
            await updateAppointment({
              documentId: id,
              doc: { call_status: 0 },
            });
          }
        }}
      />
    </div>
  );
}
