import { supabase } from "@/lib/supabaseClient";

export const sendSOS = async (
  category: string,
  status: string
) => {
  const { data, error } = await supabase
    .from("reports")
    .insert([
      {
        category,
        status,
      },
    ]);

  if (error) {
    throw error;
  }

  return { data };
};