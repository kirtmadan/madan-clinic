import { useQuery } from "@tanstack/react-query";
import { APPOINTMENT_QUERY_KEYS } from "@/lib/tanstack-query/appointments/Keys";
import { getCollectionData } from "@/lib/actions/supabase.actions";
import { toast } from "sonner";

export const useGetAllAppointments = ({
  filters,
  select,
  queryKeys,
  limit,
}: {
  filters?: any[];
  queryKeys?: unknown[];
  select?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [
      APPOINTMENT_QUERY_KEYS.GET_ALL_APPOINTMENTS,
      ...(queryKeys ?? []),
    ],
    queryFn: async () => {
      const res = await getCollectionData({
        tableName: "appointments",
        filters,
        select,
        limit,
      });

      if (Array.isArray(res)) {
        return res;
      } else {
        toast.error("Error fetching appointments");
        return [];
      }
    },
  });
};
