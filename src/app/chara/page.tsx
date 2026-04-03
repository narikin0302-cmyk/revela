"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { RPG_CLASSES, getRpgClassByCombo } from "@/data/rpgClasses";
import { CLASS_ROLES } from "@/data/rpgSynergy";
import Link from "next/link";
import { loveTypeDescriptions, mbtiDescriptions } from "@/data/questions";
import type { LoveType } from "@/data/questions";
import { tarotCards } from "@/data/tarot";
import { zodiacSigns, ZODIAC_FLAVOR } from "@/data/seiza";

// ── MBTI colors ──────────────────────────────────────────────
const MBTI_COLORS: Record<string, { primary: string; bg: string; group: string }> = {
  INTJ: { primary: "#7c3aed", bg: "rgba(124,58,237,0.15)", group: "戦略型" },
  INTP: { primary: "#8b5cf6", bg: "rgba(139,92,246,0.15)", group: "戦略型" },
  ENTJ: { primary: "#6d28d9", bg: "rgba(109,40,217,0.15)", group: "戦略型" },
  ENTP: { primary: "#a78bfa", bg: "rgba(167,139,250,0.15)", group: "戦略型" },
  INFJ: { primary: "#059669", bg: "rgba(5,150,105,0.15)", group: "共鳴型" },
  INFP: { primary: "#10b981", bg: "rgba(16,185,129,0.15)", group: "共鳴型" },
  ENFJ: { primary: "#047857", bg: "rgba(4,120,87,0.15)", group: "共鳴型" },
  ENFP: { primary: "#34d399", bg: "rgba(52,211,153,0.15)", group: "共鳴型" },
  ISTJ: { primary: "#1d4ed8", bg: "rgba(29,78,216,0.15)", group: "堅実型" },
  ISFJ: { primary: "#2563eb", bg: "rgba(37,99,235,0.15)", group: "堅実型" },
  ESTJ: { primary: "#1e40af", bg: "rgba(30,64,175,0.15)", group: "堅実型" },
  ESFJ: { primary: "#3b82f6", bg: "rgba(59,130,246,0.15)", group: "堅実型" },
  ISTP: { primary: "#92400e", bg: "rgba(146,64,14,0.15)", group: "感応型" },
  ISFP: { primary: "#d97706", bg: "rgba(217,119,6,0.15)", group: "感応型" },
  ESTP: { primary: "#b45309", bg: "rgba(180,83,9,0.15)", group: "感応型" },
  ESFP: { primary: "#f59e0b", bg: "rgba(245,158,11,0.15)", group: "感応型" },
};

// ── LoveType (キャラクター) data ──────────────────────────────
interface CharaType {
  code: LoveType;
  nickname: string;
  emoji: string;
  motto: string;
  subtitle: string;
  description: string;
  group: "A" | "S";
  secondary: "L" | "E";
}

const ALL_TYPES: CharaType[] = [
  { code: "ALRF", nickname: "ボス猫", emoji: "😼", motto: "自分の軸を持ち、場の空気を自然に支配する", subtitle: "自分のペースで世界を掌握するタイプ", description: "あなたは静かに、しかし確実に場を支配する存在。声を荒げなくても、その存在感だけで周囲が自然と従います。冷静さの裏に深い観察眼を持ち、本当に動くべき瞬間を本能的に知っている。", group: "A", secondary: "L" },
  { code: "ALRP", nickname: "隠れベイビー", emoji: "🐾", motto: "クールな外見の内側に、深い誠実さがある", subtitle: "信頼と冷静さで周囲を安心させるタイプ", description: "クールに見えて、実は誰よりも深く人を想っている。感情を表に出さない分、一度信じた人への誠実さは揺るぎない。周囲はあなたの存在によって、なぜか安心感を覚えます。", group: "A", secondary: "L" },
  { code: "ALVF", nickname: "主役体質", emoji: "👑", motto: "存在するだけで、周りに光を与える", subtitle: "自然と注目を集め、場を動かすタイプ", description: "あなたが部屋に入ると、空気が変わる。意識していなくても、自然と中心にいる。その情熱と明るさは周囲を巻き込み、気づけば皆があなたの方向を向いている。", group: "A", secondary: "L" },
  { code: "ALVP", nickname: "ツンデレヤンキー", emoji: "🔥", motto: "熱量で壁を突き破り、大事な人を全力で守る", subtitle: "エネルギーで周囲を巻き込む実行者タイプ", description: "荒削りに見えて、内側は誰よりも熱い。表面のクールさは鎧で、本当は大切な人のためなら何でもする。そのギャップが人を惹きつけ、深い絆を生み出します。", group: "A", secondary: "L" },
  { code: "AERF", nickname: "憧れの先輩", emoji: "🌟", motto: "温かさと実力で、人々の目標になる", subtitle: "包容力で自然に信頼を集めるタイプ", description: "誰もがあなたのそばにいると、もっと頑張れる気がする。温かさと実力を兼ね備え、自然と人が集まってくる。憧れられながらも、ひとりひとりに向き合う誠実さが魅力です。", group: "A", secondary: "E" },
  { code: "AERP", nickname: "カリスマバランサー", emoji: "⚡", motto: "対立を調和させ、全員が動ける状態を作る", subtitle: "リーダー性とバランス感覚を兼ね備えたタイプ", description: "複雑な人間関係でも、あなたの存在が橋渡しになる。対立する意見をうまく統合し、全員が「それで行こう」と思える着地点を見つける天才。リーダーシップと共感力が高いレベルで共存しています。", group: "A", secondary: "E" },
  { code: "AEVF", nickname: "パーフェクトカメレオン", emoji: "🦋", motto: "どんな環境にも染まりながら、自分の本質を失わない", subtitle: "適応力抜群で本領発揮すると無敵なタイプ", description: "どんな環境でも自然に溶け込めるのに、どこにいても「あなたらしさ」は失われない。その柔軟さと本質の強さが組み合わさり、ピンチのときほど真価を発揮します。", group: "A", secondary: "E" },
  { code: "AEVP", nickname: "キャプテンライオン", emoji: "🦁", motto: "誰かのために全力を尽くすとき、最大の力を発揮する", subtitle: "優しさと強さを併せ持つ万能タイプ", description: "守るべき人ができたとき、あなたは最強になる。優しさと強さを同時に持ち、どんな局面でも諦めない。その献身は周囲の人の心に深く刻まれます。", group: "A", secondary: "E" },
  { code: "SLRF", nickname: "ロマンスマジシャン", emoji: "🎩", motto: "場の空気を読んで最適解を導く", subtitle: "距離感の達人で場を読む戦略家タイプ", description: "いつでも最適な距離感を保ちながら、気づいたら相手を虜にしている。そのミステリアスな雰囲気と鋭い観察眼が、独特の魅力を生み出します。", group: "S", secondary: "L" },
  { code: "SLRP", nickname: "ちゃっかりうさぎ", emoji: "🐰", motto: "柔らかさの裏に、鋭い観察眼を持っている", subtitle: "愛嬌と冷静さを使い分ける直感派タイプ", description: "かわいらしい外見と鋭い本質の落差が、人を不思議と引きつける。ほんわかしているようで、実は場の空気を誰より正確に読んでいる。", group: "S", secondary: "L" },
  { code: "SLVF", nickname: "恋愛モンスター", emoji: "👾", motto: "場を盛り上げながら、誰よりも深く人を見ている", subtitle: "ムードメーカーで本質は優しい魅力派タイプ", description: "表向きは場を盛り上げるムードメーカー。でもその目は、常に誰かの本音を静かに観察している。気づいたら人の心の中に自然と入り込んでいる、不思議な魅力の持ち主です。", group: "S", secondary: "L" },
  { code: "SLVP", nickname: "忠犬ハチ公", emoji: "🐕", motto: "一度決めた信念を、どんな状況でも貫き通す", subtitle: "誠実で感情豊かな真っ直ぐなタイプ", description: "一度信じた人への誠実さは、何があっても揺らがない。感情をストレートに表現する正直さと、決して裏切らない一貫性が最大の武器。", group: "S", secondary: "L" },
  { code: "SERF", nickname: "不思議生命体", emoji: "🌀", motto: "普通に見えて、誰も考えない角度から物事を捉える", subtitle: "独自の視点で世界を解釈する観察者タイプ", description: "普通に見えて、実は誰も気づかないことに気づいている。独自の視点から世界を解釈し、突拍子もないアイデアが時に核心を突く。", group: "S", secondary: "E" },
  { code: "SERP", nickname: "敏腕マネージャー", emoji: "📋", motto: "全体を俯瞰し、必要な人に必要なサポートをする", subtitle: "観察力が高く縁の下の力持ちタイプ", description: "表舞台には出ないけれど、あなたがいるから全てが回っている。全体を見渡す冷静な目と、必要な人を必要なタイミングで支える力。", group: "S", secondary: "E" },
  { code: "SEVF", nickname: "デビル天使", emoji: "😇", motto: "予測不能な行動の中に、深い思いやりが宿っている", subtitle: "優しさと自由奔放さを兼ね備えたタイプ", description: "次の行動が全く読めないのに、なぜか傷つく人がいない。その自由奔放さの根っこに、深い思いやりが宿っている。悪魔のような自由さと天使のような優しさが共存する、唯一無二の存在。", group: "S", secondary: "E" },
  { code: "SEVP", nickname: "最後の恋人", emoji: "💝", motto: "どんな人も受け入れる大きな器で、世界を包み込む", subtitle: "器が大きく最も人間力が高いと言われるタイプ", description: "どんな人も、あなたの前では素直になれる。批判せず、ただ受け入れる大きな器。その深い包容力は、傷ついた人の心を静かに癒し、人生の最後に頼りたくなる存在にしています。", group: "S", secondary: "E" },
];

type Tab = "mbti" | "chara" | "rpg";

export default function CharaPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) ?? "mbti";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [myCode, setMyCode] = useState<string | null>(null);
  const [myMbti, setMyMbti] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("revela_mycode");
      if (saved) setMyCode(saved);
      const savedUser = localStorage.getItem("revela_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.mbti) setMyMbti(parsed.mbti);
      }
    } catch {
      // ignore
    }
  }, []);

  const TABS = [
    { id: "mbti" as Tab, label: "現在地", sub: "16タイプ" },
    { id: "chara" as Tab, label: "本音", sub: "16タイプ" },
    { id: "rpg" as Tab, label: "職業RPG", sub: "16クラス" },
  ];

  const mbtiList = Object.entries(mbtiDescriptions);

  const MBTI_DETAILS: Record<string, { description: string; traits: string[] }> = {
    INTJ: { description: "長期的な視点から物事を構造化し、独自の確信に基づいて動く。頭の中にすでに完成形があり、その実現に向けて淡々と進む。感情的な空気よりも本質的な問いを優先するため、周囲には「クール」に映ることも。", traits: ["長期視点で動く", "独自の確信を持つ", "本質を優先する", "静かに実行する"] },
    INTP: { description: "目の前の問題よりも「なぜそうなるのか」を考えてしまう。既存の枠組みを疑い、独自の視点で再構築する。会議中にふと核心を突く発言をして周囲を黙らせることがある。実行より思考に時間を使いすぎることも。", traits: ["構造を解体して考える", "根拠を重視する", "核心を突く発言", "独自の視点"] },
    ENTJ: { description: "目標と道筋が見えると自然と人を動かし始める。決断が早く、リスクを計算した上で前に進む。リーダー不在の場では自然とその役割を担い、チームを推進力に変える。高い水準を自他に求める。", traits: ["場を推進する力", "素早い決断", "人を動かす構想力", "高い基準"] },
    ENTP: { description: "「それ本当に正しい？」が自然と口をついて出る。逆張りではなく、本気で別の可能性を探っている。議論を通じて思考を深めるため、反論を楽しむ節がある。アイデアは豊富だが実行フェーズで飽きやすい面も。", traits: ["常識を問い直す", "議論で深める", "アイデアが尽きない", "可能性を広げる"] },
    INFJ: { description: "表には出さないが、場の流れと人の本音を敏感に読み取っている。長期的な影響を直感的に把握し、静かに動き始める。信念が強く、それが揺らぐと大きなストレスになる。一対一の深い関わりを好む。", traits: ["場の空気を読む", "先を見通す直感", "深い信念", "静かに動く"] },
    INFP: { description: "「こうあるべき」という内なる羅針盤を持ち、それに反することには強い抵抗感を覚える。表面上は穏やかだが内面は熱く、意味のある仕事には驚くほどの集中力を発揮する。評価よりも「自分の仕事に誇れるか」を重視する。", traits: ["価値観で動く", "内側の熱量", "深い集中力", "誠実さへのこだわり"] },
    ENFJ: { description: "誰かが輝く瞬間を作ることに喜びを感じる。チームの感情的な温度を常に把握し、誰が消耗していて誰が力を余らせているかを見ている。人を動かす言葉を本能的に選ぶ。自分のことは後回しにしすぎる傾向も。", traits: ["人の可能性を見る", "感情の温度を読む", "言葉で動かす", "場を前に進める"] },
    ENFP: { description: "アイデアが次々と湧き、それを誰かに話さずにいられない。話しながら思考が深まるタイプ。停滞した空気を自然と変える力があり、最初の火付け役になることが多い。最後まで走り抜くには意志のコントロールが必要。", traits: ["発想が止まらない", "話すことで考える", "場に火をつける", "可能性を広げる"] },
    ISTJ: { description: "言ったことは必ずやる。それがこのタイプの最大の強み。派手さはないが、信頼の積み上げ方を知っている。変化より安定を好み、実績のある方法を大切にする。「なぜ変えるのか」への丁寧な説明が必要なタイプ。", traits: ["約束を守る", "信頼を積み上げる", "手順を重視する", "着実に実行する"] },
    ISFJ: { description: "気づいたら誰かの負担を引き受けている。困っている人を見過ごせず、率先してフォローに入る。記憶力が高く、相手が過去に言ったことを覚えている。自分の限界を超えても「大丈夫です」と言ってしまいがち。", traits: ["サポートに動く", "細部を記憶する", "フォローが速い", "責任感が強い"] },
    ESTJ: { description: "「どう動けば目標に辿り着くか」を即座に構造化する。役割と責任を明確にすることで組織を機能させる。曖昧さを嫌い、ルールへの信頼が高い。実行力と影響力を兼ね備えた、現場の推進力。", traits: ["即座に構造化する", "役割を明確にする", "曖昧さを排除する", "実行で引っ張る"] },
    ESFJ: { description: "人と人の間に生まれる摩擦を敏感に感じ取り、自然と調整役になる。誰が孤立していないか、全員が安心しているかを無意識にチェックしている。感謝されることでエネルギーが満たされ、批判には人一倍傷つく。", traits: ["摩擦を感知する", "場を調整する", "全員を気にかける", "感謝で動く"] },
    ISTP: { description: "無駄な動作を嫌い、本質的な問題に直接手を入れる。言葉より結果で語るタイプ。危機的な状況で最も冷静になれる。深く関わりすぎることを本能的に避け、適切な距離感を保つ。", traits: ["本質に直接触れる", "結果で語る", "危機に冷静", "距離感を保つ"] },
    ISFP: { description: "その瞬間に感じたことをそのまま行動に移す。計画より直感、ルールより状況を優先する。本物や美しいものに強く惹かれ、自分の仕事に誠実さを求める。目立たないが、近くにいる人には大きな安心感を与える。", traits: ["今を感じて動く", "直感を信じる", "本物にこだわる", "静かな存在感"] },
    ESTP: { description: "状況を瞬時に読み、最適なアクションを取る。理論より現実、計画より即興。リスクは考えすぎず、動きながら修正する。停滞した場を一気に動かす突破力がある。長期より今この瞬間の勝負に強い。", traits: ["瞬時に読んで動く", "即興で突破する", "動きながら修正", "停滞を壊す"] },
    ESFP: { description: "その場にいる人が楽しめているかが常に気になる。自然と場の中心になり、停滞した空気を笑顔で変える。台本より即興、準備より勢い。人のエネルギーを受け取って増幅させる天然の存在。", traits: ["場を明るくする", "即興で動く", "エネルギーを増幅", "今を全力で楽しむ"] },
  };

  const MBTI_GROUPS = [
    { label: "直感×論理", color: "#7c3aed", types: ["INTJ", "INTP", "ENTJ", "ENTP"] },
    { label: "直感×感情", color: "#059669", types: ["INFJ", "INFP", "ENFJ", "ENFP"] },
    { label: "感覚×秩序", color: "#1d4ed8", types: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"] },
    { label: "感覚×適応", color: "#d97706", types: ["ISTP", "ISFP", "ESTP", "ESFP"] },
  ];

  const LOVE_GROUPS = [
    { label: "前衛", sub: "積極×オープン", color: "#f97316", codes: ["ALRF", "ALVF", "AERF", "AEVF"] },
    { label: "自由", sub: "積極×内向",     color: "#a78bfa", codes: ["ALRP", "ALVP", "AERP", "AEVP"] },
    { label: "後衛", sub: "受動×オープン", color: "#38bdf8", codes: ["SLRF", "SLVF", "SERF", "SEVF"] },
    { label: "頭脳", sub: "受動×内向",     color: "#34d399", codes: ["SLRP", "SLVP", "SERP", "SEVP"] },
  ];

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
          現在地・本音・職業RPG。<br />あなたを構成する3つの要素を確認しよう。
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
          {/* Concept intro */}
          <section className="w-full max-w-3xl mx-auto px-2 py-10 md:py-16 flex flex-col items-center text-center mb-4">
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>現在地</p>
            <p className="text-xs tracking-widest mb-6 px-3 py-1 rounded-full" style={{ color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)", background: "rgba(251,191,36,0.06)" }}>今の職場での動き方</p>
            <h2 className="text-xl md:text-3xl font-bold tracking-widest mb-10 leading-tight" style={{ fontFamily: "var(--font-noto-serif-jp), serif", color: "#f0f0f0", textWrap: "balance" } as React.CSSProperties}>
              今の自分が、職場でどう動いているか。
            </h2>
            <div className="text-sm md:text-base leading-loose tracking-wider space-y-5 text-left md:text-center" style={{ color: "rgba(255,255,255,0.5)", textWrap: "pretty" } as React.CSSProperties}>
              <p>
                職場でのあなたの動き方には、無意識のパターンがあります。<br className="hidden md:block" />
                「全体を俯瞰してから動くか、まず手を動かすか」<br className="hidden md:block" />
                「論理で判断するか、場の空気を読んで動くか」。
              </p>
              <p style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
                これは優劣ではなく、あなたが今いる環境でどう動いているかの「現在地」。<br className="hidden md:block" />
                4つの軸の組み合わせから16通りのパターンに分類し、<br className="hidden md:block" />
                自分の職場での動き方を客観的に見える化します。
              </p>
            </div>
            <div className="w-12 h-px mt-12" style={{ background: "rgba(255,255,255,0.15)" }} />
          </section>

          {myMbti && (() => {
            const info = mbtiDescriptions[myMbti];
            const color = MBTI_COLORS[myMbti];
            if (!info || !color) return null;
            return (
              <div className="rounded-2xl p-5 mb-8 max-w-lg mx-auto" style={{ background: `linear-gradient(135deg, ${color.bg}, rgba(255,255,255,0.06))`, border: `1px solid ${color.primary}66` }}>
                <p className="text-xs tracking-widest mb-2 text-center" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.7 }}>✦ あなたの現在地</p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xl font-bold" style={{ color: color.primary }}>{info.displayName}</p>
                    <p className="text-xs opacity-70 mt-0.5" style={{ color: color.primary }}>{info.subtitle}</p>
                    <p className="text-xs opacity-50 mt-0.5">{info.keywords}</p>
                  </div>
                </div>
              </div>
            );
          })()}
          {MBTI_GROUPS.map((grp) => (
            <div key={grp.label} className="mb-12">
              {/* Group header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${grp.color}50)` }} />
                <span className="text-xs px-4 py-1 rounded-full" style={{ color: grp.color, border: `1px solid ${grp.color}40`, letterSpacing: "0.3em" }}>{grp.label}</span>
                <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${grp.color}50, transparent)` }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {grp.types.map((type) => {
                  const info = mbtiDescriptions[type];
                  const color = MBTI_COLORS[type] ?? { primary: "rgba(255,255,255,0.5)", bg: "rgba(255,255,255,0.1)", group: "" };
                  const detail = MBTI_DETAILS[type];
                  const isMe = myMbti === type;
                  return (
                    <div key={type} className="rounded-2xl p-5 animate-fade-in" style={{ background: isMe ? color.bg : `rgba(255,255,255,0.02)`, border: isMe ? `1px solid ${color.primary}99` : `1px solid ${color.primary}40` }}>
                      {isMe && <p className="text-xs tracking-widest mb-2" style={{ color: color.primary }}>✦ あなた</p>}
                      <p className="text-base font-bold mb-0.5" style={{ color: color.primary }}>{info?.displayName ?? type}</p>
                      <p className="text-xs mb-3" style={{ fontFamily: "var(--font-noto-serif-jp), serif", opacity: 0.7 }}>{info?.subtitle}</p>
                      <div className="h-px mb-3" style={{ background: `linear-gradient(90deg, ${color.primary}40, transparent)` }} />
                      <p className="text-xs leading-relaxed mb-4" style={{ opacity: 0.8, fontFamily: "var(--font-noto-serif-jp), serif" }}>{detail?.description}</p>
                      <div className="flex flex-col gap-1.5">
                        {detail?.traits.map((trait) => (
                          <div key={trait} className="flex items-center gap-1.5 text-xs" style={{ opacity: 0.85 }}>
                            <span style={{ color: color.primary, fontSize: 8 }}>✦</span>
                            <span>{trait}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}

      {/* ── キャラクター タブ ── */}
      {tab === "chara" && (
        <>
          {/* Concept intro */}
          <section className="w-full max-w-3xl mx-auto px-2 py-10 md:py-16 flex flex-col items-center text-center mb-4">
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>本音</p>
            <p className="text-xs tracking-widest mb-6 px-3 py-1 rounded-full" style={{ color: "#e8a0bf", border: "1px solid rgba(232,160,191,0.3)", background: "rgba(232,160,191,0.06)" }}>本当はこう動きたい</p>
            <h2 className="text-xl md:text-3xl font-bold tracking-widest mb-10 leading-tight" style={{ fontFamily: "var(--font-noto-serif-jp), serif", color: "#f0f0f0", textWrap: "balance" } as React.CSSProperties}>
              仮面を外したとき、本当はどう動きたいのか。
            </h2>
            <div className="text-sm md:text-base leading-loose tracking-wider space-y-5 text-left md:text-center" style={{ color: "rgba(255,255,255,0.5)", textWrap: "pretty" } as React.CSSProperties}>
              <p>
                職場では「現在地」として動いている自分がいます。<br className="hidden md:block" />
                でも本当は、もっと違う動き方をしたいと感じていませんか。
              </p>
              <p style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
                「本当は自由に動きたい」「本当は誰かを導きたい」。<br className="hidden md:block" />
                内側にある欲求を4つの軸で分類し、<br className="hidden md:block" />
                あなたの「本音」を16通りで見える化します。
              </p>
            </div>
            <div className="w-12 h-px mt-12" style={{ background: "rgba(232,160,191,0.3)" }} />
          </section>

          {myCode && (() => {
            const mine = ALL_TYPES.find((t) => t.code === myCode);
            if (!mine) return null;
            return (
              <div className="rounded-2xl p-5 mb-8 max-w-lg mx-auto" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(232,160,191,0.08))", border: "1px solid rgba(255,255,255,0.4)" }}>
                <p className="text-xs tracking-widest mb-2 text-center" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.7 }}>✦ あなたの本音</p>
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{mine.emoji}</span>
                  <div>
                    <p className="text-base font-medium" style={{ color: "#e8a0bf" }}>{loveTypeDescriptions[mine.code as LoveType]?.nickname ?? mine.nickname}</p>
                    <p className="text-xs opacity-60 mt-0.5">{mine.motto}</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {LOVE_GROUPS.map((grp) => (
            <div key={grp.label} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${grp.color}50)` }} />
                <span className="text-xs px-4 py-1 rounded-full" style={{ color: grp.color, border: `1px solid ${grp.color}40`, letterSpacing: "0.2em" }}>{grp.sub}</span>
                <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${grp.color}50, transparent)` }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {grp.codes.map((code) => {
                  const type = ALL_TYPES.find((t) => t.code === code);
                  if (!type) return null;
                  const desc = loveTypeDescriptions[type.code];
                  const isMe = myCode === type.code;
                  return (
                    <div key={type.code} className="rounded-2xl p-5 animate-fade-in" style={{ background: isMe ? `${grp.color}18` : "rgba(255,255,255,0.02)", border: isMe ? `1px solid ${grp.color}99` : `1px solid ${grp.color}30` }}>
                      {isMe && <p className="text-xs tracking-widest mb-2" style={{ color: grp.color }}>✦ あなた</p>}
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-3xl flex-shrink-0">{desc?.emoji ?? type.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" style={{ color: grp.color }}>{desc?.nickname ?? type.nickname}</p>
                          <p className="text-xs opacity-50 mt-0.5">{type.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-xs italic mb-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>「{type.motto}」</p>
                      <p className="text-xs leading-relaxed opacity-70">{type.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}

      {/* 職業RPG */}
      {tab === "rpg" && (() => {
        return (
          <>
          {/* Concept intro */}
          <section className="w-full max-w-3xl mx-auto px-2 py-10 md:py-16 flex flex-col items-center text-center mb-4">
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
              Concept of Classes
            </p>
            <p className="text-xs tracking-widest mb-6 px-3 py-1 rounded-full" style={{ color: "#34d399", border: "1px solid rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.06)" }}>現在地と本音の統合</p>
            <h2 className="text-xl md:text-3xl font-bold tracking-widest mb-10 leading-tight" style={{ fontFamily: "var(--font-noto-serif-jp), serif", color: "#f0f0f0", textWrap: "balance" } as React.CSSProperties}>
              ギャップの先に、本当の自分がいる。
            </h2>
            <div className="text-sm md:text-base leading-loose tracking-wider space-y-5 text-left md:text-center" style={{ color: "rgba(255,255,255,0.5)", textWrap: "pretty" } as React.CSSProperties}>
              <p>
                今の自分（現在地）と、本当はこうありたい自分（本音）。<br className="hidden md:block" />
                この二つのギャップは、誰にでもあります。
              </p>
              <p>
                大事なのは、そのギャップの「形」です。<br className="hidden md:block" />
                どの方向にズレているか、どれだけの距離があるか。<br className="hidden md:block" />
                その組み合わせが、チームの中であなたが自然と担う「役割」を決めています。
              </p>
              <p>
                前に出て引っ張るのか、陰で支えるのか。<br className="hidden md:block" />
                論理で整理するのか、空気をかき混ぜるのか。
              </p>
              <p style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
                職業RPGクラスは、現在地と本音の掛け合わせから<br className="hidden md:block" />
                チームでのあなたの立ち位置を可視化する指標です。
              </p>
            </div>
            <div className="w-12 h-px mt-12" style={{ background: "rgba(255,255,255,0.15)" }} />
          </section>

          {(() => {
            const myLoveType = myCode ? myCode.split("-")[1] : null;
            const myRpgClass = myMbti && myLoveType ? getRpgClassByCombo(myMbti, myLoveType) : null;
            const ROLE_GROUPS = [
              { key: "LEADER",    label: "前衛",  sub: "LEADER",    color: "#f87171" },
              { key: "SUPPORT",   label: "後衛",  sub: "SUPPORT",   color: "#34d399" },
              { key: "BRAIN",     label: "頭脳",  sub: "BRAIN",     color: "#818cf8" },
              { key: "TRICKSTER", label: "自由",  sub: "TRICKSTER", color: "#c084fc" },
            ];
            return (
              <div className="mb-10 space-y-10">
                {ROLE_GROUPS.map((group) => {
                  const classes = RPG_CLASSES.filter((cls) => CLASS_ROLES[cls.name] === group.key);
                  return (
                    <div key={group.key}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: group.color }} />
                        <span className="text-sm font-bold tracking-widest" style={{ color: group.color }}>{group.label}</span>
                        <span className="text-xs opacity-30 tracking-widest">{group.sub}</span>
                        <div className="flex-1 h-px" style={{ background: `${group.color}22` }} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {classes.map((cls) => {
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
                    </div>
                  );
                })}
              </div>
            );
          })()}
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
