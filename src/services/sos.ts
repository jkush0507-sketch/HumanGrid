import { supabase } from "../lib/supabase";

export const sendSOS = async (
  category: string,
  status: string
) => {
  return await supabase.from("reports").insert([
    {
      category,
      status,
    },
  ]);
};