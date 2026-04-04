"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { parseRevelaCode, generateRevelaCode, type ParsedCode } from "@/lib/revelaCodes";
import { getRpgClassByCombo, getRpgSynergy } from "@/data/rpgClasses";
import { zodiacInfo } from "@/lib/calculate";
import { ZODIAC_FLAVOR } from "@/data/seiza";
import { tarotCards } from "@/data/tarot";
import { loveTypeDescriptions, mbtiDescriptions } from "@/data/questions";
import type { LoveType } from "@/data/questions";
import { getMbtiCharaName } from "@/data/charaNames";
import { MBTI_PROFILES, LOVE_PROFILES } from "@/data/personalityProfiles";

// ============================================================
// Yu-Gi-Oh カード用定数
// ============================================================

const MBTI_ADJ: Record<string, string> = {
  ENFP: "自由奔放な",  ENFJ: "カリスマ的な",  ENTP: "革新的な",   ENTJ: "指導力あふれる",
  INFP: "繊細な",      INFJ: "洞察力あふれる", INTP: "論理的な",   INTJ: "戦略的な",
  ESFP: "陽気な",      ESFJ: "思いやりあふれる", ESTP: "行動的な", ESTJ: "実直な",
  ISFP: "芸術的な",    ISFJ: "献身的な",       ISTP: "冷静沈着な", ISTJ: "誠実な",
};

const YGO_ATK: Record<string, number> = {
  LCRO: 2800, LCRE: 2400, LCPO: 3000, LCPE: 2600,
  LARO: 2500, LARE: 2700, LAPO: 2300, LAPE: 2900,
  FCRO: 2200, FCRE: 1900, FCPO: 2100, FCPE: 2000,
  FARO: 1800, FARE: 1700, FAPO: 2000, FAPE: 1600,
};
const YGO_DEF: Record<string, number> = {
  LCRO: 1500, LCRE: 2000, LCPO: 1200, LCPE: 1800,
  LARO: 2200, LARE: 1900, LAPO: 2400, LAPE: 2000,
  FCRO: 2600, FCRE: 2800, FCPO: 2400, FCPE: 2500,
  FARO: 3000, FARE: 2800, FAPO: 2600, FAPE: 3200,
};

// ============================================================
// 星座ひらがな → 漢字マッピング
// ============================================================

const ZODIAC_HIRA_TO_KANJI: Record<string, string> = {
  おひつじ: "牡羊座", おうし: "牡牛座", ふたご: "双子座",
  かに: "蟹座", しし: "獅子座", おとめ: "乙女座",
  てんびん: "天秤座", さそり: "蠍座", いて: "射手座",
  やぎ: "山羊座", みずがめ: "水瓶座", うお: "魚座",
};

const ELEMENT_COLOR: Record<string, string> = {
  火: "#f87171", 土: "#a78bfa", 風: "#34d399", 水: "#60a5fa",
};

function mbtiAdjConj(adj: string): string {
  if (adj.endsWith("な")) return adj.slice(0, -1) + "で";
  if (adj.endsWith("る")) return adj.slice(0, -1) + "て";
  return adj;
}

const LOVE_ADJ: Record<string, string> = {
  ALRF: "独立心あふれる", ALRP: "冷静沈着な",
  ALVF: "華やかな",       ALVP: "野心的な",
  AERF: "英雄志向の",     AERP: "義理堅い",
  AEVF: "無敵な",         AEVP: "信念に生きる",
  SLRF: "洞察力鋭い",     SLRP: "謎めいた",
  SLVF: "個性的な",       SLVP: "真理を求める",
  SERF: "自然体な",       SERP: "縁の下で支える",
  SEVF: "自由奔放な",     SEVP: "包容力のある",
};

// ============================================================
// 矛盾・発見 生成ロジック（既存ロジック維持）
// ============================================================

interface Insight { title: string; body: string; }

function generateInsights(code: ParsedCode): Insight[] {
  const { mbti, loveType, zodiac } = code;
  const isIntrovert  = mbti[0] === "I";
  const isIntuitive  = mbti[1] === "N";
  const isFeeling    = mbti[2] === "F";
  const isJudging    = mbti[3] === "J";
  const isLeader     = loveType[0] === "L";
  const isCool       = loveType[1] === "C";
  const isReserved   = loveType[2] === "R";
  const zodiacKanji  = ZODIAC_HIRA_TO_KANJI[zodiac ?? ""] ?? "";
  const element      = zodiacInfo[zodiacKanji]?.element ?? "";

  const insights: Insight[] = [];

  if (!isFeeling && !isCool) insights.push({
    title: "論理的なのに、恋愛では感情が溢れる",
    body: "普段は理性で判断するあなたが、恋愛では感情に動かされる。これは矛盾ではなく、心から信頼した人だけに見せる本当の顔。その振れ幅こそがあなたの深さです。",
  });
  if (isFeeling && isCool) insights.push({
    title: "感じているのに、クールに見える",
    body: "内側では誰より豊かに感じているのに、恋愛では距離を保つ。傷つくことへの恐れが、クールな外見を作り出しているのかもしれません。その繊細さは弱さではありません。",
  });
  if (isIntrovert && isLeader) insights.push({
    title: "引っ込み思案に見えて、実は場をリードする",
    body: "一人の時間を必要とするのに、気づけば中心にいる。エネルギーを内側で蓄えているからこそ、ここぞという場面で圧倒的な存在感を放てるのです。",
  });
  if (!isIntrovert && !isLeader) insights.push({
    title: "社交的なのに、関係では受け身",
    body: "誰とでも話せる社交性を持ちながら、深い関係では相手に合わせてしまう。場の空気を読む力が高いからこそ、自分より相手を優先する癖がある。",
  });
  if (isJudging && !isReserved) insights.push({
    title: "計画的な外見と、情熱的な内面",
    body: "生活はきっちり整えたいのに、恋愛では情熱に突き動かされる。理性と衝動の間で揺れることが、あなたを人間らしく魅力的にしています。",
  });
  if (!isJudging && isReserved) insights.push({
    title: "自由を求めながら、現実的に愛する",
    body: "型にはまることを嫌う一方で、恋愛では意外にも地に足のついた関係を求める。自由でいたい気持ちと、安定したい気持ちが共存しています。",
  });
  if ((element === "火" || element === "風") && isIntrovert) insights.push({
    title: `${element}のエレメントが隠す情熱`,
    body: `${element}のエレメントを持つあなたには、根底に強いエネルギーが流れている。内向的な性格がそれをフィルターし、外からは落ち着いて見えるが、一人になったとき本当の炎が燃えている。`,
  });
  if ((element === "水" || element === "土") && !isIntrovert) insights.push({
    title: "外向きの明るさの奥にある繊細さ",
    body: `${element}のエレメントは深い感受性を持つ。外向きで明るいあなたの内側には、人が思う以上に繊細な感情の波がある。その深さに気づく人は、少ないかもしれません。`,
  });
  if (isIntrovert && !isIntuitive && loveType[3] === "O") insights.push({
    title: "現実的に生きながら、心は開いている",
    body: "経験と事実を大切にするのに、恋愛では自分を隠さず表現する。その素直さが、あなたの最大の武器かもしれません。",
  });

  return insights.slice(0, 3);
}

// ============================================================
// Main Page
// ============================================================

export default function MePage() {
  const [code, setCode] = useState<ParsedCode | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("revela_mycode");
      if (saved) setCode(parseRevelaCode(saved));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  // 未診断
  if (!code) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div style={{ fontSize: 52, marginBottom: 20, opacity: 0.3 }}>✦</div>
        <h1 style={{ fontSize: "clamp(1.4rem,5vw,2rem)", fontWeight: 300, fontFamily: "var(--font-noto-serif-jp),serif", marginBottom: 12 }}>
          まだ診断が完了していません
        </h1>
        <p style={{ fontSize: 13, opacity: 0.5, marginBottom: 32 }}>
          現在地・本音診断を受けると、あなたの統合プロフィールが表示されます。
        </p>
        <Link href="/shindan" style={{ padding: "14px 32px", borderRadius: 9999, background: "transparent", border: "1px solid rgba(255,255,255,0.35)", color: "#EDEDED", fontWeight: 500, fontSize: 14, textDecoration: "none", letterSpacing: "0.08em" }}>
          分析をはじめる →
        </Link>
      </div>
    );
  }

  // データ解決
  const zodiacKanji  = ZODIAC_HIRA_TO_KANJI[code.zodiac ?? ""] ?? "";
  const zodiacData   = zodiacKanji ? zodiacInfo[zodiacKanji] : null;
  const _zodiacFlavor = zodiacKanji ? ZODIAC_FLAVOR[zodiacKanji] : null;
  void _zodiacFlavor;
  const _ec          = zodiacData ? (ELEMENT_COLOR[zodiacData.element] ?? "rgba(255,255,255,0.5)") : "rgba(255,255,255,0.5)";
  void _ec;

  const _tarotCard   = null;
  void _tarotCard;
  const loveInfo     = loveTypeDescriptions[code.loveType as LoveType];
  const mbtiInfo     = mbtiDescriptions[code.mbti];
  const charaName    = getMbtiCharaName(code.mbti, code.loveType) ?? loveInfo?.nickname ?? code.loveType;

  const rpgClass  = getRpgClassByCombo(code.mbti, code.loveType);
  const synergy   = rpgClass && zodiacData ? getRpgSynergy(rpgClass.name, zodiacData.element) : null;

  const insights  = generateInsights(code);

  return (
    <div className="relative min-h-screen px-4 py-16 max-w-2xl mx-auto">
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .afu { animation: fadeUp 0.6s ease forwards; }
      `}</style>

      {/* 背景orb */}
      <div className="orb w-72 h-72 opacity-10" style={{ background: "radial-gradient(circle,rgba(255,255,255,0.3),transparent)", top: "5%", right: "-10%" }} />
      <div className="orb w-60 h-60 opacity-8" style={{ background: "radial-gradient(circle,#e8a0bf,transparent)", bottom: "15%", left: "-10%" }} />

      {/* ── ヘッダー ── */}
      <div className="afu text-center mb-10" style={{ animationDelay: "0s" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.4em", color: "rgba(255,255,255,0.55)", opacity: 0.6, marginBottom: 12 }}>
          YOUR REVELA PROFILE
        </p>
        <h1 style={{ fontSize: "clamp(1.6rem,6vw,2.4rem)", fontWeight: 300, fontFamily: "var(--font-noto-serif-jp),serif", marginBottom: 8 }}>
          あなたというコード
        </h1>
        {charaName && (
          <p style={{ fontSize: "clamp(1rem,4vw,1.2rem)", fontWeight: 700, color: "rgba(255,255,255,0.55)", marginBottom: 12, fontFamily: "var(--font-noto-serif-jp),serif" }}>
            「{charaName}」
          </p>
        )}
        <div style={{ display: "inline-block", padding: "8px 20px", borderRadius: 9999, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.35)", fontFamily: "monospace", fontSize: "clamp(0.85rem,3.5vw,1.1rem)", fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.12em", marginBottom: 8 }}>
          {rpgClass && generateRevelaCode(code.mbti, code.loveType, rpgClass.name)}
        </div>
        <div className="divider-gold w-16 mx-auto mt-4" />
      </div>

      {/* ── キャラクターカード（遊戯王風） ── */}
      {(() => {
        const atk = YGO_ATK[code.loveType] ?? 2000;
        const def = YGO_DEF[code.loveType] ?? 1500;
        const stars = Math.max(4, Math.min(9, Math.round(atk / 350)));
        const grp = code.loveType.charAt(0);
        const sec = code.loveType.charAt(1);
        const rpgCardClass = rpgClass;
        const rpgName  = rpgCardClass?.name  ?? "冒険者";
        const rpgEmoji = rpgCardClass?.emoji ?? "⚔️";
        const cardName = `${mbtiAdjConj(MBTI_ADJ[code.mbti] ?? "")}${LOVE_ADJ[code.loveType] ?? ""}${rpgName}`;

        const ELEM_STYLE: Record<string, { bg: string; color: string; symbol: string }> = {
          火: { bg: "linear-gradient(135deg,#ff6030,#cc2200)", color: "#fff",    symbol: "🔥" },
          土: { bg: "linear-gradient(135deg,#a08040,#604010)", color: "#f0e0b0", symbol: "🌍" },
          風: { bg: "linear-gradient(135deg,#60d0a0,#208060)", color: "#fff",    symbol: "💨" },
          水: { bg: "linear-gradient(135deg,#4090e0,#1040a0)", color: "#fff",    symbol: "💧" },
        };
        const elemSt = zodiacData ? ELEM_STYLE[zodiacData.element] ?? { bg: "linear-gradient(135deg,#888,#444)", color: "#fff", symbol: "✦" } : { bg: "linear-gradient(135deg,#888,#444)", color: "#fff", symbol: "✦" };
        const attrDisplay = zodiacData ? `${elemSt.symbol} ${zodiacKanji}` : "？";

        const typeKey = `${grp}${sec}`;
        const TYPE_STYLE: Record<string, { frameOuter: string; frameInner: string; nameBg: string; nameColor: string; artBg: string; artAccent: string; cardBg: string; typeLabel: string }> = {
          LC: { frameOuter: "#d4af37", frameInner: "#8b6914", nameBg: "linear-gradient(90deg,#1a1000,#2d1f00,#1a1000)", nameColor: "#f0d060", artBg: "linear-gradient(160deg,#0d0800 0%,#1c1400 50%,#0a0600 100%)", artAccent: "#d4af37", cardBg: "linear-gradient(175deg,#1c1200 0%,#0e0900 100%)", typeLabel: "カリスマ" },
          LA: { frameOuter: "#e8834a", frameInner: "#8b3a00", nameBg: "linear-gradient(90deg,#1a0600,#2d1000,#1a0600)", nameColor: "#ffb070", artBg: "linear-gradient(160deg,#100500 0%,#1e0a00 50%,#0d0300 100%)", artAccent: "#e8834a", cardBg: "linear-gradient(175deg,#1a0800 0%,#0d0300 100%)", typeLabel: "感情型" },
          FC: { frameOuter: "#8ab4d4", frameInner: "#2a4a6a", nameBg: "linear-gradient(90deg,#030810,#091428,#030810)", nameColor: "#a8d4f0", artBg: "linear-gradient(160deg,#030810 0%,#050f1e 50%,#020608 100%)", artAccent: "#6ab0e8", cardBg: "linear-gradient(175deg,#04080f 0%,#020508 100%)", typeLabel: "神秘" },
          FA: { frameOuter: "#9b59b6", frameInner: "#4a1060", nameBg: "linear-gradient(90deg,#0d001a,#1a0030,#0d001a)", nameColor: "#c87ef8", artBg: "linear-gradient(160deg,#080010 0%,#120020 50%,#050008 100%)", artAccent: "#9b59b6", cardBg: "linear-gradient(175deg,#0d001a 0%,#060008 100%)", typeLabel: "共感" },
        };
        const ts = TYPE_STYLE[typeKey] ?? TYPE_STYLE.LC;

        return (
          <div className="afu mx-auto mb-8" style={{ animationDelay: "0.05s", opacity: 0, width: 260, position: "relative", borderRadius: 10, background: ts.cardBg, boxShadow: `0 16px 60px rgba(0,0,0,0.85), 0 0 30px ${ts.frameOuter}44, inset 0 0 0 3px ${ts.frameOuter}, inset 0 0 0 5px ${ts.frameInner}, inset 0 0 0 7px ${ts.frameOuter}88`, padding: 8 }}>

            {/* カード名バー */}
            <div style={{ background: ts.nameBg, border: `1px solid ${ts.frameOuter}88`, borderRadius: 4, padding: "5px 8px", marginBottom: 5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: ts.nameColor, letterSpacing: "0.02em", lineHeight: 1.2, flex: 1 }}>{cardName}</span>
            </div>

            {/* レベル星 */}
            <div style={{ textAlign: "right", marginBottom: 5, paddingRight: 2 }}>
              {Array.from({ length: stars }).map((_, i) => (
                <span key={i} style={{ color: ts.frameOuter, fontSize: 14, textShadow: `0 0 6px ${ts.frameOuter}` }}>★</span>
              ))}
            </div>

            {/* イラスト枠 */}
            <div style={{ width: "100%", aspectRatio: "1/1", borderRadius: 4, border: `2px solid ${ts.frameOuter}66`, background: ts.artBg, marginBottom: 6, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }} viewBox="0 0 244 244">
                <circle cx="122" cy="122" r="90" stroke={ts.artAccent} strokeWidth="1" fill="none" />
                <circle cx="122" cy="122" r="60" stroke={ts.artAccent} strokeWidth="0.7" fill="none" />
                <circle cx="122" cy="122" r="30" stroke={ts.artAccent} strokeWidth="0.5" fill="none" />
                {[0,45,90,135,180,225,270,315].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  return <line key={deg} x1="122" y1="122" x2={122 + 90 * Math.cos(rad)} y2={122 + 90 * Math.sin(rad)} stroke={ts.artAccent} strokeWidth="0.5" />;
                })}
                <polygon points="122,32 202,172 42,172" stroke={ts.artAccent} strokeWidth="1" fill="none" />
                <polygon points="122,212 42,72 202,72" stroke={ts.artAccent} strokeWidth="0.7" fill="none" />
              </svg>
              <span style={{ fontSize: 72, position: "relative", zIndex: 1, filter: `drop-shadow(0 0 16px ${ts.artAccent})` }}>{rpgEmoji}</span>
              <div style={{ position: "absolute", bottom: 6, right: 6, background: `${ts.artAccent}22`, border: `1px solid ${ts.artAccent}66`, borderRadius: 3, padding: "2px 6px", fontSize: 9, color: ts.artAccent, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.1em" }}>
                {mbtiInfo?.displayName ?? code.mbti} × {loveInfo?.nickname ?? code.loveType}
              </div>
            </div>

            {/* 星座／タイプ行 */}
            <div style={{ fontSize: 9, color: `${ts.nameColor}cc`, marginBottom: 4, paddingLeft: 2, fontWeight: 600, letterSpacing: "0.05em" }}>
              {`【${rpgName}】`}
            </div>

            {/* テキストボックス */}
            <div style={{ background: `${ts.artAccent}0a`, border: `1px solid ${ts.frameOuter}44`, borderRadius: 4, padding: "6px 7px", marginBottom: 8, fontSize: 9, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, minHeight: 52 }}>
              {loveInfo?.subtitle}。{loveInfo?.motto}
              {rpgCardClass && (
                <span style={{ display: "block", marginTop: 4, opacity: 0.7, borderTop: `1px solid ${ts.frameOuter}33`, paddingTop: 4 }}>
                  {rpgEmoji}【{rpgName}】{rpgCardClass.tagline}
                </span>
              )}
            </div>

            {/* ATK / DEF */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: `1px solid ${ts.frameOuter}44`, paddingTop: 6 }}>
              {[{ label: "ATK", val: atk }, { label: "DEF", val: def }].map(({ label, val }) => (
                <div key={label} style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 9, color: `${ts.nameColor}99`, letterSpacing: "0.1em" }}>{label}/</span>
                  <span style={{ fontSize: 13, fontWeight: 900, color: ts.nameColor, fontFamily: "monospace", letterSpacing: "0.05em" }}>{String(val).padStart(4, "\u2007")}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── RPGクラスカード ── */}
      {rpgClass && (
        <div className="afu mb-5 rounded-2xl p-5" style={{ animationDelay: "0.1s", opacity: 0, background: `${rpgClass.color}0d`, border: `1px solid ${rpgClass.color}44` }}>
          <p className="text-xs tracking-widest mb-3 opacity-50" style={{ color: rpgClass.color }}>⚔️ 職場RPGクラス</p>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{rpgClass.emoji}</span>
            <div>
              <p className="text-xl font-bold mb-0.5" style={{ color: rpgClass.color }}>{rpgClass.name}</p>
              <p className="text-xs opacity-40">{rpgClass.nameEn}</p>
            </div>
          </div>
          <p className="text-sm mb-3 leading-relaxed" style={{ color: rpgClass.color, opacity: 0.8 }}>「{rpgClass.tagline}」</p>
          <p className="text-xs leading-relaxed opacity-65 mb-4">{rpgClass.desc}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {rpgClass.strengths.map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full" style={{ background: `${rpgClass.color}18`, border: `1px solid ${rpgClass.color}33`, color: rpgClass.color }}>{s}</span>
            ))}
          </div>
          {rpgClass.career.length > 0 && (
            <p className="text-xs opacity-45 mb-4">{rpgClass.career.join("  ·  ")}</p>
          )}
          {synergy && (
            <div className="rounded-xl p-3" style={{ background: `${rpgClass.color}12`, border: `1px solid ${rpgClass.color}44` }}>
              <p className="text-xs tracking-widest mb-1 opacity-70" style={{ color: rpgClass.color }}>✦ 属性オーラ / {zodiacData?.element}属性</p>
              <p className="text-sm font-bold mb-1" style={{ color: rpgClass.color }}>「{synergy.synergyName}」</p>
              <p className="text-xs leading-relaxed opacity-70">{synergy.synergyDesc}</p>
            </div>
          )}
        </div>
      )}

      {/* ── 現在地 + 本音 ── */}
      <div className="afu grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5" style={{ animationDelay: "0.2s", opacity: 0 }}>
        {/* 現在地 */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)" }}>
          <p className="text-xs tracking-widest mb-3 opacity-50" style={{ color: "rgba(255,255,255,0.55)" }}>🧠 現在地</p>
          {mbtiInfo && (
            <>
              <p className="text-base font-bold mb-1" style={{ color: "rgba(255,255,255,0.9)" }}>{mbtiInfo.displayName}</p>
              <p className="text-xs opacity-60 mb-1">{mbtiInfo.subtitle}</p>
              <p className="text-xs opacity-40 leading-relaxed">{mbtiInfo.keywords}</p>
            </>
          )}
        </div>

        {/* 本音 */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(232,160,191,0.05)", border: "1px solid rgba(232,160,191,0.2)" }}>
          <p className="text-xs tracking-widest mb-3 opacity-50" style={{ color: "#e8a0bf" }}>✦ 本音</p>
          {loveInfo && (
            <>
              <p className="text-base font-bold mb-1" style={{ color: "#e8a0bf" }}>{loveInfo.nickname}</p>
              <p className="text-xs opacity-60 mb-1">{loveInfo.subtitle}</p>
              <p className="text-xs opacity-40 leading-relaxed">{loveInfo.motto}</p>
            </>
          )}
        </div>
      </div>

      {/* ── 就活・転職キーワード ── */}
      {(() => {
        const mp = MBTI_PROFILES[code.mbti];
        const lp = LOVE_PROFILES[code.loveType];
        if (!mp || !lp) return null;
        return (
          <div className="afu mb-5 rounded-2xl p-5" style={{ animationDelay: "0.35s", opacity: 0, background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.2)" }}>
            <p className="text-xs tracking-widest mb-4 opacity-70" style={{ color: "#fbbf24" }}>💼 就活・転職キーワード</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "強み軸",    value: mp.strength },
                { label: "本音の動機", value: lp.motivation },
                { label: "面接の軸",  value: `${mp.selfPR}。${lp.interviewPhrase}。` },
                { label: "合う環境",  value: mp.environment },
                { label: "弱みの傾向", value: lp.weakness },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span style={{ fontSize: 10, color: "rgba(251,191,36,0.7)", minWidth: 60, paddingTop: 2, flexShrink: 0 }}>{label}</span>
                  <span className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── 矛盾・発見 ── */}
      {insights.length > 0 && (
        <div className="afu mb-5" style={{ animationDelay: "0.5s", opacity: 0 }}>
          <p className="text-xs tracking-widest text-center mb-4 opacity-40">— あなたの中に潜む矛盾 —</p>
          <div className="flex flex-col gap-3">
            {insights.map((ins, i) => (
              <div key={i} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <p className="text-sm font-bold mb-2" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-noto-serif-jp),serif" }}>✦ {ins.title}</p>
                <p className="text-xs leading-relaxed opacity-75">{ins.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <div className="afu flex flex-col gap-3 mt-8" style={{ animationDelay: "0.6s", opacity: 0 }}>
        <Link href="/shindan" style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: 14, background: "transparent", border: "1px solid rgba(255,255,255,0.25)", color: "#EDEDED", fontWeight: 500, fontSize: 14, textDecoration: "none", letterSpacing: "0.08em" }}>
          診断を更新する
        </Link>
        <Link href="/shindan/aisei" style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: 14, background: "rgba(232,160,191,0.08)", border: "1px solid rgba(232,160,191,0.3)", color: "#e8a0bf", fontSize: 13, textDecoration: "none" }}>
          💞 相性を調べる
        </Link>
        <Link href="/chara?tab=rpg" style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: 14, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa", fontSize: 13, textDecoration: "none" }}>
          ⚔️ 全16クラスを見る
        </Link>
      </div>
    </div>
  );
}
