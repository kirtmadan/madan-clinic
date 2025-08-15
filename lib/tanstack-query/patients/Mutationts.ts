import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDocument, deleteDocument } from "@/lib/actions/supabase.actions";
import { PATIENT_QUERY_KEYS } from "@/lib/tanstack-query/patients/Keys";
import { toast } from "sonner";

export const useAddPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      doc,
      onSuccess,
    }: {
      doc: any;
      onSuccess?: () => void;
    }) => {
      const res = await addDocument({ tableName: "patients", doc });

      if ("error" in res) {
        toast.error(res?.error);
      } else {
        toast.success(`Successfully added the patient`);
        onSuccess?.();
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [PATIENT_QUERY_KEYS.GET_ALL_PATIENTS],
      });
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,
      onSuccess,
    }: {
      documentId: any;
      onSuccess?: () => void;
    }) => {
      const res = await deleteDocument({
        tableName: "patients",
        documentId,
      });

      if (res?.error) {
        toast.error(res?.error);
      } else {
        toast.success(`Successfully deleted the patient`);
        onSuccess?.();
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [PATIENT_QUERY_KEYS.GET_ALL_PATIENTS],
      });
    },
  });
};
