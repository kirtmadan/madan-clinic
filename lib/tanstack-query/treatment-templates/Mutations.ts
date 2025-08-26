import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDocument, deleteDocument } from "@/lib/actions/supabase.actions";
import { toast } from "sonner";
import { TREATMENT_TEMPLATES_QUERY_KEYS } from "@/lib/tanstack-query/treatment-templates/Keys";

export const useAddTreatmentTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      doc,
      onSuccess,
    }: {
      doc: any;
      onSuccess?: () => void;
    }) => {
      const res = await addDocument({ tableName: "treatments", doc });

      if ("error" in res) {
        toast.error(res?.error);
      } else {
        toast.success(`Successfully added the treatment template`);
        onSuccess?.();
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [TREATMENT_TEMPLATES_QUERY_KEYS.GET_ALL_TEMPLATES],
      });
    },
  });
};

export const useDeleteTreatmentTemplate = () => {
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
        tableName: "treatments",
        documentId,
      });

      if (res?.error) {
        toast.error(res?.error);
      } else {
        toast.success(`Successfully deleted the treatment template`);
        onSuccess?.();
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [TREATMENT_TEMPLATES_QUERY_KEYS.GET_ALL_TEMPLATES],
      });
    },
  });
};
