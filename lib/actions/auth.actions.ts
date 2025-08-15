import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export const signOut = async () => {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    toast.error("Failed to logout");
  } else {
    toast.success("Successfully logged out");
    redirect("/login");
  }
};

export async function signup({
  email,
  password,
  metadata,
}: {
  email: string;
  password: string;
  metadata?: any;
}) {
  const supabase = createClient();

  const signupData = {
    email,
    password,
    options: {
      data: metadata,
    },
  };

  const { data, error } = await supabase.auth.signUp(signupData);

  if (error) {
    return { error: error.message };
  } else {
    return data;
  }
}
