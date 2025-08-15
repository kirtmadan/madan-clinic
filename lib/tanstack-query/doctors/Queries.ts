import { useQuery } from "@tanstack/react-query";
import { DOCTOR_QUERY_KEYS } from "@/lib/tanstack-query/doctors/Keys";
import { getCollectionData } from "@/lib/actions/supabase.actions";

export const useGetAllDoctors = ({ limit }: { limit?: number }) => {
  return useQuery({
    queryKey: [DOCTOR_QUERY_KEYS.GET_ALL_DOCTORS],
    queryFn: async () => {
      const res = await getCollectionData({
        tableName: "doctors",
        dataLimit: limit,
      });

      if (Array.isArray(res)) {
        return res;
      } else {
        return { error: "Error fetching doctors" };
      }
    },
  });
};
