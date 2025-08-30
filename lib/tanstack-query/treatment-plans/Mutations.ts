import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addTreatmentPlan,
  updateTreatmentPlanItems,
  updateTreatmentPlanPayment,
} from "@/lib/actions/supabase.actions";
import { toast } from "sonner";
import { TREATMENT_PLANS_QUERY_KEYS } from "@/lib/tanstack-query/treatment-plans/Keys";
import { revalidateCache } from "@/lib/actions/server.actions";

export const useAddTreatmentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      patientId,
      description,
      treatmentItems,
      onSuccess,
    }: {
      patientId: string;
      description?: string;
      treatmentItems: { treatment_id: string; quantity: number | string }[];
      onSuccess?: () => void;
    }) => {
      const res = await addTreatmentPlan({
        patientId,
        description,
        treatmentItems,
      });

      if ("error" in res) {
        toast.error(res?.error);
      } else {
        toast.success(`Successfully added the treatment plan`);
        onSuccess?.();
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [TREATMENT_PLANS_QUERY_KEYS.GET_ALL_TREATMENT_PLANS],
      });

      void revalidateCache(`/patients`);
    },
  });
};

export const useUpdateTreatmentPlanItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      treatmentPlanId,
      treatmentItems,
      onSuccess,
    }: {
      treatmentPlanId: string;
      treatmentItems: {
        plan_item_id?: string;
        treatment_id: string;
        quantity: number | string;
      }[];
      onSuccess?: () => void;
    }) => {
      const res = await updateTreatmentPlanItems({
        _plan_id: treatmentPlanId,
        treatmentItems,
      });

      if ("error" in res) {
        toast.error(res?.error);
      } else {
        toast.success(`Successfully added the treatment plan`);
        onSuccess?.();
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [TREATMENT_PLANS_QUERY_KEYS.GET_ALL_TREATMENT_PLAN_ITEMS],
      });

      void revalidateCache(`/patients`);
    },
  });
};

export const useUpdateTreatmentPlanPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      amount,
      auth_amount,
      treatmentPlanId,
      onSuccess,
    }: {
      treatmentPlanId: string;
      amount: number;
      auth_amount: number;
      onSuccess?: () => void;
    }) => {
      const res = await updateTreatmentPlanPayment({
        amount,
        auth_amount,
        plan_id: treatmentPlanId,
      });

      if ("error" in res) {
        toast.error(res?.error);
      } else {
        toast.success(`Successfully updated the payment details`);
        onSuccess?.();
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [TREATMENT_PLANS_QUERY_KEYS.GET_ALL_TREATMENT_PLANS],
      });

      void revalidateCache(`/patients`);
    },
  });
};
