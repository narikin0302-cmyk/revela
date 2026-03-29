import Link from "next/link";

export const metadata = {
  title: "性格タイプ 16タイプ一覧 | revela",
  description: "16の性格タイプを解説。INFJ・ENFP・INTPなど全タイプの特徴・強み・向いている仕事をまとめました。",
};

interface MbtiTypeData {
  code: string;
  nickname: string;
  primary: string;
  bg: string;
  group: string;
  groupColor: string;
  description: string;
  traits: string[];
}

const MBTI_TYPES: MbtiTypeData[] = [
  // Analysts (NT)
  {
    code: "INTJ",
    nickname: "建築家",
    primary: "#7c3aed",
    bg: "rgba(124,58,237,0.12)",
    group: "分析家",
    groupColor: "#7c3aed",
    description:
      "戦略的思考と長期ビジョンを持つ稀有な存在。独自の理論を構築し、高い基準で物事を実行します。感情より論理を優先し、目標達成への意志が強い。",
    traits: ["長期的戦略思考", "高い自立心", "完璧主義的傾向", "鋭い洞察力"],
  },
  {
    code: "INTP",
    nickname: "論理学者",
    primary: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    group: "分析家",
    groupColor: "#7c3aed",
    description:
      "知的好奇心旺盛で、あらゆる問いに論理的な答えを求めます。既存の理論を疑い、独自のフレームワークで世界を理解しようとする革新的な思索者。",
    traits: ["深い分析力", "理論への情熱", "柔軟な思考", "客観的視点"],
  },
  {
    code: "ENTJ",
    nickname: "指揮官",
    primary: "#6d28d9",
    bg: "rgba(109,40,217,0.12)",
    group: "分析家",
    groupColor: "#7c3aed",
    description:
      "生まれながらのリーダー。目標達成のために人々を組織し、効率的に動かす力を持ちます。大きなビジョンを描き、それを現実にする実行力と決断力が際立つ。",
    traits: ["強いリーダーシップ", "戦略的計画力", "高い意欲", "率直なコミュニケーション"],
  },
  {
    code: "ENTP",
    nickname: "討論者",
    primary: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    group: "分析家",
    groupColor: "#7c3aed",
    description:
      "知的な議論と挑戦を愛する革新者。あらゆる視点から問題を検討し、創造的な解決策を見出します。常識を疑い、新しいアイデアで周囲を刺激します。",
    traits: ["革新的思考", "機知に富む", "議論好き", "多角的視点"],
  },
  // Diplomats (NF)
  {
    code: "INFJ",
    nickname: "提唱者",
    primary: "#059669",
    bg: "rgba(5,150,105,0.12)",
    group: "外交官",
    groupColor: "#059669",
    description:
      "深い洞察力と強い使命感を持つ稀少タイプ。人の本質を見通し、社会の変革に静かに貢献します。理想主義と現実的な実行力を兼ね備えた真のビジョナリー。",
    traits: ["深い共感力", "明確な使命感", "直感的洞察", "献身的"],
  },
  {
    code: "INFP",
    nickname: "仲介者",
    primary: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    group: "外交官",
    groupColor: "#059669",
    description:
      "豊かな内面世界と強い価値観を持つ詩人的な魂。表面的な成功より意味のある仕事を求め、独創的な視点で人の心に届くものを生み出します。",
    traits: ["深い創造力", "強い価値観", "共感と誠実さ", "独自の世界観"],
  },
  {
    code: "ENFJ",
    nickname: "主人公",
    primary: "#047857",
    bg: "rgba(4,120,87,0.12)",
    group: "外交官",
    groupColor: "#059669",
    description:
      "天性のカリスマとリーダーシップで人々を鼓舞します。他者の可能性を最大限引き出すことを喜びとし、チームの調和を保ちながら共通のビジョンへ導く。",
    traits: ["カリスマ的リーダー", "強い共感力", "人材育成の才能", "説得力"],
  },
  {
    code: "ENFP",
    nickname: "広報運動家",
    primary: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    group: "外交官",
    groupColor: "#059669",
    description:
      "情熱とアイデアの泉。常に新しい可能性を見出し、人々を巻き込んで夢を形にします。どんな状況でも熱意と明るさで周囲に活力を与えるチームの太陽。",
    traits: ["無尽蔵の発想力", "感染する情熱", "柔軟な適応力", "豊かな感受性"],
  },
  // Sentinels (SJ)
  {
    code: "ISTJ",
    nickname: "管理者",
    primary: "#1d4ed8",
    bg: "rgba(29,78,216,0.12)",
    group: "番人",
    groupColor: "#1d4ed8",
    description:
      "信頼性と責任感の体現者。ルールと手順を重視し、約束を必ず守ります。組織の根幹として安定した成果を出し続ける「静かな功労者」です。",
    traits: ["高い信頼性", "几帳面な実行力", "責任感", "実証的思考"],
  },
  {
    code: "ISFJ",
    nickname: "擁護者",
    primary: "#2563eb",
    bg: "rgba(37,99,235,0.12)",
    group: "番人",
    groupColor: "#1d4ed8",
    description:
      "細やかな気配りと強い責任感で周囲を支える守護者。人の痛みに敏感で、縁の下の力持ちとして組織やコミュニティの安定を守ります。",
    traits: ["献身的なサポート", "優れた記憶力", "細やかな配慮", "強い義務感"],
  },
  {
    code: "ESTJ",
    nickname: "幹部",
    primary: "#1e40af",
    bg: "rgba(30,64,175,0.12)",
    group: "番人",
    groupColor: "#1d4ed8",
    description:
      "秩序と伝統を重んじ、実行力で組織を率いるリーダー。明確なルールと効率的な手順で目標を達成し、チームに方向性と安定感をもたらします。",
    traits: ["組織的な管理力", "強い実行力", "明確な判断基準", "責任感"],
  },
  {
    code: "ESFJ",
    nickname: "領事",
    primary: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
    group: "番人",
    groupColor: "#1d4ed8",
    description:
      "社交的で思いやり深く、周囲の調和を大切にする存在。他者のニーズを敏感に察知し、コミュニティや組織のつながりを育む天性の協調者。",
    traits: ["優れた社交性", "強い協調精神", "細やかな気遣い", "実践的サポート"],
  },
  // Explorers (SP)
  {
    code: "ISTP",
    nickname: "巨匠",
    primary: "#92400e",
    bg: "rgba(146,64,14,0.12)",
    group: "探検家",
    groupColor: "#d97706",
    description:
      "冷静な判断力と卓越した技術力を持つ実践者。理論より行動、話すより手を動かすことで結果を出します。危機的状況でも揺るがない「現場のエース」。",
    traits: ["卓越した技術力", "冷静な危機対応", "論理的な問題解決", "独立した思考"],
  },
  {
    code: "ISFP",
    nickname: "冒険家",
    primary: "#d97706",
    bg: "rgba(217,119,6,0.12)",
    group: "探検家",
    groupColor: "#d97706",
    description:
      "感性豊かで美しいものに強く惹かれるアーティスト気質。自分のペースで深い仕事をし、静かに独自の価値を生み出します。自由と真正性を何より重んじる。",
    traits: ["豊かな美的センス", "高い感受性", "柔軟な適応力", "真正な自己表現"],
  },
  {
    code: "ESTP",
    nickname: "起業家",
    primary: "#b45309",
    bg: "rgba(180,83,9,0.12)",
    group: "探検家",
    groupColor: "#d97706",
    description:
      "行動と結果の人。考えるより先に動き、現場でチャンスをつかみます。リスクを恐れずスピード感ある判断で周囲を引っ張る「修羅場のスター」です。",
    traits: ["圧倒的な行動力", "度胸と決断力", "現場対応力", "説得力と魅力"],
  },
  {
    code: "ESFP",
    nickname: "エンターテイナー",
    primary: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    group: "探検家",
    groupColor: "#d97706",
    description:
      "いるだけで場が明るくなる存在。人を楽しませることに全力を注ぎ、瞬間瞬間を最高のものにします。柔軟で社交的なエンターテインメントの申し子。",
    traits: ["天性の明るさ", "高い社交性", "優れた即興力", "豊かな共感力"],
  },
];

const GROUPS = ["分析家", "外交官", "番人", "探検家"];

export default function MbtiPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#EDEDED",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 16px 80px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.4em",
              color: "rgba(255,255,255,0.35)",
              marginBottom: 12,
            }}
          >
            REFERENCE
          </p>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 5vw, 2.4rem)",
              fontWeight: 300,
              fontFamily: "var(--font-noto-serif-jp), serif",
              marginBottom: 16,
            }}
          >
            MBTI 16タイプ一覧
          </h1>
          <p style={{ fontSize: 14, opacity: 0.6, lineHeight: 1.8, maxWidth: 560, margin: "0 auto 24px" }}>
            MBTIの16タイプそれぞれの特徴・強み・適性をまとめました。
            あなたのタイプの深い理解と、他者理解のためにご活用ください。
          </p>
          <div
            style={{
              height: 1,
              width: 80,
              margin: "0 auto",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            }}
          />
        </div>

        {/* Groups */}
        {GROUPS.map((group) => {
          const types = MBTI_TYPES.filter((t) => t.group === group);
          const groupColor = types[0]?.groupColor ?? "rgba(255,255,255,0.5)";
          return (
            <div key={group} style={{ marginBottom: 56 }}>
              {/* Group header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    background: `linear-gradient(90deg, transparent, ${groupColor}50)`,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.35em",
                    color: groupColor,
                    opacity: 0.9,
                    padding: "4px 12px",
                    border: `1px solid ${groupColor}40`,
                    borderRadius: 9999,
                  }}
                >
                  {group}
                </span>
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    background: `linear-gradient(90deg, ${groupColor}50, transparent)`,
                  }}
                />
              </div>

              {/* Type cards grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 16,
                }}
              >
                {types.map((type) => (
                  <div
                    key={type.code}
                    style={{
                      background: type.bg,
                      border: `1px solid ${type.primary}40`,
                      borderRadius: 16,
                      padding: "20px 18px",
                      transition: "box-shadow 0.2s ease",
                    }}
                  >
                    {/* Type code + nickname */}
                    <div style={{ marginBottom: 12 }}>
                      <p
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: type.primary,
                          letterSpacing: "0.05em",
                          marginBottom: 2,
                        }}
                      >
                        {type.code}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          opacity: 0.7,
                          fontFamily: "var(--font-noto-serif-jp), serif",
                        }}
                      >
                        {type.nickname}
                      </p>
                    </div>

                    {/* Divider */}
                    <div
                      style={{
                        height: 1,
                        background: `linear-gradient(90deg, ${type.primary}40, transparent)`,
                        marginBottom: 12,
                      }}
                    />

                    {/* Description */}
                    <p
                      style={{
                        fontSize: 12,
                        lineHeight: 1.75,
                        opacity: 0.82,
                        fontFamily: "var(--font-noto-serif-jp), serif",
                        marginBottom: 14,
                      }}
                    >
                      {type.description}
                    </p>

                    {/* Traits */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {type.traits.map((trait) => (
                        <div
                          key={trait}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 11,
                            opacity: 0.85,
                          }}
                        >
                          <span style={{ color: type.primary, fontSize: 8 }}>✦</span>
                          <span>{trait}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* CTA to shindan */}
        <div
          style={{
            marginTop: 48,
            padding: "32px 24px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.3)",
              marginBottom: 12,
            }}
          >
            DIAGNOSIS
          </p>
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              fontFamily: "var(--font-noto-serif-jp), serif",
              marginBottom: 8,
            }}
          >
            あなたのMBTIタイプを詳しく分析する
          </p>
          <p style={{ fontSize: 13, opacity: 0.5, marginBottom: 24 }}>
            MBTI × タロット × 恋愛スタイルで、あなたの本質を言語化します
          </p>
          <Link
            href="/shindan"
            style={{
              display: "inline-block",
              padding: "12px 36px",
              borderRadius: 9999,
              fontSize: 14,
              fontWeight: 500,
              background: "transparent",
              color: "#EDEDED",
              border: "1px solid rgba(255,255,255,0.3)",
              textDecoration: "none",
              letterSpacing: "0.1em",
            }}
          >
            無料で分析する →
          </Link>
        </div>
      </div>
    </div>
  );
}
