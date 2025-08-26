import { useQuery } from "@tanstack/react-query";
import { getCollectionData } from "@/lib/actions/supabase.actions";
import { TREATMENT_TEMPLATES_QUERY_KEYS } from "@/lib/tanstack-query/treatment-templates/Keys";

export const useGetAllTreatmentTemplates = ({ limit }: { limit?: number }) => {
  return useQuery({
    queryKey: [TREATMENT_TEMPLATES_QUERY_KEYS.GET_ALL_TEMPLATES],
    queryFn: async () => {
      const res = await getCollectionData({
        tableName: "treatments",
        dataLimit: limit,
      });

      if (Array.isArray(res)) {
        return res;
      } else {
        return { error: "Error fetching treatment templates" };
      }
    },
  });
};
