// ============================================================
// RPG Party Synergy — 5-pattern system
// ============================================================

export type RoleType = "LEADER" | "SUPPORT" | "BRAIN" | "TRICKSTER";

export const CLASS_ROLES: Record<string, RoleType> = {
  // LEADER — 前衛・カリスマ系
  "覇王": "LEADER",
  "執行官": "LEADER",
  "聖騎士": "LEADER",
  "海賊王": "LEADER",

  // SUPPORT — 後衛・共感・調整系
  "聖職者": "SUPPORT",
  "ギルドマスター": "SUPPORT",
  "騎士団長": "SUPPORT",
  "吟遊詩人": "SUPPORT",

  // BRAIN — 頭脳・論理・戦略系
  "賢者": "BRAIN",
  "錬金術師": "BRAIN",
  "影の刺客": "BRAIN",
  "予言者": "BRAIN",

  // TRICKSTER — 自由・直感・カオス系
  "奇術師": "TRICKSTER",
  "冒険者": "TRICKSTER",
  "森の狩人": "TRICKSTER",
  "星の踊り子": "TRICKSTER",
};

export type SynergyPatternId = 1 | 2 | 3 | 4 | 5;

export interface SynergyPattern {
  id: SynergyPatternId;
  rank: "S" | "A" | "A+" | "B" | "C";
  name: string;
  nameEn: string;
  title: string;
  description: string;
  color: string;
}

export const SYNERGY_PATTERNS: Record<SynergyPatternId, SynergyPattern> = {
  1: {
    id: 1,
    rank: "S",
    name: "相互補完",
    nameEn: "Perfect Complement",
    title: "絶対的な矛と、無尽蔵の盾。",
    description:
      "[A]の圧倒的な推進力と、[B]の徹底した後方支援。お互いのパラメーターの欠落を完全に補い合う、RPGにおいて最も美しく強固な陣形です。前衛が迷いなく振り抜けるのは、後衛の絶対的なカバーがあるからこそ。依存と信頼が完璧なバランスで成立する、戦術的シナジーの最高到達点です。",
    color: "#EDEDED",
  },
  2: {
    id: 2,
    rank: "A",
    name: "完全共鳴",
    nameEn: "Full Resonance",
    title: "鏡合わせの双発エンジン。",
    description:
      "思考のアルゴリズムと行動原理がシンクロする、ツートップの特攻陣形です。[A]と[B]は、言葉を交わさずとも互いの次の一手が読めるため、出会った瞬間に圧倒的なスピードで関係値が構築されます。「死角（弱点）」も完全に一致している点には注意が必要ですが、圧倒的な推進力が魅力です。",
    color: "#60a5fa",
  },
  3: {
    id: 3,
    rank: "A+",
    name: "劇薬結合",
    nameEn: "Volatile Compound",
    title: "秩序と混沌の劇薬。",
    description:
      "すべてを計算通りに進めたいパラメーターと、直感とノリで盤面をかき回すパラメーター。一見すると全く噛み合わない、劇薬のような組み合わせです。しかし、[A]の構築した精緻なロジックが壁にぶつかった時、[B]の突拍子もないアイデアがパーティーの危機を救います。違いを許容できれば、爆発的なブレイクスルーを生み出します。",
    color: "#c084fc",
  },
  4: {
    id: 4,
    rank: "B",
    name: "主従関係",
    nameEn: "Command & Follow",
    title: "支配と追従のシステム。",
    description:
      "一方が明確に手綱を握り、もう一方がそれに合わせて形を変えることで、完璧な均衡を保つ陣形です。[A]と[B]の間には暗黙の役割分担が成立しており、意思決定のコストは極端に低い。ただし一方向へのエネルギー供給が常態化すると耐久力が低下します。定期的に戦術を見直し、対等な意見交換が長期運用の鍵です。",
    color: "#fbbf24",
  },
  5: {
    id: 5,
    rank: "C",
    name: "取扱注意",
    nameEn: "Handle with Care",
    title: "水と油のサバイバル。",
    description:
      "行動の基準、愛情の出力方法、見ている世界線。すべてのパラメーターが真っ向から反発し合う、難易度の高い陣形です。[A]の良かれと思ったサポートが[B]の進行の邪魔になるなど、初期段階ではエラーと衝突が絶えません。しかしこれは相性の悪さではなく、互いのOSが根本的に異なるためです。乗り越えれば一人では見えなかった世界を開拓できます。",
    color: "#f87171",
  },
};

export function getSynergyPatternId(classNameA: string, classNameB: string): SynergyPatternId {
  const roleA = CLASS_ROLES[classNameA];
  const roleB = CLASS_ROLES[classNameB];
  if (!roleA || !roleB) return 5;

  // 同じ役割 → 完全共鳴
  if (roleA === roleB) return 2;

  const combo = [roleA, roleB].sort().join("_");

  switch (combo) {
    // 絶対補完: 前衛 × 後衛
    case "LEADER_SUPPORT": return 1;

    // 劇薬: 頭脳 × 自由 / 前衛 × 自由
    case "BRAIN_TRICKSTER":
    case "LEADER_TRICKSTER": return 3;

    // 主従: 頭脳 × 後衛 / 前衛 × 頭脳
    case "BRAIN_SUPPORT":
    case "BRAIN_LEADER": return 4;

    // 取扱注意: 後衛 × 自由（すれ違い）
    case "SUPPORT_TRICKSTER": return 5;

    default: return 5;
  }
}

export function getSynergyDescription(pattern: SynergyPattern, nameA: string, nameB: string): string {
  return pattern.description
    .replace(/\[A\]/g, nameA)
    .replace(/\[B\]/g, nameB);
}
