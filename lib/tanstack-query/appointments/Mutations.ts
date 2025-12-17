import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addDocument,
  deleteDocument,
  updateDocument,
} from "@/lib/actions/supabase.actions";
import { toast } from "sonner";
import { APPOINTMENT_QUERY_KEYS } from "@/lib/tanstack-query/appointments/Keys";
import { createClient } from "@/lib/supabase/client";
import dayjs from "dayjs";

export const useAddAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      doc,
      onSuccess,
      forced, // skips the existing appointment check
    }: {
      doc: any;
      onSuccess?: () => void;
      forced?: boolean;
    }) => {
      try {
        const supabase = createClient();

        if (!forced) {
          const { data: existing, error: fetchError } = await supabase
            .from("appointments")
            .select("*")
            .eq("patient_id", doc?.patient_id)
            .neq("status", "completed")
            .neq("status", "p_completed")
            .gte("date", dayjs().format("YYYY-MM-DD"));

          if (fetchError) {
            throw new Error("Error adding appointment. Please try again.");
          } else if (existing.length > 0) {
            throw new Error(
              "Patient is already appointed on date:  " +
                dayjs(existing?.[0]?.date)?.format("DD MMM YYYY"),
            );
          }
        }

        const res = await addDocument({ tableName: "appointments", doc });

        if ("error" in res) {
          toast.error(res?.error);
        } else {
          toast.success(`Successfully created the appointment`);
          onSuccess?.();
        }
      } catch (error: any) {
        if (
          error?.message?.startsWith(
            "This patient is already appointed on date",
          )
        ) {
          toast.error(error?.message);
          return { errcode: 3, error: error.message, doc };
        }

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

export const useDeleteAppointment = () => {
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
        tableName: "appointments",
        documentId,
      });

      if (res?.error) {
        console.error(res?.error);
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
