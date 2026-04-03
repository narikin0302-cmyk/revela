"use client";

import { useEffect, useState } from "react";
import { fetchDiagnosisStats } from "@/lib/supabase";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const MBTI_COLORS: Record<string, string> = {
  INTJ: "#7c3aed", INTP: "#8b5cf6", ENTJ: "#6d28d9", ENTP: "#a78bfa",
  INFJ: "#059669", INFP: "#10b981", ENFJ: "#047857", ENFP: "#34d399",
  ISTJ: "#1d4ed8", ISFJ: "#2563eb", ESTJ: "#1e40af", ESFJ: "#3b82f6",
  ISTP: "#92400e", ISFP: "#d97706", ESTP: "#b45309", ESFP: "#f59e0b",
};

const LOVE_COLORS: Record<string, string> = {
  LCRO: "#e879f9", LCRE: "#d946ef", LCPO: "#c026d3", LCPE: "#a21caf",
  LARO: "#f472b6", LARE: "#ec4899", LAPO: "#db2777", LAPE: "#be185d",
  FCRO: "#60a5fa", FCRE: "#3b82f6", FCPO: "#2563eb", FCPE: "#1d4ed8",
  FARO: "#34d399", FARE: "#10b981", FAPO: "#059669", FAPE: "#047857",
};

const LOVE_NAMES: Record<string, string> = {
  LCRO: "ボス猫", LCRE: "隠れベイビー", LCPO: "主役体質", LCPE: "ツンデレヤンキー",
  LARO: "憧れの先輩", LARE: "カリスマバランサー", LAPO: "パーフェクトカメレオン", LAPE: "キャプテンライオン",
  FCRO: "ロマンスマジシャン", FCRE: "ちゃっかりうさぎ", FCPO: "恋愛モンスター", FCPE: "忠犬ハチ公",
  FARO: "不思議生命体", FARE: "敏腕マネージャー", FAPO: "デビル天使", FAPE: "最後の恋人",
};

type Stats = Awaited<ReturnType<typeof fetchDiagnosisStats>>;

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiagnosisStats().then((s) => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xs tracking-widest opacity-40">読み込み中...</p>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xs tracking-widest opacity-40">データがまだありません</p>
      </div>
    );
  }

  const mbtiData = stats.mbtiRanking.map((r) => ({
    name: r.type,
    value: r.count,
    pct: Math.round((r.count / stats.total) * 100),
  }));

  const loveData = stats.loveRanking.map((r) => ({
    name: r.type,
    label: LOVE_NAMES[r.type] ?? r.type,
    value: r.count,
    pct: Math.round((r.count / stats.total) * 100),
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.4em] mb-3 opacity-40">STATISTICS</p>
        <h1 className="text-2xl font-light mb-2" style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}>
          revelaユーザー統計
        </h1>
        <p className="text-xs opacity-40">総診断数: {stats.total.toLocaleString()}人</p>
      </div>

      {/* MBTI ランキング */}
      <section className="mb-14">
        <p className="text-xs tracking-[0.3em] mb-6 opacity-50">性格タイプ分布</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={mbtiData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} strokeWidth={0}>
                {mbtiData.map((entry) => (
                  <Cell key={entry.name} fill={MBTI_COLORS[entry.name] ?? "#888"} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}人`, ""]}
                contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5">
            {mbtiData.slice(0, 8).map((r, i) => (
              <div key={r.name} className="flex items-center gap-2 text-xs">
                <span className="opacity-30 w-4">{i + 1}</span>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: MBTI_COLORS[r.name] ?? "#888" }} />
                <span className="font-mono w-10">{r.name}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: MBTI_COLORS[r.name] ?? "#888" }} />
                </div>
                <span className="opacity-50 w-8 text-right">{r.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* キャラクターコード ランキング */}
      <section className="mb-14">
        <p className="text-xs tracking-[0.3em] mb-6 opacity-50">本音タイプ 分布</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={loveData} margin={{ top: 0, right: 0, left: -20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
            <Tooltip
              formatter={(value) => [`${value}人`, ""]}
              contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
              labelFormatter={(label) => `${label}（${LOVE_NAMES[String(label)] ?? ""}）`}
              labelStyle={{ color: "rgba(255,255,255,0.7)" }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {loveData.map((entry) => (
                <Cell key={entry.name} fill={LOVE_COLORS[entry.name] ?? "#888"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* TOP10 コンボ */}
      <section>
        <p className="text-xs tracking-[0.3em] mb-5 opacity-50">人気コンボ TOP10</p>
        <div className="space-y-2">
          {stats.comboRanking.map((r, i) => {
            const [mbti, love] = r.combo.split("-");
            const pct = Math.round((r.count / stats.total) * 100);
            return (
              <div key={r.combo} className="flex items-center gap-3 text-xs">
                <span className="opacity-30 w-4">{i + 1}</span>
                <span className="font-mono" style={{ color: MBTI_COLORS[mbti] ?? "#fff" }}>{mbti}</span>
                <span className="opacity-30">×</span>
                <span style={{ color: LOVE_COLORS[love] ?? "#fff" }}>{LOVE_NAMES[love] ?? love}</span>
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: MBTI_COLORS[mbti] ?? "#888" }} />
                </div>
                <span className="opacity-40 w-10 text-right">{r.count}人</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
