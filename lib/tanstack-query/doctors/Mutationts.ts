import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/lib/actions/supabase.actions";
import { DOCTOR_QUERY_KEYS } from "@/lib/tanstack-query/doctors/Keys";
import { toast } from "sonner";
import { signup } from "@/lib/actions/auth.actions";

export const useAddDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      values,
      onSuccess,
    }: {
      values: { email: string; address: string; name: string; phone: string };
      onSuccess?: () => void;
    }) => {
      await signup({
        email: values.email,
        password: values.email,
        metadata: {
          role: "doctor",
          address: values.address,
          email: values.email,
          name: values.name,
          phone: values.phone,
        },
      })
        .then((data) => {
          // Signed up
          console.log(data);
          onSuccess?.();
          toast.success("Successfully added the doctor");
        })
        .catch((error) => {
          console.log(error);

          return toast.error("Failed to add the account for doctor");
        });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [DOCTOR_QUERY_KEYS.GET_ALL_DOCTORS],
      });
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      onSuccess,
    }: {
      userId: any;
      onSuccess?: () => void;
    }) => {
      const res = await deleteUser({
        userId,
        errorFallback: "Failed to delete doctor",
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(`Successfully deleted the doctor`);
        onSuccess?.();
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [DOCTOR_QUERY_KEYS.GET_ALL_DOCTORS],
      });
    },
  });
};
