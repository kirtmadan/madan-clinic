import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addTreatmentPlan,
  deleteDocument,
  updateDocument,
  updatePaymentRecord,
  updateTreatmentPlanItems,
  updateTreatmentPlanPayment,
} from "@/lib/actions/supabase.actions";
import { toast } from "sonner";
import { TREATMENT_PLANS_QUERY_KEYS } from "@/lib/tanstack-query/treatment-plans/Keys";
import { revalidateCache } from "@/lib/actions/server.actions";
import { PAYMENTS_QUERY_KEYS } from "@/lib/tanstack-query/payments/Keys";

export const useAddTreatmentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      patientId,
      description,
      treatmentItems,
      authorized_amount,
      onSuccess,
    }: {
      patientId: string;
      description?: string;
      treatmentItems: { treatment_id: string; quantity: number | string }[];
      onSuccess?: () => void;
      authorized_amount?: number;
    }) => {
      const res = await addTreatmentPlan({
        patientId,
        description,
        treatmentItems,
        authorized_amount,
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

export const useUpdateTreatmentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,
      doc,
      onSuccess,
    }: {
      documentId: string;
      doc: any;
      onSuccess?: () => void;
    }) => {
      const res = await updateDocument({
        tableName: "treatment_plans",
        documentId,
        doc,
      });

      if ("error" in res) {
        toast.error(res?.error);
      } else {
        toast.success(`Successfully updated the treatment plans`);
        onSuccess?.();
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [TREATMENT_PLANS_QUERY_KEYS.GET_ALL_TREATMENT_PLANS],
      });
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
      // treatmentPlanId,
      patientId,
      method,
      onSuccess,
    }: {
      // treatmentPlanId: string;
      amount: number;
      patientId: string;
      method: string;
      onSuccess?: () => void;
    }) => {
      const res = await updateTreatmentPlanPayment({
        _amount: amount,
        _method: method,
        // _plan_id: treatmentPlanId,
        _patient_id: patientId,
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

      void queryClient.invalidateQueries({
        queryKey: [PAYMENTS_QUERY_KEYS.GET_ALL_PAYMENTS],
      });

      void queryClient.invalidateQueries({
        queryKey: ["patientsOverdueAmount"],
      });

      void revalidateCache(`/patients`);
    },
  });
};

export const useUpdatePaymentRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      amount,
      method,
      onSuccess,
    }: {
      id: string;
      amount: number;
      method: string;
      onSuccess?: () => void;
    }) => {
      const res = await updatePaymentRecord({
        id,
        amount,
        method,
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

      void queryClient.invalidateQueries({
        queryKey: [PAYMENTS_QUERY_KEYS.GET_ALL_PAYMENTS],
      });

      void queryClient.invalidateQueries({
        queryKey: ["patientsOverdueAmount"],
      });

      void revalidateCache(`/patients`);
    },
  });
};

export const useDeleteTreatmentPlan = () => {
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
        tableName: "treatment_plans",
        documentId,
      });

      if (res?.error) {
        toast.error(res?.error);
      } else {
        toast.success(`Successfully deleted the treatment plan`);
        onSuccess?.();
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [TREATMENT_PLANS_QUERY_KEYS.GET_ALL_TREATMENT_PLANS],
      });
    },
  });
};
