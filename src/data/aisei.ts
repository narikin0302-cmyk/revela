// ============================================================
// 相性診断データ（MBTI相性）
// ============================================================

export interface CompatibilityResult {
  score: number; // 0-100
  rank: "S" | "A" | "B" | "C" | "D";
  strengths: string;
  cautions: string;
  advice: string;
  label: string;
}

// Key format: "TYPE1_TYPE2" (always alphabetical order to avoid duplicates)
function makeKey(a: string, b: string): string {
  return [a, b].sort().join("_");
}

const compatibilityData: Record<string, CompatibilityResult> = {
  // ─── Excellent Pairs ───────────────────────────────────────
  [makeKey("INFJ", "ENFP")]: {
    score: 92,
    rank: "S",
    label: "魂の共鳴",
    strengths:
      "INFJの深い洞察とENFPの明るい情熱が見事に補い合います。INFJが見えない真実を感じ取り、ENFPがそれを世界に向けて語りかけることで、二人は共にいる場所を特別な空間に変えます。お互いの直感を尊重し、深い価値観の対話を楽しめる稀有な組み合わせです。",
    cautions:
      "INFJは孤独な内省を必要とする時間があり、ENFPの旺盛な社交性とぶつかることがあります。またENFPの一見気まぐれに見える行動がINFJの計画性と衝突することも。",
    advice:
      "お互いの「再充電」の方法が違うことを理解し合うことが鍵です。INFJは一人の時間を、ENFPは外との繋がりを必要とすることを率直に伝え合い、それぞれのペースを尊重する空間を作りましょう。",
  },
  [makeKey("INTJ", "ENFP")]: {
    score: 88,
    rank: "S",
    label: "光と影の補完",
    strengths:
      "INTJのビジョンの深さとENFPの可能性への情熱が結びつくと、二人の会話は常に知的な冒険となります。INTJが構造を作り、ENFPがそれに生命力を吹き込む関係が自然と生まれます。",
    cautions:
      "INTJの批判的な思考がENFPの感情を傷つけることがあります。一方ENFPの計画への無頓着さがINTJをフラストレーションさせる場面も。",
    advice:
      "批評と承認のバランスを意識して。INTJは時に感情的なサポートを優先し、ENFPは約束と計画を大切にすることを意識すると関係が深まります。",
  },
  [makeKey("INFP", "ENFJ")]: {
    score: 90,
    rank: "S",
    label: "夢と共鳴",
    strengths:
      "INFPの深い内省とENFJの温かいリーダーシップが美しく交わります。ENFJはINFPの夢を引き出し、INFPはENFJの心に静けさと深みをもたらします。",
    cautions:
      "ENFJが過度にINFPをコントロールしようとすると、INFPの自由な魂が窒息を感じることがあります。INFPが内に引きこもりすぎると、ENFJが孤独を感じることも。",
    advice:
      "ENFJはINFPの独自性を尊重し、方向性を押し付けないことが大切です。INFPは自分の感情を言葉にする努力をすることで、ENFJに必要な繋がりを与えられます。",
  },
  [makeKey("INTP", "ENTP")]: {
    score: 85,
    rank: "A",
    label: "知の饗宴",
    strengths:
      "両者の知的好奇心が共鳴し、会話は果てることなく続きます。お互いの思考を尊重し、議論を楽しめる稀有なペアです。",
    cautions:
      "実生活の現実的な側面（家事・金銭管理・感情表現）が疎かになりがちです。どちらも感情表現が不得意なため、心のすれ違いが気づかれにくいことも。",
    advice:
      "知的な議論だけでなく、感情の共有にも意識を向けることが大切です。定期的に「今どんな気持ちか」を話し合う習慣をつくりましょう。",
  },
  [makeKey("ISFJ", "ESFP")]: {
    score: 83,
    rank: "A",
    label: "温かい陽だまり",
    strengths:
      "ISFJの安定した献身とESFPの明るいエネルギーが日常を豊かに彩ります。ISFJは家庭の温もりを作り、ESFPはその場を笑いと喜びで満たします。",
    cautions:
      "ISFJの変化への慎重さとESFPの自発性がぶつかることがあります。ISFJが求める計画性をESFPが退屈に感じることも。",
    advice:
      "ルーティンと自発性のバランスを話し合い、どちらの欲求も満たせる生活設計を二人で作ることが重要です。",
  },
  [makeKey("ISTJ", "ESFJ")]: {
    score: 87,
    rank: "A",
    label: "堅実な絆",
    strengths:
      "両者の誠実さと責任感が強固な信頼関係を築きます。家庭・仕事・人間関係において共通の価値観を持ち、長期的な安定を築くのに最適なペアです。",
    cautions:
      "どちらも変化に慎重なため、関係がマンネリ化しやすいです。感情表現や自発的なロマンスが不足しがちになることがあります。",
    advice:
      "定期的な新しい体験を意識的に取り入れることで関係を活性化させましょう。サプライズや非日常が二人の絆をより深めます。",
  },
  [makeKey("ENFJ", "INFJ")]: {
    score: 89,
    rank: "S",
    label: "理想の共鳴者",
    strengths:
      "両者の深い共感力と理想主義が完璧に共鳴します。お互いの内側の世界を理解し合い、精神的な深みのある関係を自然に作り上げます。",
    cautions:
      "どちらも他者のニーズを優先しがちで、自分たちの関係のケアを後回しにしやすいです。内向きに過ぎる会話が現実の問題を見えにくくすることも。",
    advice:
      "二人の関係そのものを大切に育てることを忘れずに。定期的に「私たちはどうありたいか」を話し合う時間を作りましょう。",
  },
  [makeKey("ESTP", "ISTP")]: {
    score: 81,
    rank: "A",
    label: "実力者の同盟",
    strengths:
      "両者の実践的な問題解決力と冒険心が組み合わさると、どんな困難も乗り越える強力なチームになります。お互いの実力を認め合う率直な関係です。",
    cautions:
      "感情的な繋がりを後回しにしがちで、関係が表面的になることがあります。ESTJのエネルギーが内向きなISTPを圧倒する場合も。",
    advice:
      "行動だけでなく、感情の共有の場も意識的に作りましょう。冒険を共に楽しみながら、心の声を少しずつ開いていくことが長続きのコツです。",
  },
  [makeKey("INTJ", "INFJ")]: {
    score: 86,
    rank: "A",
    label: "深淵の対話",
    strengths:
      "どちらも深く考え、長期的なビジョンを描く力を持っています。INTJの論理的な構造とINFJの直感的な洞察が補い合い、二人でいると思考が何倍にも深まります。",
    cautions:
      "どちらも感情表現が少ないため、心の距離が縮まらないまま時間が過ぎることがあります。また内省が深すぎて行動が伴わないことも。",
    advice:
      "言葉で感謝や愛情を積極的に伝える習慣をつけることが関係を温かくします。思考だけでなく感情も共有することを意識しましょう。",
  },
  [makeKey("ENFP", "INFP")]: {
    score: 80,
    rank: "A",
    label: "夢見る二人",
    strengths:
      "共に豊かな感受性と理想主義を持ち、お互いの夢を全力で応援できます。創造的なプロジェクトや精神的な探求を共に楽しめる特別な関係です。",
    cautions:
      "現実的な問題に向き合う力が弱くなりがちです。どちらも批判に敏感なため、必要な対立を避け続けて関係に不満が溜まることも。",
    advice:
      "夢を語り合いながらも、具体的な行動計画を立てる習慣を作りましょう。意見の相違を怖れず、正直に話し合うことが二人の関係を本物にします。",
  },
};

// Fallback logic based on personality dimensions
function calculateFallbackScore(typeA: string, typeB: string): CompatibilityResult {
  let score = 50;

  // Same EI → slight bonus
  if (typeA[0] === typeB[0]) score += 5;
  else score += 10; // Opposite EI often works well

  // Same SN → bonus (shared world view)
  if (typeA[1] === typeB[1]) score += 8;

  // Opposite TF → often good balance
  if (typeA[2] !== typeB[2]) score += 7;

  // Same JP → slight bonus
  if (typeA[3] === typeB[3]) score += 5;

  score = Math.min(79, Math.max(45, score));

  const rank: CompatibilityResult["rank"] =
    score >= 90 ? "S" : score >= 80 ? "A" : score >= 65 ? "B" : score >= 50 ? "C" : "D";

  return {
    score,
    rank,
    label: "互いに学び合う関係",
    strengths:
      `${typeA}と${typeB}は互いの異なる強みを持ち寄ることで、お互いの盲点を補い合える可能性があります。特に思考スタイルの違いが、新たな視点と発見をもたらすでしょう。`,
    cautions:
      "コミュニケーションスタイルや価値観の違いを早めに話し合うことが大切です。誤解が生じやすい部分を理解し合う努力が関係を深めます。",
    advice:
      "違いを欠点としてではなく、補い合える強みとして受け入れることがこの関係の鍵です。お互いの特性を尊重し、共通の価値観を見つけることに集中しましょう。",
  };
}

export function getCompatibility(typeA: string, typeB: string): CompatibilityResult {
  const key = makeKey(typeA, typeB);
  return compatibilityData[key] ?? calculateFallbackScore(typeA, typeB);
}

export const mbtiTypes = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
] as const;

export type MBTIType = typeof mbtiTypes[number];
