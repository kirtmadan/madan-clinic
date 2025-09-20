import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDocument, updateDocument } from "@/lib/actions/supabase.actions";
import { toast } from "sonner";
import { APPOINTMENT_QUERY_KEYS } from "@/lib/tanstack-query/appointments/Keys";
import { createClient } from "@/lib/supabase/client";

export const useAddAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      doc,
      onSuccess,
    }: {
      doc: any;
      onSuccess?: () => void;
    }) => {
      try {
        const supabase = createClient();

        const { data: existing, error: fetchError } = await supabase
          .from("appointments")
          .select("*")
          .eq("patient_id", doc?.patient_id)
          .eq("date", doc?.date);

        if (fetchError) {
          throw new Error("Error adding appointment. Please try again.");
        } else if (existing.length > 0) {
          throw new Error(
            "An appointment for the patient is already existing on the date " +
              doc?.date,
          );
        } else {
          const res = await addDocument({ tableName: "appointments", doc });

          if ("error" in res) {
            toast.error(res?.error);
          } else {
            toast.success(`Successfully created the appointment`);
            onSuccess?.();
          }
        }
      } catch (error: any) {
        toast.error(error?.message);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [APPOINTMENT_QUERY_KEYS.GET_ALL_APPOINTMENTS],
      });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      doc,
      documentId,
      onSuccess,
    }: {
      doc: any;
      documentId: string;
      onSuccess?: () => void;
    }) => {
      const res = await updateDocument({
        tableName: "appointments",
        documentId,
        doc,
      });

      if ("error" in res) {
        toast.error("Failed to update the appointment. Please try again.");
      } else {
        onSuccess?.();
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [APPOINTMENT_QUERY_KEYS.GET_ALL_APPOINTMENTS],
      });
    },
  });
};
