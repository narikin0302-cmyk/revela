// ============================================================
// revela Code utilities — pure, no React, no "use client"
// ============================================================

export interface ParsedCode {
  mbti: string;
  loveType: string;
  rpgClassName: string;
  classNumber: number; // 1-16 within RPGクラス
  zodiac?: string;     // deprecated: legacy codes only
}

// ── Group ordering for encode/decode ─────────────────────────
const _MBTI_IN_GROUP: Record<string, string[]> = {
  LEADER:    ["ENTJ", "ESTJ", "ENFJ", "ESTP"],
  BRAIN:     ["INTJ", "INTP", "ISTP", "INFJ"],
  SUPPORT:   ["ISTJ", "ISFJ", "ESFJ", "INFP"],
  TRICKSTER: ["ENTP", "ENFP", "ISFP", "ESFP"],
};

const _AELV_IN_GROUP: Record<string, string[]> = {
  前衛: ["ALRF", "ALVF", "AERF", "AEVF"],
  自由: ["ALRP", "ALVP", "AERP", "AEVP"],
  後衛: ["SLRF", "SLVF", "SERF", "SEVF"],
  頭脳: ["SLRP", "SLVP", "SERP", "SEVP"],
};

export const RPG_GROUPS: Record<string, { mbtiGroup: string; loveGroup: string }> = {
  "覇王":           { mbtiGroup: "LEADER",    loveGroup: "前衛" },
  "海賊王":         { mbtiGroup: "LEADER",    loveGroup: "自由" },
  "聖騎士":         { mbtiGroup: "LEADER",    loveGroup: "後衛" },
  "執行官":         { mbtiGroup: "LEADER",    loveGroup: "頭脳" },
  "影の刺客":       { mbtiGroup: "BRAIN",     loveGroup: "前衛" },
  "錬金術師":       { mbtiGroup: "BRAIN",     loveGroup: "自由" },
  "予言者":         { mbtiGroup: "BRAIN",     loveGroup: "後衛" },
  "賢者":           { mbtiGroup: "BRAIN",     loveGroup: "頭脳" },
  "ギルドマスター": { mbtiGroup: "SUPPORT",   loveGroup: "前衛" },
  "吟遊詩人":       { mbtiGroup: "SUPPORT",   loveGroup: "自由" },
  "聖職者":         { mbtiGroup: "SUPPORT",   loveGroup: "後衛" },
  "騎士団長":       { mbtiGroup: "SUPPORT",   loveGroup: "頭脳" },
  "冒険者":         { mbtiGroup: "TRICKSTER", loveGroup: "前衛" },
  "奇術師":         { mbtiGroup: "TRICKSTER", loveGroup: "自由" },
  "星の踊り子":     { mbtiGroup: "TRICKSTER", loveGroup: "後衛" },
  "森の狩人":       { mbtiGroup: "TRICKSTER", loveGroup: "頭脳" },
};

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

// ── loveTypeToMbti ───────────────────────────────────────────
// キャラコード → MBTI 自動変換 (1:1 mapping)
// A=E, S=I  |  L=T, E=F  |  R=S, V=N  |  F=P, P=J
export function loveTypeToMbti(loveType: string): string {
  if (loveType.length < 4) return "";
  const ei = loveType[0] === "A" ? "E" : "I";
  const sn = loveType[2] === "R" ? "S" : "N";
  const tf = loveType[1] === "L" ? "T" : "F";
  const jp = loveType[3] === "P" ? "J" : "P";
  return `${ei}${sn}${tf}${jp}`;
}

// ── generateRevelaCode ───────────────────────────────────────
// 新形式: {RPGクラス名}-{1-16}
export function generateRevelaCode(
  mbti: string,
  loveType: string,
  rpgClassName: string,
): string {
  const groups = RPG_GROUPS[rpgClassName];
  if (!groups) return `${rpgClassName}-1`;

  const normalizedLove = LEGACY_LOVE_CODE_MAP[loveType] ?? loveType;
  const mbtiList = _MBTI_IN_GROUP[groups.mbtiGroup];
  const loveList = _AELV_IN_GROUP[groups.loveGroup];
  const mbtiIdx = mbtiList.indexOf(mbti);
  const loveIdx = loveList.indexOf(normalizedLove);
  if (mbtiIdx === -1 || loveIdx === -1) return `${rpgClassName}-1`;

  return `${rpgClassName}-${mbtiIdx * 4 + loveIdx + 1}`;
}

// ── Legacy code migration (pre-rename → new AELV system) ─────
const LEGACY_LOVE_CODE_MAP: Record<string, string> = {
  LCRO: "ALRF", LCRE: "ALRP", LCPO: "ALVF", LCPE: "ALVP",
  LARO: "AERF", LARE: "AERP", LAPO: "AEVF", LAPE: "AEVP",
  FCRO: "SLRF", FCRE: "SLRP", FCPO: "SLVF", FCPE: "SLVP",
  FARO: "SERF", FARE: "SERP", FAPO: "SEVF", FAPE: "SEVP",
};

export function migrateLoveCode(code: string): string {
  return LEGACY_LOVE_CODE_MAP[code] ?? code;
}

// ── parseRevelaCode ──────────────────────────────────────────
// 新形式: {RPGクラス名}-{1-16}
// 旧形式: MBTI-AELV[-zodiac[-tarot]] (backward compat)
export function parseRevelaCode(code: string): ParsedCode | null {
  if (!code) return null;
  const trimmed = code.trim();

  // 新形式の判定: 末尾が数字1-16 かつ RPGクラス名が既知
  const lastHyphen = trimmed.lastIndexOf("-");
  if (lastHyphen !== -1) {
    const numStr = trimmed.slice(lastHyphen + 1);
    const num = parseInt(numStr, 10);
    const name = trimmed.slice(0, lastHyphen);
    if (!isNaN(num) && num >= 1 && num <= 16 && RPG_GROUPS[name]) {
      const groups = RPG_GROUPS[name];
      const mbtiIdx = Math.floor((num - 1) / 4);
      const loveIdx = (num - 1) % 4;
      return {
        mbti: _MBTI_IN_GROUP[groups.mbtiGroup][mbtiIdx],
        loveType: _AELV_IN_GROUP[groups.loveGroup][loveIdx],
        rpgClassName: name,
        classNumber: num,
      };
    }
  }

  // 旧形式: MBTI-AELV[-zodiac[-tarot]]
  const parts = trimmed.split("-");
  if (parts.length < 2) return null;
  const mbti = parts[0].toUpperCase();
  if (!/^[A-Z]{4}$/.test(mbti)) return null;
  const rawLove = parts[1].toUpperCase();
  if (!/^[A-Z]{4}$/.test(rawLove)) return null;
  const loveType = migrateLoveCode(rawLove);
  const zodiac = parts[2] ? (SHORT_ZODIAC_MAP[parts[2]] ?? parts[2]) : undefined;

  // RPGクラスを逆引き（グループ経由）
  const mbtiGroupEntry = Object.entries(_MBTI_IN_GROUP).find(([, list]) => list.includes(mbti));
  const loveNorm = LEGACY_LOVE_CODE_MAP[loveType] ?? loveType;
  const loveGroupEntry = Object.entries(_AELV_IN_GROUP).find(([, list]) => list.includes(loveNorm));
  let rpgClassName = "";
  let classNumber = 0;
  if (mbtiGroupEntry && loveGroupEntry) {
    const [mbtiGroup] = mbtiGroupEntry;
    const [loveGroup] = loveGroupEntry;
    const found = Object.entries(RPG_GROUPS).find(
      ([, g]) => g.mbtiGroup === mbtiGroup && g.loveGroup === loveGroup
    );
    if (found) {
      rpgClassName = found[0];
      const mbtiIdx = _MBTI_IN_GROUP[mbtiGroup].indexOf(mbti);
      const loveIdx = _AELV_IN_GROUP[loveGroup].indexOf(loveNorm);
      classNumber = mbtiIdx * 4 + loveIdx + 1;
    }
  }

  return { mbti, loveType, rpgClassName, classNumber, zodiac };
}

// ============================================================
// Compatibility calculation — グループベース新ロジック
// 建前相性 40% + 本音相性 40% + ギャップ補完 20%
// ============================================================

export interface FullCompatibilityResult {
  total: number;
  mbtiScore: number;   // 建前グループ相性
  charaScore: number;  // 本音グループ相性
  gapScore: number;    // ギャップ補完
  zodiacScore: number; // deprecated: 常に0
  comment: string;
  strengths: string[];
  cautions: string[];
}

// 建前グループ相性 ─────────────────────────────────────────────
// 補完: LEADER↔SUPPORT, BRAIN↔TRICKSTER → 85
// 同じ: 70
// その他: 60
// 対立: LEADER↔BRAIN, SUPPORT↔TRICKSTER → 45
const _MBTI_COMPLEMENT: Record<string, string> = {
  LEADER: "SUPPORT", SUPPORT: "LEADER",
  BRAIN: "TRICKSTER", TRICKSTER: "BRAIN",
};
const _MBTI_CONFLICT: Record<string, string> = {
  LEADER: "BRAIN", BRAIN: "LEADER",
  SUPPORT: "TRICKSTER", TRICKSTER: "SUPPORT",
};

function calcMbtiGroupScore(a: ParsedCode, b: ParsedCode): number {
  const ga = RPG_GROUPS[a.rpgClassName]?.mbtiGroup;
  const gb = RPG_GROUPS[b.rpgClassName]?.mbtiGroup;
  if (!ga || !gb) return 60;
  if (ga === gb) return 70;
  if (_MBTI_COMPLEMENT[ga] === gb) return 85;
  if (_MBTI_CONFLICT[ga] === gb) return 45;
  return 60;
}

// 本音グループ相性 ─────────────────────────────────────────────
// 補完: 前衛↔後衛（同じF軸）, 自由↔頭脳（同じP軸） → 90
// 同じ: 75
// その他: 60
// 対立: 前衛↔頭脳, 自由↔後衛（全軸対立） → 40
const _LOVE_COMPLEMENT: Record<string, string> = {
  前衛: "後衛", 後衛: "前衛",
  自由: "頭脳", 頭脳: "自由",
};
const _LOVE_CONFLICT: Record<string, string> = {
  前衛: "頭脳", 頭脳: "前衛",
  自由: "後衛", 後衛: "自由",
};

function calcLoveGroupScore(a: ParsedCode, b: ParsedCode): number {
  const ga = RPG_GROUPS[a.rpgClassName]?.loveGroup;
  const gb = RPG_GROUPS[b.rpgClassName]?.loveGroup;
  if (!ga || !gb) return 60;
  if (ga === gb) return 75;
  if (_LOVE_COMPLEMENT[ga] === gb) return 90;
  if (_LOVE_CONFLICT[ga] === gb) return 40;
  return 60;
}

// ギャップ補完 ─────────────────────────────────────────────────
// AさんのloveGroupが BさんのmbtiGroupと同じロール = 本音が相手の建前を補う
const _LOVE_TO_ROLE: Record<string, string> = {
  前衛: "LEADER", 自由: "TRICKSTER", 後衛: "SUPPORT", 頭脳: "BRAIN",
};

function calcGapComplementScore(a: ParsedCode, b: ParsedCode): number {
  const ga = RPG_GROUPS[a.rpgClassName];
  const gb = RPG_GROUPS[b.rpgClassName];
  if (!ga || !gb) return 50;
  let match = 0;
  if (_LOVE_TO_ROLE[ga.loveGroup] === gb.mbtiGroup) match++;
  if (_LOVE_TO_ROLE[gb.loveGroup] === ga.mbtiGroup) match++;
  if (match === 2) return 95;
  if (match === 1) return 75;
  return 50;
}

// コメント生成 ─────────────────────────────────────────────────
function buildComment(a: ParsedCode, b: ParsedCode): string {
  const ga = RPG_GROUPS[a.rpgClassName];
  const gb = RPG_GROUPS[b.rpgClassName];
  const classA = a.rpgClassName || a.mbti;
  const classB = b.rpgClassName || b.mbti;
  if (ga && gb && _MBTI_COMPLEMENT[ga.mbtiGroup] === gb.mbtiGroup) {
    return `${classA}と${classB}は、建前の役割が自然に補い合う関係です。一方が動くとき、もう一方が支える。お互いの強みが引き出されやすい組み合わせです。`;
  }
  if (ga && gb && _LOVE_COMPLEMENT[ga.loveGroup] === gb.loveGroup) {
    return `${classA}と${classB}は、本音の欲求が噛み合う関係です。内側の動きたい方向が自然にシンクロし、一緒にいると居心地よく感じられます。`;
  }
  return `${classA}と${classB}の組み合わせは、それぞれの個性が独自の化学反応を生み出します。建前・本音・ギャップの3つの次元から見えてくる、二人だけのエネルギーの流れがあります。`;
}

function buildStrengths(a: ParsedCode, b: ParsedCode): string[] {
  const strengths: string[] = [];
  const ga = RPG_GROUPS[a.rpgClassName];
  const gb = RPG_GROUPS[b.rpgClassName];
  if (!ga || !gb) return ["それぞれの違いを学び合える関係です。"];

  if (_MBTI_COMPLEMENT[ga.mbtiGroup] === gb.mbtiGroup) {
    strengths.push(`建前が「${ga.mbtiGroup}×${gb.mbtiGroup}」の補完関係。表の役割が自然に噛み合います。`);
  }
  if (_LOVE_COMPLEMENT[ga.loveGroup] === gb.loveGroup) {
    strengths.push(`本音が「${ga.loveGroup}×${gb.loveGroup}」の補完関係。内側の欲求がシンクロしやすいです。`);
  }
  if (_LOVE_TO_ROLE[ga.loveGroup] === gb.mbtiGroup || _LOVE_TO_ROLE[gb.loveGroup] === ga.mbtiGroup) {
    strengths.push("一方の本音が相手の建前を自然に補っています。ギャップが逆にシナジーになります。");
  }
  if (strengths.length === 0) {
    strengths.push("異なる視点を持ち合わせることで、互いに刺激し合える関係です。");
  }
  return strengths;
}

function buildCautions(a: ParsedCode, b: ParsedCode): string[] {
  const cautions: string[] = [];
  const ga = RPG_GROUPS[a.rpgClassName];
  const gb = RPG_GROUPS[b.rpgClassName];
  if (!ga || !gb) return ["コミュニケーションスタイルの違いを意識することが大切です。"];

  if (_MBTI_CONFLICT[ga.mbtiGroup] === gb.mbtiGroup) {
    cautions.push(`建前が「${ga.mbtiGroup}×${gb.mbtiGroup}」は主導権の取り合いになりやすいです。役割分担を明確にすると◎。`);
  }
  if (_LOVE_CONFLICT[ga.loveGroup] === gb.loveGroup) {
    cautions.push(`本音が「${ga.loveGroup}×${gb.loveGroup}」は欲求の方向が真逆。お互いの内面を言語化して共有することが重要です。`);
  }
  if (cautions.length === 0) {
    cautions.push("大きな衝突要因は少ないですが、本音を言い合える関係を意識的に育てましょう。");
  }
  return cautions;
}

// ── Main export ──────────────────────────────────────────────
export function calculateFullCompatibility(
  codeA: ParsedCode,
  codeB: ParsedCode
): FullCompatibilityResult {
  const mbtiScore  = calcMbtiGroupScore(codeA, codeB);
  const charaScore = calcLoveGroupScore(codeA, codeB);
  const gapScore   = calcGapComplementScore(codeA, codeB);
  const total      = Math.round(mbtiScore * 0.40 + charaScore * 0.40 + gapScore * 0.20);

  return {
    total, mbtiScore, charaScore, gapScore, zodiacScore: 0,
    comment:   buildComment(codeA, codeB),
    strengths: buildStrengths(codeA, codeB),
    cautions:  buildCautions(codeA, codeB),
  };
}
