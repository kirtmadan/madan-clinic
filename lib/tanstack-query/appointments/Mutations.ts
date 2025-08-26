import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDocument, updateDocument } from "@/lib/actions/supabase.actions";
import { toast } from "sonner";
import { APPOINTMENT_QUERY_KEYS } from "@/lib/tanstack-query/appointments/Keys";

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
      const res = await addDocument({ tableName: "appointments", doc });

      if ("error" in res) {
        toast.error(res?.error);
      } else {
        toast.success(`Successfully created the appointment`);
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

      // void queryClient.invalidateQueries({
      //   queryKey: [APPOINTMENT_QUERY_KEYS.],
      // });
    },
  });
};
