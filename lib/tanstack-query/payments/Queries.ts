import { useQuery } from "@tanstack/react-query";
import { getCollectionData } from "@/lib/actions/supabase.actions";
import { PAYMENTS_QUERY_KEYS } from "@/lib/tanstack-query/payments/Keys";

export const useGetAllPayments = ({
  filters,
  queryKeys,
  select,
  limit,
}: {
  filters?: any[];
  queryKeys?: unknown[];
  select?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [PAYMENTS_QUERY_KEYS.GET_ALL_PAYMENTS, ...(queryKeys ?? [])],
    queryFn: async () => {
      const res = await getCollectionData({
        tableName: "payments",
        limit,
        select,
        filters,
      });

      if (Array.isArray(res)) {
        return res;
      } else {
        return { error: "Error fetching treatment templates" };
      }
    },
  });
};
