import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PartyRoom = {
  id: string;
  host_token: string;
  status: "waiting" | "started";
  created_at: string;
  expires_at: string;
};

export type PartyMember = {
  id: string;
  room_id: string;
  name: string;
  rpg_class: string;
  joined_at: string;
};
