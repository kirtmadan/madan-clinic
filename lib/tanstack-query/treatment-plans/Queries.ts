import { useQuery } from "@tanstack/react-query";
import { getCollectionData } from "@/lib/actions/supabase.actions";
import { TREATMENT_PLANS_QUERY_KEYS } from "@/lib/tanstack-query/treatment-plans/Keys";

export const useGetAllTreatmentPlans = ({
  limit,
  filters,
  queryKeys,
  select,
}: {
  filters?: any[];
  queryKeys?: unknown[];
  select?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [
      TREATMENT_PLANS_QUERY_KEYS.GET_ALL_TREATMENT_PLANS,
      ...(queryKeys ?? []),
    ],
    queryFn: async () => {
      const res = await getCollectionData({
        tableName: "treatment_plans",
        limit,
        filters,
        select,
      });

      if (Array.isArray(res)) {
        return res;
      } else {
        return { error: "Error fetching treatment plans" };
      }
    },
  });
};

export const useGetAllTreatmentPlanItems = ({
  limit,
  filters,
  queryKeys,
  select,
  onSuccess,
}: {
  filters?: any[];
  queryKeys?: unknown[];
  select?: string;
  limit?: number;
  onSuccess?: (data: any) => void;
}) => {
  return useQuery({
    queryKey: [
      TREATMENT_PLANS_QUERY_KEYS.GET_ALL_TREATMENT_PLAN_ITEMS,
      ...(queryKeys ?? []),
    ],
    queryFn: async () => {
      const res = await getCollectionData({
        tableName: "treatment_plan_items",
        limit,
        filters,
        select,
      });

      if (Array.isArray(res)) {
        onSuccess?.(res);
        return res;
      } else {
        return { error: "Error fetching treatment plans" };
      }
    },
  });
};
