import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── 診断統計 ─────────────────────────────────────────────────

export async function trackDiagnosisResult(params: {
  mbti: string;
  loveType: string;
  zodiac?: string;
  tarot?: string;
  birthYear?: number;
}) {
  try {
    await supabase.from("diagnosis_stats").insert({
      mbti: params.mbti,
      love_type: params.loveType,
      zodiac: params.zodiac ?? null,
      tarot: params.tarot ?? null,
      birth_year: params.birthYear ?? null,
    });
  } catch {
    // 統計送信失敗はサイレントに無視
  }
}

export async function fetchDiagnosisStats(): Promise<{
  total: number;
  mbtiRanking: { type: string; count: number }[];
  loveRanking: { type: string; count: number }[];
  comboRanking: { combo: string; count: number }[];
}> {
  const { data } = await supabase
    .from("diagnosis_stats")
    .select("mbti, love_type");

  if (!data || data.length === 0) {
    return { total: 0, mbtiRanking: [], loveRanking: [], comboRanking: [] };
  }

  const mbtiCount: Record<string, number> = {};
  const loveCount: Record<string, number> = {};
  const comboCount: Record<string, number> = {};

  for (const row of data) {
    mbtiCount[row.mbti] = (mbtiCount[row.mbti] ?? 0) + 1;
    loveCount[row.love_type] = (loveCount[row.love_type] ?? 0) + 1;
    const combo = `${row.mbti}-${row.love_type}`;
    comboCount[combo] = (comboCount[combo] ?? 0) + 1;
  }

  const sort = (rec: Record<string, number>) =>
    Object.entries(rec)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

  return {
    total: data.length,
    mbtiRanking: sort(mbtiCount),
    loveRanking: sort(loveCount),
    comboRanking: sort(comboCount).slice(0, 10).map(({ type, count }) => ({ combo: type, count })),
  };
}

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
