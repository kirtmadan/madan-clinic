import { useQuery } from "@tanstack/react-query";
import { PATIENT_QUERY_KEYS } from "@/lib/tanstack-query/patients/Keys";
import { getCollectionData, getData } from "@/lib/actions/supabase.actions";

export const useGetAllPatients = ({
  limit,
  select,
  status,
  all,
}: {
  limit?: number;
  select?: string;
  status?: string;
  all?: boolean;
}) => {
  return useQuery({
    queryKey: [PATIENT_QUERY_KEYS.GET_ALL_PATIENTS],
    queryFn: async () => {
      const res = await getCollectionData({
        tableName: "patients",
        limit,
        select,
        filters: all
          ? undefined
          : status === "completed"
            ? [(query: any) => query.eq("status", "completed")]
            : [(query: any) => query.neq("status", "completed")],
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
