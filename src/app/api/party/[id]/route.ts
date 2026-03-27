import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Params = { params: Promise<{ id: string }> };

// ルーム情報 + メンバー一覧取得
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const [roomRes, membersRes] = await Promise.all([
    supabase.from("party_rooms").select("id, status, created_at").eq("id", id).single(),
    supabase.from("party_members").select("id, name, rpg_class, joined_at").eq("room_id", id).order("joined_at"),
  ]);

  if (roomRes.error || !roomRes.data) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json({ room: roomRes.data, members: membersRes.data ?? [] });
}

// メンバー参加
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { name, rpg_class } = await req.json();

  if (!name || !rpg_class) {
    return NextResponse.json({ error: "name and rpg_class are required" }, { status: 400 });
  }

  // ルームが存在するか＆waitingか確認
  const { data: room } = await supabase
    .from("party_rooms")
    .select("status")
    .eq("id", id)
    .single();

  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
  if (room.status !== "waiting") return NextResponse.json({ error: "Room already started" }, { status: 409 });

  const { data, error } = await supabase
    .from("party_members")
    .insert({ room_id: id, name, rpg_class })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ member: data });
}

// 解析開始（ホストのみ）
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { host_token } = await req.json();

  const { data: room } = await supabase
    .from("party_rooms")
    .select("host_token")
    .eq("id", id)
    .single();

  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
  if (room.host_token !== host_token) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { error } = await supabase
    .from("party_rooms")
    .update({ status: "started" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
