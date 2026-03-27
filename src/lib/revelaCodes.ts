// ============================================================
// revela Code utilities — pure, no React, no "use client"
// ============================================================

export interface ParsedCode {
  mbti: string;
  loveType: string;
  zodiac: string;
}

// ── Zodiac short-form mappings ────────────────────────────────
const ZODIAC_SHORT_MAP: Record<string, string> = {
  おひつじ: "おひ",
  おうし:   "おう",
  ふたご:   "ふた",
  かに:     "かに",
  しし:     "しし",
  おとめ:   "おと",
  てんびん: "てん",
  さそり:   "さそ",
  いて:     "いて",
  やぎ:     "やぎ",
  みずがめ: "みず",
  うお:     "うお",
};

// Reverse: short -> full
const SHORT_ZODIAC_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ZODIAC_SHORT_MAP).map(([full, short]) => [short, full])
);

// ── generateRevelaCode ───────────────────────────────────────
export function generateRevelaCode(
  mbti: string,
  loveType: string,
  zodiac: string,
): string {
  const zodiacShort = ZODIAC_SHORT_MAP[zodiac] ?? zodiac.slice(0, 2);
  return `${mbti}-${loveType}-${zodiacShort}`;
}

// ── parseRevelaCode ──────────────────────────────────────────
export function parseRevelaCode(code: string): ParsedCode | null {
  // Expected format: MBTI-LOVETYPE-ZODIACSHORT
  // e.g. ENFP-FCRO-うお
  const parts = code.trim().split("-");
  if (parts.length !== 3) return null;

  const [mbtiRaw, loveTypeRaw, zodiacShortRaw] = parts;

  const mbti = mbtiRaw.toUpperCase();
  if (!/^[A-Z]{4}$/.test(mbti)) return null;

  const loveType = loveTypeRaw.toUpperCase();
  if (!/^[A-Z]{4}$/.test(loveType)) return null;

  const zodiac = SHORT_ZODIAC_MAP[zodiacShortRaw] ?? zodiacShortRaw;

  return { mbti, loveType, zodiac };
}

// ============================================================
// Compatibility calculation
// ============================================================

export interface FullCompatibilityResult {
  total: number;
  mbtiScore: number;
  charaScore: number;
  zodiacScore: number;
  comment: string;
  strengths: string[];
  cautions: string[];
}

// ── MBTI compatibility ───────────────────────────────────────
function calcMbtiScore(a: string, b: string): number {
  const highPairs: [string, string][] = [
    ["INFJ", "ENFP"], ["INTJ", "ENFP"], ["INFP", "ENFJ"],
    ["INTP", "ENTP"], ["ISFJ", "ESFP"], ["ISTJ", "ESFJ"],
    ["ENFJ", "INFJ"], ["ESTP", "ISTP"], ["INTJ", "INFJ"],
    ["ENFP", "INFP"],
  ];
  const sortedPair = [a, b].sort().join("_");
  const isHighPair = highPairs.some(
    ([x, y]) => [x, y].sort().join("_") === sortedPair
  );
  if (isHighPair) return 88;

  let score = 50;
  if (a[0] === b[0]) score += 5; else score += 10;
  if (a[1] === b[1]) score += 8;
  if (a[2] !== b[2]) score += 7;
  if (a[3] === b[3]) score += 5;
  return Math.min(82, Math.max(40, score));
}

// ── Character code compatibility ─────────────────────────────
function calcCharaScore(a: string, b: string): number {
  if (a.length < 4 || b.length < 4) return 65;
  let score = 60;
  if (a[0] !== b[0]) score += 12; else score += 6;
  if (a[1] === b[1]) score += 10; else score += 5;
  if (a[2] !== b[2]) score += 8;  else score += 4;
  if (a[3] === b[3]) score += 8;  else score += 3;
  return Math.min(95, Math.max(45, score));
}

// ── Zodiac element compatibility ─────────────────────────────
type ZodiacElement = "火" | "地" | "風" | "水";

const ZODIAC_ELEMENT: Record<string, ZodiacElement> = {
  おひつじ: "火",
  しし:     "火",
  いて:     "火",
  おうし:   "地",
  おとめ:   "地",
  やぎ:     "地",
  ふたご:   "風",
  てんびん: "風",
  みずがめ: "風",
  かに:     "水",
  さそり:   "水",
  うお:     "水",
};

function calcZodiacScore(a: string, b: string): number {
  const elA = ZODIAC_ELEMENT[a];
  const elB = ZODIAC_ELEMENT[b];
  if (!elA || !elB) return 65;
  if (elA === elB) return 90;
  const complementary: [ZodiacElement, ZodiacElement][] = [["火", "風"], ["地", "水"]];
  const isComplementary = complementary.some(
    ([x, y]) => (elA === x && elB === y) || (elA === y && elB === x)
  );
  if (isComplementary) return 80;
  const challenging: [ZodiacElement, ZodiacElement][] = [["火", "水"], ["地", "風"]];
  const isChallenging = challenging.some(
    ([x, y]) => (elA === x && elB === y) || (elA === y && elB === x)
  );
  if (isChallenging) return 45;
  return 65;
}

// ── Comment generation ───────────────────────────────────────
function buildComment(a: ParsedCode, b: ParsedCode): string {
  const mbtiPair = `${a.mbti}と${b.mbti}`;
  return `${mbtiPair}の組み合わせは、それぞれの個性が独自の化学反応を生み出します。MBTIの相性に加えて、キャラクターコード・星座の3つの次元から深く分析すると、二人の間にはユニークなエネルギーの流れが見えてきます。`;
}

function buildStrengths(a: ParsedCode, b: ParsedCode): string[] {
  const strengths: string[] = [];
  const zodiacElA = ZODIAC_ELEMENT[a.zodiac];
  const zodiacElB = ZODIAC_ELEMENT[b.zodiac];

  if (a.mbti[1] === b.mbti[1]) {
    strengths.push(`どちらも${a.mbti[1] === "N" ? "直感型" : "感覚型"}で、世界の見方に共通点が多く、会話が自然に深まります。`);
  }
  if (a.mbti[0] !== b.mbti[0]) {
    strengths.push("内向きと外向きのエネルギーが補い合い、互いを刺激し合えます。");
  }
  if (zodiacElA && zodiacElB && zodiacElA === zodiacElB) {
    strengths.push(`同じ${zodiacElA}のエレメントを持ち、根本的な価値観や感受性が共鳴します。`);
  }
  if (strengths.length === 0) {
    strengths.push("それぞれの違いを学び合える関係です。");
  }
  return strengths;
}

function buildCautions(a: ParsedCode, b: ParsedCode): string[] {
  const cautions: string[] = [];
  const zodiacElA = ZODIAC_ELEMENT[a.zodiac];
  const zodiacElB = ZODIAC_ELEMENT[b.zodiac];

  if (a.mbti[2] === b.mbti[2]) {
    cautions.push(`二人とも${a.mbti[2] === "T" ? "論理思考" : "感情重視"}型のため、お互いの感情サインを見逃しやすいかもしれません。`);
  }
  if (zodiacElA && zodiacElB) {
    const challenging: [ZodiacElement, ZodiacElement][] = [["火", "水"], ["地", "風"]];
    const isChallenging = challenging.some(
      ([x, y]) => (zodiacElA === x && zodiacElB === y) || (zodiacElA === y && zodiacElB === x)
    );
    if (isChallenging) {
      cautions.push(`${zodiacElA}と${zodiacElB}のエレメントは摩擦を生みやすく、意見の相違が感情的になる場合があります。`);
    }
  }
  if (cautions.length === 0) {
    cautions.push("コミュニケーションスタイルの違いに気づき、率直に話し合うことが大切です。");
  }
  return cautions;
}

// ── Main export ──────────────────────────────────────────────
export function calculateFullCompatibility(
  codeA: ParsedCode,
  codeB: ParsedCode
): FullCompatibilityResult {
  const mbtiScore   = calcMbtiScore(codeA.mbti, codeB.mbti);
  const charaScore  = calcCharaScore(codeA.loveType, codeB.loveType);
  const zodiacScore = calcZodiacScore(codeA.zodiac, codeB.zodiac);

  const total = Math.round(
    mbtiScore   * 0.45 +
    charaScore  * 0.35 +
    zodiacScore * 0.20
  );

  const comment   = buildComment(codeA, codeB);
  const strengths = buildStrengths(codeA, codeB);
  const cautions  = buildCautions(codeA, codeB);

  return { total, mbtiScore, charaScore, zodiacScore, comment, strengths, cautions };
}
