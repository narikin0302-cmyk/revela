import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ランダムな6文字のルームID生成
function generateRoomId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// ランダムなホストトークン生成
function generateToken(): string {
  return crypto.randomUUID();
}

export async function POST() {
  const id = generateRoomId();
  const host_token = generateToken();

  const { error } = await supabase.from("party_rooms").insert({ id, host_token });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id, host_token });
}
