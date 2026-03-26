"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { RPG_CLASSES, getRpgClassByCombo } from "@/data/rpgClasses";
import Link from "next/link";
import { loveTypeDescriptions, mbtiDescriptions } from "@/data/questions";
import type { LoveType } from "@/data/questions";
import { getMbtiCharaName } from "@/data/charaNames";
import { tarotCards } from "@/data/tarot";
import { zodiacSigns, ZODIAC_FLAVOR } from "@/data/seiza";
import { getHistory } from "@/lib/storage";

// ── MBTI colors ──────────────────────────────────────────────
const MBTI_COLORS: Record<string, { primary: string; bg: string; group: string }> = {
  INTJ: { primary: "#7c3aed", bg: "rgba(124,58,237,0.15)", group: "分析家" },
  INTP: { primary: "#8b5cf6", bg: "rgba(139,92,246,0.15)", group: "分析家" },
  ENTJ: { primary: "#6d28d9", bg: "rgba(109,40,217,0.15)", group: "分析家" },
  ENTP: { primary: "#a78bfa", bg: "rgba(167,139,250,0.15)", group: "分析家" },
  INFJ: { primary: "#059669", bg: "rgba(5,150,105,0.15)", group: "外交家" },
  INFP: { primary: "#10b981", bg: "rgba(16,185,129,0.15)", group: "外交家" },
  ENFJ: { primary: "#047857", bg: "rgba(4,120,87,0.15)", group: "外交家" },
  ENFP: { primary: "#34d399", bg: "rgba(52,211,153,0.15)", group: "外交家" },
  ISTJ: { primary: "#1d4ed8", bg: "rgba(29,78,216,0.15)", group: "番人" },
  ISFJ: { primary: "#2563eb", bg: "rgba(37,99,235,0.15)", group: "番人" },
  ESTJ: { primary: "#1e40af", bg: "rgba(30,64,175,0.15)", group: "番人" },
  ESFJ: { primary: "#3b82f6", bg: "rgba(59,130,246,0.15)", group: "番人" },
  ISTP: { primary: "#92400e", bg: "rgba(146,64,14,0.15)", group: "探検家" },
  ISFP: { primary: "#d97706", bg: "rgba(217,119,6,0.15)", group: "探検家" },
  ESTP: { primary: "#b45309", bg: "rgba(180,83,9,0.15)", group: "探検家" },
  ESFP: { primary: "#f59e0b", bg: "rgba(245,158,11,0.15)", group: "探検家" },
};

// ── LoveType (キャラクター) data ──────────────────────────────
interface CharaType {
  code: LoveType;
  nickname: string;
  emoji: string;
  motto: string;
  subtitle: string;
  description: string;
  group: "L" | "F";
  secondary: "C" | "A";
}

const ALL_TYPES: CharaType[] = [
  { code: "LCRO", nickname: "ボス猫", emoji: "😼", motto: "自分の軸を持ち、場の空気を自然に支配する", subtitle: "自分のペースで世界を掌握するタイプ", description: "あなたは静かに、しかし確実に場を支配する存在。声を荒げなくても、その存在感だけで周囲が自然と従います。冷静さの裏に深い観察眼を持ち、本当に動くべき瞬間を本能的に知っている。", group: "L", secondary: "C" },
  { code: "LCRE", nickname: "隠れベイビー", emoji: "🐾", motto: "クールな外見の内側に、深い誠実さがある", subtitle: "信頼と冷静さで周囲を安心させるタイプ", description: "クールに見えて、実は誰よりも深く人を想っている。感情を表に出さない分、一度信じた人への誠実さは揺るぎない。周囲はあなたの存在によって、なぜか安心感を覚えます。", group: "L", secondary: "C" },
  { code: "LCPO", nickname: "主役体質", emoji: "👑", motto: "存在するだけで、周りに光を与える", subtitle: "自然と注目を集め、場を動かすタイプ", description: "あなたが部屋に入ると、空気が変わる。意識していなくても、自然と中心にいる。その情熱と明るさは周囲を巻き込み、気づけば皆があなたの方向を向いている。", group: "L", secondary: "C" },
  { code: "LCPE", nickname: "ツンデレヤンキー", emoji: "🔥", motto: "熱量で壁を突き破り、大事な人を全力で守る", subtitle: "エネルギーで周囲を巻き込む実行者タイプ", description: "荒削りに見えて、内側は誰よりも熱い。表面のクールさは鎧で、本当は大切な人のためなら何でもする。そのギャップが人を惹きつけ、深い絆を生み出します。", group: "L", secondary: "C" },
  { code: "LARO", nickname: "憧れの先輩", emoji: "🌟", motto: "温かさと実力で、人々の目標になる", subtitle: "包容力で自然に信頼を集めるタイプ", description: "誰もがあなたのそばにいると、もっと頑張れる気がする。温かさと実力を兼ね備え、自然と人が集まってくる。憧れられながらも、ひとりひとりに向き合う誠実さが魅力です。", group: "L", secondary: "A" },
  { code: "LARE", nickname: "カリスマバランサー", emoji: "⚡", motto: "対立を調和させ、全員が動ける状態を作る", subtitle: "リーダー性とバランス感覚を兼ね備えたタイプ", description: "複雑な人間関係でも、あなたの存在が橋渡しになる。対立する意見をうまく統合し、全員が「それで行こう」と思える着地点を見つける天才。リーダーシップと共感力が高いレベルで共存しています。", group: "L", secondary: "A" },
  { code: "LAPO", nickname: "パーフェクトカメレオン", emoji: "🦋", motto: "どんな環境にも染まりながら、自分の本質を失わない", subtitle: "適応力抜群で本領発揮すると無敵なタイプ", description: "どんな環境でも自然に溶け込めるのに、どこにいても「あなたらしさ」は失われない。その柔軟さと本質の強さが組み合わさり、ピンチのときほど真価を発揮します。", group: "L", secondary: "A" },
  { code: "LAPE", nickname: "キャプテンライオン", emoji: "🦁", motto: "誰かのために全力を尽くすとき、最大の力を発揮する", subtitle: "優しさと強さを併せ持つ万能タイプ", description: "守るべき人ができたとき、あなたは最強になる。優しさと強さを同時に持ち、どんな局面でも諦めない。その献身は周囲の人の心に深く刻まれます。", group: "L", secondary: "A" },
  { code: "FCRO", nickname: "ロマンスマジシャン", emoji: "🎩", motto: "場の空気を読んで最適解を導く", subtitle: "距離感の達人で場を読む戦略家タイプ", description: "いつでも最適な距離感を保ちながら、気づいたら相手を虜にしている。そのミステリアスな雰囲気と鋭い観察眼が、独特の魅力を生み出します。", group: "F", secondary: "C" },
  { code: "FCRE", nickname: "ちゃっかりうさぎ", emoji: "🐰", motto: "柔らかさの裏に、鋭い観察眼を持っている", subtitle: "愛嬌と冷静さを使い分ける直感派タイプ", description: "かわいらしい外見と鋭い本質の落差が、人を不思議と引きつける。ほんわかしているようで、実は場の空気を誰より正確に読んでいる。", group: "F", secondary: "C" },
  { code: "FCPO", nickname: "恋愛モンスター", emoji: "👾", motto: "場を盛り上げながら、誰よりも深く人を見ている", subtitle: "ムードメーカーで本質は優しい魅力派タイプ", description: "表向きは場を盛り上げるムードメーカー。でもその目は、常に誰かの本音を静かに観察している。気づいたら人の心の中に自然と入り込んでいる、不思議な魅力の持ち主です。", group: "F", secondary: "C" },
  { code: "FCPE", nickname: "忠犬ハチ公", emoji: "🐕", motto: "一度決めた信念を、どんな状況でも貫き通す", subtitle: "誠実で感情豊かな真っ直ぐなタイプ", description: "一度信じた人への誠実さは、何があっても揺らがない。感情をストレートに表現する正直さと、決して裏切らない一貫性が最大の武器。", group: "F", secondary: "C" },
  { code: "FARO", nickname: "不思議生命体", emoji: "🌀", motto: "普通に見えて、誰も考えない角度から物事を捉える", subtitle: "独自の視点で世界を解釈する観察者タイプ", description: "普通に見えて、実は誰も気づかないことに気づいている。独自の視点から世界を解釈し、突拍子もないアイデアが時に核心を突く。", group: "F", secondary: "A" },
  { code: "FARE", nickname: "敏腕マネージャー", emoji: "📋", motto: "全体を俯瞰し、必要な人に必要なサポートをする", subtitle: "観察力が高く縁の下の力持ちタイプ", description: "表舞台には出ないけれど、あなたがいるから全てが回っている。全体を見渡す冷静な目と、必要な人を必要なタイミングで支える力。", group: "F", secondary: "A" },
  { code: "FAPO", nickname: "デビル天使", emoji: "😇", motto: "予測不能な行動の中に、深い思いやりが宿っている", subtitle: "優しさと自由奔放さを兼ね備えたタイプ", description: "次の行動が全く読めないのに、なぜか傷つく人がいない。その自由奔放さの根っこに、深い思いやりが宿っている。悪魔のような自由さと天使のような優しさが共存する、唯一無二の存在。", group: "F", secondary: "A" },
  { code: "FAPE", nickname: "最後の恋人", emoji: "💝", motto: "どんな人も受け入れる大きな器で、世界を包み込む", subtitle: "器が大きく最も人間力が高いと言われるタイプ", description: "どんな人も、あなたの前では素直になれる。批判せず、ただ受け入れる大きな器。その深い包容力は、傷ついた人の心を静かに癒し、人生の最後に頼りたくなる存在にしています。", group: "F", secondary: "A" },
];

type Tab = "mbti" | "chara" | "seiza" | "tarot" | "rpg";
type FilterGroup = "ALL" | "L" | "F" | "C" | "A";

export default function CharaPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) ?? "mbti";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [filter, setFilter] = useState<FilterGroup>("ALL");
  const [myCode, setMyCode] = useState<string | null>(null);
  const [myMbti, setMyMbti] = useState<string | null>(null);
  const [myZodiac, setMyZodiac] = useState<string | null>(null);
  const [myTarot, setMyTarot] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("revela_mycode");
      if (saved) setMyCode(saved);
      const savedUser = localStorage.getItem("revela_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.mbti) setMyMbti(parsed.mbti);
      }
      const savedZodiac = localStorage.getItem("revela_zodiac");
      if (savedZodiac) setMyZodiac(savedZodiac);
      const history = getHistory();
      if (history.length > 0 && history[0].tarot) setMyTarot(history[0].tarot);
    } catch {
      // ignore
    }
  }, []);

  const TABS = [
    { id: "mbti" as Tab, label: "MBTI", sub: "16タイプ" },
    { id: "chara" as Tab, label: "キャラクター", sub: "16タイプ" },
    { id: "seiza" as Tab, label: "星座", sub: "12星座" },
    { id: "tarot" as Tab, label: "タロット", sub: "10枚" },
    { id: "rpg" as Tab, label: "職業RPG", sub: "16クラス" },
  ];

  const filterBtns: { label: string; value: FilterGroup; desc: string }[] = [
    { label: "すべて", value: "ALL", desc: "全16" },
    { label: "L系", value: "L", desc: "積極的" },
    { label: "F系", value: "F", desc: "受動的" },
    { label: "C系", value: "C", desc: "クール" },
    { label: "A系", value: "A", desc: "感情的" },
  ];

  const filtered = ALL_TYPES.filter((t) => {
    if (filter === "ALL") return true;
    if (filter === "L") return t.group === "L";
    if (filter === "F") return t.group === "F";
    if (filter === "C") return t.secondary === "C";
    if (filter === "A") return t.secondary === "A";
    return true;
  });

  const mbtiList = Object.entries(mbtiDescriptions);

  return (
    <div className="relative min-h-screen px-4 py-12 max-w-5xl mx-auto">
      <div className="orb w-80 h-80 opacity-10" style={{ background: "radial-gradient(circle, #e8a0bf, transparent)", top: "5%", right: "-5%" }} />
      <div className="orb w-60 h-60 opacity-10" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3), transparent)", bottom: "10%", left: "-5%" }} />

      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-xs tracking-[0.4em] mb-3" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.7 }}>
          REVELA GUIDE
        </p>
        <h1 className="text-3xl sm:text-4xl font-light mb-4" style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}>
          タイプ一覧
        </h1>
        <p className="text-sm opacity-50 max-w-md mx-auto leading-relaxed">
          MBTI・キャラクター・星座・タロット・職業RPG。<br />あなたを構成する5つの要素を確認しよう。
        </p>
        <div className="divider-gold w-20 mx-auto mt-4" />
      </div>

      {/* Tab navigation */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-5 py-2.5 rounded-full text-xs transition-all duration-200"
            style={{
              background: tab === t.id ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
              color: tab === t.id ? "#EDEDED" : "rgba(255,255,255,0.5)",
              border: tab === t.id ? "none" : "1px solid rgba(255,255,255,0.3)",
              fontWeight: tab === t.id ? 700 : 400,
              letterSpacing: "0.08em",
            }}
          >
            {t.label}
            <span className="ml-1.5 opacity-60 text-xs">{t.sub}</span>
          </button>
        ))}
      </div>

      {/* ── MBTI タブ ── */}
      {tab === "mbti" && (
        <>
          {myMbti && (() => {
            const info = mbtiDescriptions[myMbti];
            const color = MBTI_COLORS[myMbti];
            if (!info || !color) return null;
            return (
              <div className="rounded-2xl p-5 mb-8 max-w-lg mx-auto" style={{ background: `linear-gradient(135deg, ${color.bg}, rgba(255,255,255,0.06))`, border: `1px solid ${color.primary}66` }}>
                <p className="text-xs tracking-widest mb-2 text-center" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.7 }}>✦ あなたのMBTI</p>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold font-mono" style={{ color: color.primary }}>{myMbti}</span>
                  <div>
                    <p className="text-base font-medium" style={{ color: color.primary }}>{info.title}</p>
                    <p className="text-xs opacity-60 mt-0.5">{info.keywords}</p>
                  </div>
                </div>
              </div>
            );
          })()}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
            {mbtiList.map(([type, info]) => {
              const color = MBTI_COLORS[type] ?? { primary: "rgba(255,255,255,0.5)", bg: "rgba(255,255,255,0.1)", group: "" };
              const isMe = myMbti === type;
              return (
                <div key={type} className="rounded-2xl p-4 animate-fade-in" style={{ border: isMe ? `1px solid ${color.primary}99` : "1px solid rgba(255,255,255,0.08)", background: isMe ? color.bg : "rgba(255,255,255,0.02)" }}>
                  {isMe && <p className="text-xs tracking-widest mb-1.5" style={{ color: color.primary }}>✦ あなた</p>}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-lg font-bold font-mono" style={{ color: color.primary }}>{type}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: color.bg, color: color.primary, border: `1px solid ${color.primary}44` }}>{color.group}</span>
                  </div>
                  <p className="text-sm font-medium mb-1" style={{ color: "#e8e8e8" }}>{info.title}</p>
                  <p className="text-xs opacity-50 leading-relaxed">{info.keywords}</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── キャラクター タブ ── */}
      {tab === "chara" && (
        <>
          {myCode && (() => {
            const mine = ALL_TYPES.find((t) => t.code === myCode);
            if (!mine) return null;
            return (
              <div className="rounded-2xl p-5 mb-8 max-w-lg mx-auto" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(232,160,191,0.08))", border: "1px solid rgba(255,255,255,0.4)" }}>
                <p className="text-xs tracking-widest mb-2 text-center" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.7 }}>✦ あなたのキャラクターコード</p>
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{mine.emoji}</span>
                  <div>
                    <span className="text-xs font-bold tracking-widest px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.4)", color: "rgba(255,255,255,0.55)", fontFamily: "monospace" }}>{mine.code}</span>
                    <p className="text-base font-medium mt-1" style={{ color: "#e8a0bf" }}>{getMbtiCharaName(myMbti, mine.code) ?? mine.nickname}</p>
                    <p className="text-xs opacity-60 mt-0.5">{mine.motto}</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Axis legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 max-w-2xl mx-auto">
            {[
              { axis: "L / F", desc: "積極的 / 受動的", color: "rgba(255,255,255,0.55)" },
              { axis: "C / A", desc: "クール / 感情的", color: "#e8a0bf" },
              { axis: "R / P", desc: "現実的 / 情熱的", color: "#93c5fd" },
              { axis: "O / E", desc: "オープン / 内向的", color: "#6ee7b7" },
            ].map((item) => (
              <div key={item.axis} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-sm font-bold mb-1" style={{ color: item.color }}>{item.axis}</p>
                <p className="text-xs opacity-50">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {filterBtns.map((btn) => (
              <button key={btn.value} onClick={() => setFilter(btn.value)} className="px-4 py-2 rounded-full text-xs transition-all duration-200"
                style={{ background: filter === btn.value ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)", color: filter === btn.value ? "#EDEDED" : "rgba(255,255,255,0.5)", border: filter === btn.value ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.12)", fontWeight: filter === btn.value ? 700 : 400, letterSpacing: "0.08em" }}>
                {btn.label}<span className="ml-1.5 opacity-60 text-xs">{btn.desc}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {filtered.map((type) => (
              <div key={type.code} className="card-glow rounded-2xl p-5 animate-fade-in" style={{ border: myCode === type.code ? "1px solid rgba(255,255,255,0.7)" : "1px solid rgba(255,255,255,0.2)", background: myCode === type.code ? "rgba(255,255,255,0.07)" : undefined }}>
                {myCode === type.code && <p className="text-xs tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>✦ あなた</p>}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl flex-shrink-0">{type.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold tracking-widest px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.55)", fontFamily: "monospace" }}>{type.code}</span>
                    <p className="text-sm font-medium mt-1" style={{ color: "#e8a0bf" }}>{getMbtiCharaName(myMbti, type.code) ?? type.nickname}</p>
                    <p className="text-xs opacity-50 mt-0.5">{type.subtitle}</p>
                  </div>
                </div>
                <p className="text-xs italic mb-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>「{type.motto}」</p>
                <p className="text-xs leading-relaxed opacity-70">{type.description}</p>
                <div className="flex gap-2 mt-3">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: type.group === "L" ? "rgba(255,255,255,0.12)" : "rgba(232,160,191,0.12)", border: type.group === "L" ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(232,160,191,0.3)", color: type.group === "L" ? "rgba(255,255,255,0.7)" : "#e8a0bf" }}>{type.group === "L" ? "L: 積極的" : "F: 受動的"}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: type.secondary === "C" ? "rgba(147,197,253,0.12)" : "rgba(110,231,183,0.12)", border: type.secondary === "C" ? "1px solid rgba(147,197,253,0.3)" : "1px solid rgba(110,231,183,0.3)", color: type.secondary === "C" ? "#93c5fd" : "#6ee7b7" }}>{type.secondary === "C" ? "C: クール" : "A: 感情的"}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── 星座 タブ ── */}
      {tab === "seiza" && (
        <>
          {myZodiac && (() => {
            const mine = zodiacSigns.find((z) => z.name === myZodiac);
            if (!mine) return null;
            return (
              <div className="rounded-2xl p-5 mb-8 max-w-lg mx-auto" style={{ background: "linear-gradient(135deg, rgba(147,197,253,0.1), rgba(255,255,255,0.06))", border: "1px solid rgba(147,197,253,0.4)" }}>
                <p className="text-xs tracking-widest mb-2 text-center" style={{ color: "#93c5fd", opacity: 0.8 }}>✦ あなたの星座</p>
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{mine.symbol}</span>
                  <div>
                    <p className="text-base font-medium" style={{ color: "#93c5fd" }}>{mine.name}</p>
                    <p className="text-xs opacity-60 mt-0.5">{mine.dates} · {mine.element}属性 · {mine.planet}</p>
                  </div>
                </div>
              </div>
            );
          })()}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {zodiacSigns.map((z) => {
              const isMe = myZodiac === z.name;
              const elementColors: Record<string, string> = { 火: "#f87171", 土: "#a78bfa", 風: "#34d399", 水: "#60a5fa" };
              const ec = elementColors[z.element] ?? "rgba(255,255,255,0.5)";
              const flavor = ZODIAC_FLAVOR[z.name];
              return (
                <div key={z.name} className="rounded-2xl p-5 animate-fade-in" style={{ border: isMe ? `1px solid ${ec}88` : "1px solid rgba(255,255,255,0.08)", background: isMe ? `${ec}10` : "rgba(255,255,255,0.02)" }}>
                  {isMe && <p className="text-xs tracking-widest mb-2" style={{ color: ec }}>✦ あなたの星座</p>}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{z.symbol}</span>
                    <div>
                      <p className="text-base font-bold mb-0.5" style={{ color: isMe ? ec : "#e8e8e8" }}>{z.name}</p>
                      <p className="text-xs opacity-50">{z.dates}</p>
                    </div>
                  </div>
                  {flavor && (
                    <>
                      <p className="text-xs font-medium mb-2" style={{ color: ec }}>「{flavor.catchphrase}」</p>
                      <p className="text-xs leading-relaxed opacity-65 mb-3">{flavor.description}</p>
                    </>
                  )}
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${ec}20`, color: ec, border: `1px solid ${ec}44` }}>{z.element}属性</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>{z.planet}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── タロット タブ ── */}
      {tab === "tarot" && (
        <>
          {myTarot && (() => {
            const mine = tarotCards.find((c) => c.name === myTarot);
            if (!mine) return null;
            return (
              <div className="rounded-2xl p-5 mb-8 max-w-lg mx-auto" style={{ background: `linear-gradient(135deg, ${mine.color}20, rgba(255,255,255,0.06))`, border: `1px solid ${mine.color}66` }}>
                <p className="text-xs tracking-widest mb-2 text-center" style={{ color: mine.color, opacity: 0.8 }}>✦ あなたのタロット</p>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold" style={{ color: mine.color, fontFamily: "serif" }}>{mine.symbol}</span>
                  <div>
                    <p className="text-base font-medium" style={{ color: mine.color }}>{mine.name}</p>
                    <p className="text-xs opacity-50 mt-0.5">{mine.nameEn} · {mine.keywords}</p>
                  </div>
                </div>
              </div>
            );
          })()}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {tarotCards.map((card) => {
              const isMe = myTarot === card.name;
              return (
                <div key={card.id} className="rounded-2xl p-5 animate-fade-in" style={{ border: isMe ? `1px solid ${card.color}88` : "1px solid rgba(255,255,255,0.08)", background: isMe ? `${card.color}12` : "rgba(255,255,255,0.02)" }}>
                  {isMe && <p className="text-xs tracking-widest mb-2" style={{ color: card.color }}>✦ あなた</p>}
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl font-bold flex-shrink-0" style={{ color: card.color, fontFamily: "serif", minWidth: 32 }}>{card.symbol}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: isMe ? card.color : "#e8e8e8" }}>{card.name}</p>
                      <p className="text-xs opacity-40 mt-0.5">{card.nameEn}</p>
                    </div>
                  </div>
                  <p className="text-xs mb-3" style={{ color: card.color, opacity: 0.7 }}>{card.keywords}</p>
                  <p className="text-xs leading-relaxed opacity-60 line-clamp-3">{card.upright}</p>
                  <p className="text-xs mt-2 opacity-40">逆位置: {card.reversedMeaning}</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* 職業RPG */}
      {tab === "rpg" && (() => {
        return (
          <>
          {/* Concept intro */}
          <section className="w-full max-w-3xl mx-auto px-2 py-10 md:py-16 flex flex-col items-center text-center mb-4">
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              Concept of Classes
            </p>
            <h2 className="text-xl md:text-3xl font-bold tracking-widest mb-10 leading-tight" style={{ fontFamily: "var(--font-noto-serif-jp), serif", color: "#f0f0f0", textWrap: "balance" } as React.CSSProperties}>
              複雑なパラメーターを、ひとつの「役割」に統合する。
            </h2>
            <div className="text-sm md:text-base leading-loose tracking-wider space-y-5 text-left md:text-center" style={{ color: "rgba(255,255,255,0.5)", textWrap: "pretty" } as React.CSSProperties}>
              <p>
                人間の性格や行動原理は、決して一つの枠に収まるものではありません。<br className="hidden md:block" />
                「論理的だけど、恋愛になると献身的」「自由人に見えて、実は計画的」。<br className="hidden md:block" />
                そんな矛盾とも思える複雑なパラメーターを視覚的に理解するため、<br className="hidden md:block" />
                私たちは「RPGのクラス（職業）」というメタファーを採用しました。
              </p>
              <p>
                世界を牽引する力、他者を癒す力、常識を壊す力。<br className="hidden md:block" />
                あなたが持っている特性を多角的に分析し、<br className="hidden md:block" />
                最も適した「戦い方（クラス）」と「装備（強み）」を導き出します。
              </p>
              <p style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
                これは単なる性格診断ではなく、あなたが社会というフィールドで<br className="hidden md:block" />
                自分の特性を最大限に活かすための「取り扱い説明書」です。<br className="hidden md:block" />
                全16種類のクラスから、あなたの深層に眠る本質を見つけてください。
              </p>
            </div>
            <div className="w-12 h-px mt-12" style={{ background: "rgba(255,255,255,0.15)" }} />
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {RPG_CLASSES.map((cls) => {
              const myLoveType = myCode ? myCode.split("-")[1] : null;
              const myRpgClass = myMbti && myLoveType ? getRpgClassByCombo(myMbti, myLoveType) : null;
              const isMyClass = !!myRpgClass && myRpgClass.name === cls.name;
              return (
                <div key={cls.name} className="rounded-2xl p-5" style={{ background: `${cls.color}0d`, border: `1px solid ${isMyClass ? cls.color : `${cls.color}33`}`, boxShadow: isMyClass ? `0 0 16px ${cls.color}30` : undefined }}>
                  {isMyClass && (
                    <p className="text-xs mb-2 font-bold" style={{ color: cls.color }}>✦ あなたのクラス</p>
                  )}
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl flex-shrink-0">{cls.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-base font-bold" style={{ color: cls.color }}>{cls.name}</span>
                        <span className="text-xs opacity-40">{cls.nameEn}</span>
                      </div>
                      <p className="text-xs opacity-50 mb-1">{cls.tagline}</p>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed opacity-65 mb-3">{cls.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {cls.strengths.map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${cls.color}15`, border: `1px solid ${cls.color}30`, color: cls.color }}>{s}</span>
                    ))}
                  </div>
                  <div className="text-xs opacity-50">
                    {cls.career.map((c, i) => <span key={i}>{i > 0 && " · "}{c}</span>)}
                  </div>
                </div>
              );
            })}
          </div>
          </>
        );
      })()}

      {/* CTA */}
      <div className="text-center">
        <p className="text-sm opacity-60 mb-4">まだ診断していない方はこちら</p>
        <Link href="/shindan" className="btn-outline-primary inline-block px-8 py-4 rounded-full text-sm tracking-widest" style={{ textDecoration: "none" }}>
          分析をはじめる →
        </Link>
      </div>
    </div>
  );
}
