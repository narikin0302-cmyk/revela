"use client";

import { useState } from "react";
import { mbtiDescriptions } from "@/data/questions";
import { tarotCards } from "@/data/tarot";
import { zodiacSigns } from "@/data/seiza";

const MBTI_COLORS: Record<string, { primary: string; group: string }> = {
  INTJ: { primary: "#7c3aed", group: "分析家" }, INTP: { primary: "#8b5cf6", group: "分析家" },
  ENTJ: { primary: "#6d28d9", group: "分析家" }, ENTP: { primary: "#a78bfa", group: "分析家" },
  INFJ: { primary: "#059669", group: "外交家" }, INFP: { primary: "#10b981", group: "外交家" },
  ENFJ: { primary: "#047857", group: "外交家" }, ENFP: { primary: "#34d399", group: "外交家" },
  ISTJ: { primary: "#1d4ed8", group: "番人" }, ISFJ: { primary: "#2563eb", group: "番人" },
  ESTJ: { primary: "#1e40af", group: "番人" }, ESFJ: { primary: "#3b82f6", group: "番人" },
  ISTP: { primary: "#92400e", group: "探検家" }, ISFP: { primary: "#d97706", group: "探検家" },
  ESTP: { primary: "#b45309", group: "探検家" }, ESFP: { primary: "#f59e0b", group: "探検家" },
};

const LOVE_TYPES = [
  { code: "LCRO", nickname: "ボス猫", emoji: "😼", desc: "静かに場を支配する存在感。声を荒げなくても自然と周囲が従う。" },
  { code: "LCRE", nickname: "隠れベイビー", emoji: "🐾", desc: "クールに見えて誰よりも深く人を想う。一度信じた人への誠実さは揺るぎない。" },
  { code: "LCPO", nickname: "主役体質", emoji: "👑", desc: "部屋に入ると空気が変わる。意識せずとも自然と中心にいる。" },
  { code: "LCPE", nickname: "ツンデレヤンキー", emoji: "🔥", desc: "荒削りに見えて内側は熱い。大切な人のためなら何でもする。" },
  { code: "LARO", nickname: "憧れの先輩", emoji: "🌟", desc: "温かさと実力を兼ね備え自然と人が集まる。憧れられながらも誠実に向き合う。" },
  { code: "LARE", nickname: "カリスマバランサー", emoji: "⚡", desc: "対立を調和させ全員が動ける着地点を見つける天才。リーダーと共感力が共存。" },
  { code: "LAPO", nickname: "パーフェクトカメレオン", emoji: "🦋", desc: "どんな環境にも溶け込みながらも自分らしさを失わない。ピンチほど真価を発揮。" },
  { code: "LAPE", nickname: "キャプテンライオン", emoji: "🦁", desc: "守るべき人ができたとき最強になる。優しさと強さを同時に持つ。" },
  { code: "FCRO", nickname: "ロマンスマジシャン", emoji: "🎩", desc: "最適な距離感を保ちながら気づいたら相手を虜にしている戦略家。" },
  { code: "FCRE", nickname: "ちゃっかりうさぎ", emoji: "🐰", desc: "ほんわかしながら場の空気を誰より正確に読む。愛嬌は深い知性から来る。" },
  { code: "FCPO", nickname: "恋愛モンスター", emoji: "👾", desc: "場を盛り上げながら誰かの本音を静かに観察。自然に心の中に入り込む。" },
  { code: "FCPE", nickname: "忠犬ハチ公", emoji: "🐕", desc: "一度信じた人への誠実さは揺らがない。決して裏切らない一貫性が最大の武器。" },
  { code: "FARO", nickname: "不思議生命体", emoji: "🌀", desc: "誰も気づかないことに気づく。独自の視点と突拍子もないアイデアが核心を突く。" },
  { code: "FARE", nickname: "敏腕マネージャー", emoji: "📋", desc: "表舞台には出ないけれど全てを動かしている縁の下の力持ち。" },
  { code: "FAPO", nickname: "デビル天使", emoji: "😇", desc: "行動が読めないのに誰も傷つかない。自由さの根っこに深い思いやりが宿る。" },
  { code: "FAPE", nickname: "最後の恋人", emoji: "💝", desc: "批判せずただ受け入れる大きな器。傷ついた人の心を静かに癒す。" },
];

const ELEMENT_COLORS: Record<string, string> = { 火: "#f87171", 土: "#a78bfa", 風: "#34d399", 水: "#60a5fa" };

type Tab = "mbti" | "chara" | "seiza" | "tarot";

export default function DiagnosisTabs() {
  const [tab, setTab] = useState<Tab>("mbti");

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "mbti", label: "MBTI", icon: "🧠" },
    { id: "chara", label: "キャラクター", icon: "♡" },
    { id: "seiza", label: "星座", icon: "⭐" },
    { id: "tarot", label: "タロット", icon: "🔮" },
  ];

  return (
    <section className="relative px-4 py-16 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <p className="font-cinzel section-label mb-3">WHAT WE DIAGNOSE</p>
        <h2 className="text-2xl sm:text-3xl font-light" style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}>
          4つの診断で読み解く、あなた
        </h2>
        <div className="divider-ornate mt-6">
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>✦</span>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-5 py-2.5 rounded-full text-xs transition-all duration-200"
            style={{
              background: tab === t.id ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
              color: tab === t.id ? "#EDEDED" : "rgba(255,255,255,0.5)",
              border: tab === t.id ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.12)",
              fontWeight: tab === t.id ? 700 : 400,
              letterSpacing: "0.08em",
            }}
          >
            <span className="mr-1.5">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* MBTI */}
      {tab === "mbti" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(mbtiDescriptions).map(([type, info]) => {
            const c = MBTI_COLORS[type] ?? { primary: "rgba(255,255,255,0.5)", group: "" };
            return (
              <div key={type} className="rounded-2xl p-4" style={{ border: `1px solid ${c.primary}33`, background: `${c.primary}0d` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold font-mono" style={{ color: c.primary }}>{type}</span>
                  <span className="text-xs opacity-50">{c.group}</span>
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: "#e8e8e8" }}>{info.title}</p>
                <p className="text-xs opacity-50 leading-relaxed">{info.keywords}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* キャラクター */}
      {tab === "chara" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LOVE_TYPES.map((t) => (
            <div key={t.code} className="rounded-2xl p-4 flex gap-3 items-start" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
              <span className="text-2xl flex-shrink-0">{t.emoji}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)" }}>{t.code}</span>
                  <span className="text-sm font-medium" style={{ color: "#e8a0bf" }}>{t.nickname}</span>
                </div>
                <p className="text-xs opacity-60 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 星座 */}
      {tab === "seiza" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {zodiacSigns.map((z) => {
            const ec = ELEMENT_COLORS[z.element] ?? "rgba(255,255,255,0.5)";
            return (
              <div key={z.name} className="rounded-2xl p-4" style={{ border: `1px solid ${ec}33`, background: `${ec}0d` }}>
                <div className="text-2xl mb-2">{z.symbol}</div>
                <p className="text-sm font-medium mb-1" style={{ color: "#e8e8e8" }}>{z.name}</p>
                <p className="text-xs opacity-50 mb-2">{z.dates}</p>
                <div className="flex gap-1 flex-wrap">
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${ec}20`, color: ec }}>{z.element}属性</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>{z.planet}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* タロット */}
      {tab === "tarot" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tarotCards.map((card) => (
            <div key={card.id} className="rounded-2xl p-4" style={{ border: `1px solid ${card.color}33`, background: `${card.color}0d` }}>
              <div className="flex items-start gap-3 mb-2">
                <span className="text-xl font-bold font-serif flex-shrink-0" style={{ color: card.color, minWidth: 28 }}>{card.symbol}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#e8e8e8" }}>{card.name}</p>
                  <p className="text-xs opacity-40">{card.nameEn}</p>
                </div>
              </div>
              <p className="text-xs mb-1.5" style={{ color: card.color, opacity: 0.8 }}>{card.keywords}</p>
              <p className="text-xs opacity-60 leading-relaxed line-clamp-2">{card.upright}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
