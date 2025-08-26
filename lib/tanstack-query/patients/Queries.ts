import { useQuery } from "@tanstack/react-query";
import { PATIENT_QUERY_KEYS } from "@/lib/tanstack-query/patients/Keys";
import { getCollectionData, getData } from "@/lib/actions/supabase.actions";

export const useGetAllPatients = ({ limit }: { limit?: number }) => {
  return useQuery({
    queryKey: [PATIENT_QUERY_KEYS.GET_ALL_PATIENTS],
    queryFn: async () => {
      const res = await getCollectionData({
        tableName: "patients",
        dataLimit: limit,
      });

      if (Array.isArray(res)) {
        return res;
      } else {
        return { error: "Error fetching patients" };
      }
    },
  });
};

export const useGetPatient = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [PATIENT_QUERY_KEYS.GET_PATIENT, id],
    queryFn: async () => {
      const res = await getData({
        tableName: "patients",
        documentId: id,
      });

      if (res?.error) {
        return res?.error;
      } else {
        return res;
      }
    },
    enabled: !!id,
  });
};
