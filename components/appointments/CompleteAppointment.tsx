import { Button } from "@/components/ui/button";
import { useUpdateAppointment } from "@/lib/tanstack-query/appointments/Mutations";

import { toast } from "sonner";
import { useUpdatePatient } from "@/lib/tanstack-query/patients/Mutations";

export default function CompleteAppointment({
  appointmentData,
}: {
  appointmentData: any;
}) {
  const { mutateAsync: updateAppointment, isPending } = useUpdateAppointment();
  const { mutateAsync: updatePatient } = useUpdatePatient();

  const completeAppointment = async () => {
    await updateAppointment({
      doc: { status: "p_completed" },
      documentId: appointmentData?.id,
      onSuccess: async () => {},
    });

    await updatePatient({
      doc: { status: "completed" },
      documentId: appointmentData?.patient?.id,
      onSuccess: () => {
        toast.success("Patient marked as completed.");
      },
    });
  };

  return (
    <div className="w-full flex items-center justify-end gap-4">
      <Button disabled={isPending} onClick={completeAppointment}>
        Mark as Completed
      </Button>

      <span></span>
    </div>
  );
}
