import { Button } from "@/components/ui/button";
import { useUpdateAppointment } from "@/lib/tanstack-query/appointments/Mutations";

import { toast } from "sonner";

export default function CompleteAppointment({
  appointmentData,
}: {
  appointmentData: any;
}) {
  const { mutateAsync: updateAppointment, isPending } = useUpdateAppointment();
  // const { mutateAsync: updatePatient } = useUpdatePatient();

  const completeAppointment = async () => {
    await updateAppointment({
      doc: { status: "completed" },
      documentId: appointmentData?.id,
      onSuccess: () => {
        toast.success("Appointment completed successfully.");
      },
    });
  };

  const cancelAppointment = async () => {
    await updateAppointment({
      doc: { status: "cancelled" },
      documentId: appointmentData?.id,
      onSuccess: () => {
        toast.success("Appointment cancelled successfully.");
      },
    });
  };

  return (
    <div className="w-full flex items-center justify-end gap-4">
      <Button
        disabled={isPending}
        onClick={cancelAppointment}
        variant="destructive"
      >
        Cancel Appointment
      </Button>

      <Button disabled={isPending} onClick={completeAppointment}>
        Mark as Completed
      </Button>

      <span></span>
    </div>
  );
}
