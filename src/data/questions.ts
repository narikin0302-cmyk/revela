// ============================================================
// MBTI Questions (10 questions)
// Each question maps A → first dichotomy letter, B → second
// ============================================================

export type MBTIDimension = "EI" | "SN" | "TF" | "JP";

export interface MBTIQuestion {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  dimension: MBTIDimension;
  aValue: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
  bValue: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
}

export const mbtiQuestions: MBTIQuestion[] = [
  {
    id: 1,
    question: "週末の理想的な過ごし方は？",
    optionA: "友人や大勢の人たちと賑やかに過ごしたい",
    optionB: "一人か少人数でゆっくりと過ごしたい",
    dimension: "EI",
    aValue: "E",
    bValue: "I",
  },
  {
    id: 2,
    question: "初めて会った人と話すとき、あなたは…",
    optionA: "自分からどんどん話しかける方だ",
    optionB: "相手が話しかけてくるのを待つ方だ",
    dimension: "EI",
    aValue: "E",
    bValue: "I",
  },
  {
    id: 3,
    question: "何か新しいことを学ぶとき、重視するのは？",
    optionA: "具体的な事実やデータ、実際に使えること",
    optionB: "全体像や可能性、未来への応用",
    dimension: "SN",
    aValue: "S",
    bValue: "N",
  },
  {
    id: 4,
    question: "旅行の計画を立てるとき、あなたは…",
    optionA: "細かいスケジュールを事前にしっかり立てたい",
    optionB: "その場の流れに任せてフレキシブルに動きたい",
    dimension: "JP",
    aValue: "J",
    bValue: "P",
  },
  {
    id: 5,
    question: "友人が悩みを打ち明けてきたとき、まず何をする？",
    optionA: "解決策や具体的なアドバイスを考える",
    optionB: "気持ちに寄り添い、話をじっくり聞く",
    dimension: "TF",
    aValue: "T",
    bValue: "F",
  },
  {
    id: 6,
    question: "仕事やプロジェクトを進めるスタイルは？",
    optionA: "期限より前に計画的に終わらせる",
    optionB: "締め切り直前に集中して仕上げる",
    dimension: "JP",
    aValue: "J",
    bValue: "P",
  },
  {
    id: 7,
    question: "あなたにとって「信頼できる人」とは？",
    optionA: "約束を守り、一貫性がある論理的な人",
    optionB: "感情を理解してくれる、温かみのある人",
    dimension: "TF",
    aValue: "T",
    bValue: "F",
  },
  {
    id: 8,
    question: "ひらめきやアイデアを得るのはどんなとき？",
    optionA: "過去の経験や実績を振り返ったとき",
    optionB: "「もし〇〇だったら」と想像を広げたとき",
    dimension: "SN",
    aValue: "S",
    bValue: "N",
  },
  {
    id: 9,
    question: "エネルギーが満ちてくるのはどんなとき？",
    optionA: "人と交流して刺激を受けたとき",
    optionB: "一人で静かに思考を深めたとき",
    dimension: "EI",
    aValue: "E",
    bValue: "I",
  },
  {
    id: 10,
    question: "何かを決断するとき、最終的に頼るのは？",
    optionA: "客観的な事実や論理的な根拠",
    optionB: "自分の価値観や直感、感情",
    dimension: "TF",
    aValue: "T",
    bValue: "F",
  },
];

// ============================================================
// キャラクターコード Questions (5 questions — 16-type system)
// Axis 1: L (積極的) vs F (受動的)
// Axis 2: C (クール) vs A (感情的)
// Axis 3: R (現実的) vs P (情熱的)
// Axis 4: O (オープン) vs E (内向的)
// ============================================================

export type LoveAxis1 = "L" | "F";
export type LoveAxis2 = "C" | "A";
export type LoveAxis3 = "R" | "P";
export type LoveAxis4 = "O" | "E";

// 16 character code types: e.g. "LCRO", "FAPE" etc.
export type LoveType =
  | "LCRO" | "LCRE" | "LCPO" | "LCPE"
  | "LARO" | "LARE" | "LAPO" | "LAPE"
  | "FCRO" | "FCRE" | "FCPO" | "FCPE"
  | "FARO" | "FARE" | "FAPO" | "FAPE";

export interface LoveQuestion {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  axis: "1" | "2" | "3" | "4";
  aValue: LoveAxis1 | LoveAxis2 | LoveAxis3 | LoveAxis4;
  bValue: LoveAxis1 | LoveAxis2 | LoveAxis3 | LoveAxis4;
}

export const loveQuestions: LoveQuestion[] = [
  {
    id: 1,
    question: "ストレスの多いグループプロジェクトに取り組むとき、あなたは？",
    optionA: "自分から方向性を提示して積極的に引っ張る",
    optionB: "周囲の様子を見ながら最適なタイミングで動く",
    axis: "1",
    aValue: "L",
    bValue: "F",
  },
  {
    id: 2,
    question: "大きな目標を達成したとき、最初に感じることは？",
    optionA: "冷静に次のステップを考え始める",
    optionB: "感情があふれ出て、誰かと喜びを分かち合いたくなる",
    axis: "2",
    aValue: "C",
    bValue: "A",
  },
  {
    id: 3,
    question: "グループで決断が必要なとき、あなたは…",
    optionA: "データや実績をもとに現実的な選択肢を示す",
    optionB: "みんながワクワクできる大胆なアイデアを提案する",
    axis: "3",
    aValue: "R",
    bValue: "P",
  },
  {
    id: 4,
    question: "まったく新しい環境に飛び込んだとき、あなたは？",
    optionA: "積極的に話しかけて、すぐに自分のネットワークを広げる",
    optionB: "まず観察して、自分のペースで少しずつ馴染んでいく",
    axis: "4",
    aValue: "O",
    bValue: "E",
  },
  {
    id: 5,
    question: "長くて過酷な一日の終わりに、あなたの回復法は？",
    optionA: "体を動かすか、具体的な作業で頭を切り替える",
    optionB: "音楽・本・空想など、感覚の世界に浸る",
    axis: "3",
    aValue: "R",
    bValue: "P",
  },
];

// ============================================================
// MBTI Question Pool (20 questions — 5 per dimension)
// ============================================================

export const mbtiQuestionPool: MBTIQuestion[] = [
  // ── EI (5 questions) ──
  { id: 1,  question: "週末の理想的な過ごし方は？", optionA: "友人や大勢の人たちと賑やかに過ごしたい", optionB: "一人か少人数でゆっくりと過ごしたい", dimension: "EI", aValue: "E", bValue: "I" },
  { id: 2,  question: "初めて会った人と話すとき、あなたは…", optionA: "自分からどんどん話しかける方だ", optionB: "相手が話しかけてくるのを待つ方だ", dimension: "EI", aValue: "E", bValue: "I" },
  { id: 9,  question: "エネルギーが満ちてくるのはどんなとき？", optionA: "人と交流して刺激を受けたとき", optionB: "一人で静かに思考を深めたとき", dimension: "EI", aValue: "E", bValue: "I" },
  { id: 11, question: "グループの会話では？", optionA: "話の中心になって盛り上げたい", optionB: "聞き役に回ることが多い", dimension: "EI", aValue: "E", bValue: "I" },
  { id: 12, question: "疲れたとき回復するのは？", optionA: "友達に会って話して元気を取り戻す", optionB: "家でひとりで静かに過ごす", dimension: "EI", aValue: "E", bValue: "I" },
  // ── SN (5 questions) ──
  { id: 3,  question: "何か新しいことを学ぶとき、重視するのは？", optionA: "具体的な事実やデータ、実際に使えること", optionB: "全体像や可能性、未来への応用", dimension: "SN", aValue: "S", bValue: "N" },
  { id: 8,  question: "ひらめきやアイデアを得るのはどんなとき？", optionA: "過去の経験や実績を振り返ったとき", optionB: "「もし〇〇だったら」と想像を広げたとき", dimension: "SN", aValue: "S", bValue: "N" },
  { id: 13, question: "物語や映画で惹かれるのは？", optionA: "リアルで現実的なストーリー", optionB: "想像力あふれる世界観", dimension: "SN", aValue: "S", bValue: "N" },
  { id: 14, question: "仕事の説明を受けるとき、欲しいのは？", optionA: "具体的な手順やマニュアル", optionB: "目的と背景・全体像の説明", dimension: "SN", aValue: "S", bValue: "N" },
  { id: 15, question: "「理想」と聞いてイメージするのは？", optionA: "現実的に達成できる具体的な目標", optionB: "まだ存在しない何か新しいもの", dimension: "SN", aValue: "S", bValue: "N" },
  // ── TF (5 questions) ──
  { id: 5,  question: "友人が悩みを打ち明けてきたとき、まず何をする？", optionA: "解決策や具体的なアドバイスを考える", optionB: "気持ちに寄り添い、話をじっくり聞く", dimension: "TF", aValue: "T", bValue: "F" },
  { id: 7,  question: "あなたにとって「信頼できる人」とは？", optionA: "約束を守り、一貫性がある論理的な人", optionB: "感情を理解してくれる、温かみのある人", dimension: "TF", aValue: "T", bValue: "F" },
  { id: 10, question: "何かを決断するとき、最終的に頼るのは？", optionA: "客観的な事実や論理的な根拠", optionB: "自分の価値観や直感、感情", dimension: "TF", aValue: "T", bValue: "F" },
  { id: 16, question: "物事を判断するときの基準は？", optionA: "論理的に正しいかどうか", optionB: "自分や周りの気持ちに合っているかどうか", dimension: "TF", aValue: "T", bValue: "F" },
  { id: 17, question: "映画や本で感動するのは？", optionA: "緻密な設定や論理的な展開", optionB: "登場人物の感情や人間関係", dimension: "TF", aValue: "T", bValue: "F" },
  // ── JP (5 questions) ──
  { id: 4,  question: "旅行の計画を立てるとき、あなたは…", optionA: "細かいスケジュールを事前にしっかり立てたい", optionB: "その場の流れに任せてフレキシブルに動きたい", dimension: "JP", aValue: "J", bValue: "P" },
  { id: 6,  question: "仕事やプロジェクトを進めるスタイルは？", optionA: "期限より前に計画的に終わらせる", optionB: "締め切り直前に集中して仕上げる", dimension: "JP", aValue: "J", bValue: "P" },
  { id: 18, question: "買い物のスタイルは？", optionA: "必要なものをリスト化して計画的に買う", optionB: "その場の直感で気になったものを買う", dimension: "JP", aValue: "J", bValue: "P" },
  { id: 19, question: "TODOリストについて", optionA: "常に作成してタスクを管理している", optionB: "頭の中や気分で動く方が好き", dimension: "JP", aValue: "J", bValue: "P" },
  { id: 20, question: "複数のタスクがあるとき", optionA: "優先順位をつけて順番に片付ける", optionB: "気が向いたものから取り組む", dimension: "JP", aValue: "J", bValue: "P" },
];

// ============================================================
// Love Question Pool (16 questions — 4 per axis)
// ============================================================

export const loveQuestionPool: LoveQuestion[] = [
  // ── Axis 1: L vs F (4 questions) ──
  { id: 1,  question: "ストレスの多いグループプロジェクトに取り組むとき、あなたは？", optionA: "自分から方向性を提示して積極的に引っ張る", optionB: "周囲の様子を見ながら最適なタイミングで動く", axis: "1", aValue: "L", bValue: "F" },
  { id: 6,  question: "初対面の人と話すとき", optionA: "自分から積極的に話しかける", optionB: "相手が話しかけてくるのを待つ", axis: "1", aValue: "L", bValue: "F" },
  { id: 7,  question: "グループで意見を言うとき", optionA: "自分の考えを積極的に発言する", optionB: "求められたときに話す", axis: "1", aValue: "L", bValue: "F" },
  { id: 8,  question: "何か問題が起きたとき", optionA: "すぐ動いて自分で解決しようとする", optionB: "状況を整理してから動く", axis: "1", aValue: "L", bValue: "F" },
  // ── Axis 2: C vs A (4 questions) ──
  { id: 2,  question: "大きな目標を達成したとき、最初に感じることは？", optionA: "冷静に次のステップを考え始める", optionB: "感情があふれ出て、誰かと喜びを分かち合いたくなる", axis: "2", aValue: "C", bValue: "A" },
  { id: 9,  question: "嬉しいことがあったとき", optionA: "内心は嬉しいが、あまり表に出さない", optionB: "表情や言葉で自然に感情を表現できる", axis: "2", aValue: "C", bValue: "A" },
  { id: 10, question: "映画を見て泣いたことは？", optionA: "ほとんどない", optionB: "よくある", axis: "2", aValue: "C", bValue: "A" },
  { id: 11, question: "怒りや悲しみを感じたとき", optionA: "冷静に整理してから対処する", optionB: "感情がすぐ顔や言葉に出てしまう", axis: "2", aValue: "C", bValue: "A" },
  // ── Axis 3: R vs P (4 questions) ──
  { id: 3,  question: "グループで決断が必要なとき、あなたは…", optionA: "データや実績をもとに現実的な選択肢を示す", optionB: "みんながワクワクできる大胆なアイデアを提案する", axis: "3", aValue: "R", bValue: "P" },
  { id: 5,  question: "長くて過酷な一日の終わりに、あなたの回復法は？", optionA: "体を動かすか、具体的な作業で頭を切り替える", optionB: "音楽・本・空想など、感覚の世界に浸る", axis: "3", aValue: "R", bValue: "P" },
  { id: 12, question: "大きな買い物をするとき", optionA: "予算と機能を比較してから決める", optionB: "ワクワクしたかどうかで決める", axis: "3", aValue: "R", bValue: "P" },
  { id: 13, question: "リスクについて", optionA: "できるだけ避けたい", optionB: "チャレンジのための必要コスト", axis: "3", aValue: "R", bValue: "P" },
  // ── Axis 4: O vs E (4 questions) ──
  { id: 4,  question: "まったく新しい環境に飛び込んだとき、あなたは？", optionA: "積極的に話しかけて、すぐに自分のネットワークを広げる", optionB: "まず観察して、自分のペースで少しずつ馴染んでいく", axis: "4", aValue: "O", bValue: "E" },
  { id: 14, question: "SNSで自己表現するのは？", optionA: "自分の意見や日常を積極的に発信する", optionB: "見る専門で、あまり発信しない", axis: "4", aValue: "O", bValue: "E" },
  { id: 15, question: "自分の悩みや本音を話すのは？", optionA: "気が許せれば誰にでも話せる", optionB: "ごく限られた人にしか話せない", axis: "4", aValue: "O", bValue: "E" },
  { id: 16, question: "プライベートを職場の人に話すのは？", optionA: "特に問題ない", optionB: "できるだけ話したくない", axis: "4", aValue: "O", bValue: "E" },
];

// ============================================================
// Randomized Question Selectors
// ============================================================

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function getRandomizedMBTIQuestions(count: number = 10): MBTIQuestion[] {
  const byDim: Record<MBTIDimension, MBTIQuestion[]> = { EI: [], SN: [], TF: [], JP: [] };
  mbtiQuestionPool.forEach((q) => byDim[q.dimension].push(q));

  const dims: MBTIDimension[] = ["EI", "SN", "TF", "JP"];
  const perDim = Math.floor(count / 4);
  const extras = count % 4;
  const extraDims = shuffle(dims).slice(0, extras);

  const result: MBTIQuestion[] = [];
  dims.forEach((dim) => {
    const needed = perDim + (extraDims.includes(dim) ? 1 : 0);
    result.push(...shuffle(byDim[dim]).slice(0, needed));
  });

  return shuffle(result);
}

export function getRandomizedLoveQuestions(count: number = 5): LoveQuestion[] {
  type LoveAxis = "1" | "2" | "3" | "4";
  const byAxis: Record<LoveAxis, LoveQuestion[]> = { "1": [], "2": [], "3": [], "4": [] };
  loveQuestionPool.forEach((q) => byAxis[q.axis].push(q));

  const axes: LoveAxis[] = ["1", "2", "3", "4"];
  const perAxis = Math.floor(count / 4);
  const extras = count % 4;
  const extraAxes = shuffle(axes).slice(0, extras);

  const result: LoveQuestion[] = [];
  axes.forEach((axis) => {
    const needed = perAxis + (extraAxes.includes(axis) ? 1 : 0);
    result.push(...shuffle(byAxis[axis]).slice(0, needed));
  });

  return shuffle(result);
}

// ============================================================
// Zodiac Signs
// ============================================================

export const zodiacSigns = [
  { value: "牡羊座", label: "♈ 牡羊座 (3/21〜4/19)" },
  { value: "牡牛座", label: "♉ 牡牛座 (4/20〜5/20)" },
  { value: "双子座", label: "♊ 双子座 (5/21〜6/21)" },
  { value: "蟹座", label: "♋ 蟹座 (6/22〜7/22)" },
  { value: "獅子座", label: "♌ 獅子座 (7/23〜8/22)" },
  { value: "乙女座", label: "♍ 乙女座 (8/23〜9/22)" },
  { value: "天秤座", label: "♎ 天秤座 (9/23〜10/23)" },
  { value: "蠍座", label: "♏ 蠍座 (10/24〜11/22)" },
  { value: "射手座", label: "♐ 射手座 (11/23〜12/21)" },
  { value: "山羊座", label: "♑ 山羊座 (12/22〜1/19)" },
  { value: "水瓶座", label: "♒ 水瓶座 (1/20〜2/18)" },
  { value: "魚座", label: "♓ 魚座 (2/19〜3/20)" },
];

// ============================================================
// MBTI Descriptions
// ============================================================

export const mbtiDescriptions: Record<string, { title: string; keywords: string }> = {
  INTJ: { title: "INTJ", keywords: "戦略的・独立心・完璧主義・ビジョン" },
  INTP: { title: "INTP", keywords: "知的好奇心・分析的・理論・革新" },
  ENTJ: { title: "ENTJ", keywords: "リーダーシップ・決断力・野心・効率" },
  ENTP: { title: "ENTP", keywords: "アイデア・挑戦・機知・可能性" },
  INFJ: { title: "INFJ", keywords: "直感・共感・理想主義・洞察力" },
  INFP: { title: "INFP", keywords: "詩的・共感・誠実・夢想家" },
  ENFJ: { title: "ENFJ", keywords: "カリスマ・共感・インスピレーション・導く" },
  ENFP: { title: "ENFP", keywords: "自由・創造・情熱・可能性" },
  ISTJ: { title: "ISTJ", keywords: "責任感・誠実・伝統・信頼性" },
  ISFJ: { title: "ISFJ", keywords: "温かみ・献身・実直・思いやり" },
  ESTJ: { title: "ESTJ", keywords: "秩序・規律・実行力・誠実" },
  ESFJ: { title: "ESFJ", keywords: "調和・サポート・社交性・思いやり" },
  ISTP: { title: "ISTP", keywords: "実践的・冷静・観察力・技術" },
  ISFP: { title: "ISFP", keywords: "感性・自由・芸術・今この瞬間" },
  ESTP: { title: "ESTP", keywords: "行動力・エネルギッシュ・現実主義・刺激" },
  ESFP: { title: "ESFP", keywords: "陽気・自発性・美的センス・喜び" },
};

// ============================================================
// Character Code Descriptions (16 types)
// ============================================================

export const loveTypeDescriptions: Record<LoveType, { subtitle: string; emoji: string; nickname: string; motto: string }> = {
  "LCRO": {
    subtitle: "自分のペースで世界を掌握するタイプ",
    emoji: "😼",
    nickname: "LCRO",
    motto: "「自分の軸を持ち、場の空気を自然に支配する」",
  },
  "LCRE": {
    subtitle: "信頼と冷静さで周囲を安心させるタイプ",
    emoji: "🐾",
    nickname: "LCRE",
    motto: "「クールな外見の内側に、深い誠実さがある」",
  },
  "LCPO": {
    subtitle: "自然と注目を集め、場を動かすタイプ",
    emoji: "👑",
    nickname: "LCPO",
    motto: "「存在するだけで、周りに光を与える」",
  },
  "LCPE": {
    subtitle: "エネルギーで周囲を巻き込む実行者タイプ",
    emoji: "🔥",
    nickname: "LCPE",
    motto: "「熱量で壁を突き破り、大事な人を全力で守る」",
  },
  "LARO": {
    subtitle: "包容力で自然に信頼を集めるタイプ",
    emoji: "🌟",
    nickname: "LARO",
    motto: "「温かさと実力で、人々の目標になる」",
  },
  "LARE": {
    subtitle: "リーダー性とバランス感覚を兼ね備えたタイプ",
    emoji: "⚡",
    nickname: "LARE",
    motto: "「対立を調和させ、全員が動ける状態を作る」",
  },
  "LAPO": {
    subtitle: "適応力抜群で本領発揮すると無敵なタイプ",
    emoji: "🦋",
    nickname: "LAPO",
    motto: "「どんな環境にも染まりながら、自分の本質を失わない」",
  },
  "LAPE": {
    subtitle: "優しさと強さを併せ持つ万能タイプ",
    emoji: "🦁",
    nickname: "LAPE",
    motto: "「誰かのために全力を尽くすとき、最大の力を発揮する」",
  },
  "FCRO": {
    subtitle: "距離感の達人で場を読む戦略家タイプ",
    emoji: "🎩",
    nickname: "FCRO",
    motto: "「場の空気を読んで最適解を導く」",
  },
  "FCRE": {
    subtitle: "愛嬌と冷静さを使い分ける直感派タイプ",
    emoji: "🐰",
    nickname: "FCRE",
    motto: "「柔らかさの裏に、鋭い観察眼を持っている」",
  },
  "FCPO": {
    subtitle: "ムードメーカーで本質は優しい魅力派タイプ",
    emoji: "👾",
    nickname: "FCPO",
    motto: "「場を盛り上げながら、誰よりも深く人を見ている」",
  },
  "FCPE": {
    subtitle: "誠実で感情豊かな真っ直ぐなタイプ",
    emoji: "🐕",
    nickname: "FCPE",
    motto: "「一度決めた信念を、どんな状況でも貫き通す」",
  },
  "FARO": {
    subtitle: "独自の視点で世界を解釈する観察者タイプ",
    emoji: "🌀",
    nickname: "FARO",
    motto: "「普通に見えて、誰も考えない角度から物事を捉える」",
  },
  "FARE": {
    subtitle: "観察力が高く縁の下の力持ちタイプ",
    emoji: "📋",
    nickname: "FARE",
    motto: "「全体を俯瞰し、必要な人に必要なサポートをする」",
  },
  "FAPO": {
    subtitle: "優しさと自由奔放さを兼ね備えたタイプ",
    emoji: "😇",
    nickname: "FAPO",
    motto: "「予測不能な行動の中に、深い思いやりが宿っている」",
  },
  "FAPE": {
    subtitle: "器が大きく最も人間力が高いと言われるタイプ",
    emoji: "💝",
    nickname: "FAPE",
    motto: "「どんな人も受け入れる大きな器で、世界を包み込む」",
  },
};

// ============================================================
// True Self MBTI introspective questions
// ============================================================

export interface TrueSelfQuestion {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  axis: "EI" | "TF" | "SN";
  aLeans: string; // e.g. "E" or "I"
  bLeans: string;
}

export const trueSelfQuestions: TrueSelfQuestion[] = [
  {
    id: 1,
    question: "誰にも見られていないとき、あなたは何をしていますか？",
    optionA: "誰かに連絡したり、SNSを開いて誰かと繋がろうとする",
    optionB: "読書・音楽・思考など、一人の世界に浸ることが多い",
    axis: "EI",
    aLeans: "E",
    bLeans: "I",
  },
  {
    id: 2,
    question: "感情的な決断をした後、あなたは何を感じますか？",
    optionA: "「やっぱり論理的に考えれば良かった」と後悔することが多い",
    optionB: "「自分の気持ちに正直だった」と納得していることが多い",
    axis: "TF",
    aLeans: "T",
    bLeans: "F",
  },
  {
    id: 3,
    question: "理想の休日を思い浮かべると、どちらに近い？",
    optionA: "予定を組んで効率よく充実させたい",
    optionB: "気の向くままに過ごして、流れに身を任せたい",
    axis: "SN",
    aLeans: "S",
    bLeans: "N",
  },
];

// ============================================================
// Combined Result Readings
// Key: `${mbtiType}_${loveType}` or fallbacks
// ============================================================

export interface LuckyElements {
  color: string;
  item: string;
  day: string;
  number: number;
}

export interface StrengthItem {
  title: string;
  detail: string;
}

export interface ChallengeItem {
  title: string;
  detail: string;
}

export interface ResultReading {
  title: string;
  description: string;
  advice: string;
  tarotCard: string;
  tarotMeaning: string;
  loveReading: string;
  cosmicMessage: string;
  strengths: StrengthItem[];
  challenges: ChallengeItem[];
  luckyElements: LuckyElements;
}

export const resultReadings: Record<string, ResultReading> = {
  // ── INFJ ──────────────────────────────────────────────────
  "INFJ_FCRO": {
    title: "星詠みの詩人",
    description:
      `<span class="result-section-label">【性格の核心】</span>現実と幻想の境界線に生きるあなたは、<mark>見えない美しさを見出す天才</mark>です。INFJ特有の先見性は、まだ形にならない未来を鮮明に描き出す力を持っています。他者が気づく前に本質を掴み、静かに道筋を照らし続けます。その洞察力は時として自分自身をも驚かせるほどの鋭さを持ちます。<span class="result-section-label">【行動傾向】</span>ロマンスマジシャンの洗練された距離感と組み合わさり、あなたは<mark>絶妙な引き寄せの技</mark>で人々を動かします。近づきすぎず、離れすぎず——その均衡が場を支配します。感情の機微を読み取りながら、最適なタイミングで心の扉を開く術を知っています。<span class="result-section-label">【注意点】</span>計算した距離感が<mark>本音を遠ざける壁</mark>になることも。信頼できる人には素顔を見せる勇気を。<span class="result-section-label">【メッセージ】</span>あなたの内なる炎は、誰かを照らすためだけでなく、<mark>自分自身を温めるためにも</mark>燃え続けるべきです。あなたが存在するだけで、世界はより深く美しい場所になっています。`,
    advice: "距離感の魔法を信じながらも、時には全てを委ねてみて。本物の絆はそこから生まれます。信頼できる相手に自分の弱さを見せることは、あなたの神秘性を失わせません。むしろ、その人間的な温かさがあなたの最大の魅力になります。星詠みの力は、内なる平和から育まれるのです。",
    tarotCard: "女教皇",
    tarotMeaning: "内なる知恵と直感があなたを正しい道へ導く",
    loveReading: "INFJ×ロマンスマジシャンの組み合わせは、知性と神秘の対人スタイルを生み出します。あなたは相手の心の奥まで見通しながら、絶妙な間合いで信頼を築きます。深い関係では、その洞察力が二人の深い対話を可能にします。表面的な会話を超えた魂の交流を大切にしてください。あなたの感受性は、相手が言葉にできない感情にも寄り添う力を持っています。",
    cosmicMessage: "女教皇が示すように、内なる静寂の中に真実の答えが宿っています。急がず、焦らず、星の巡りに従って。あなたの直感はすでに答えを知っています——それを信じる勇気を持ってください。",
    strengths: [
      { title: "洞察力と先見性", detail: "表面上の言葉より本質を読み取る力に長けています。人の感情や場の空気を瞬時に把握し、それを行動に活かせるのがあなたの大きな武器です。" },
      { title: "神秘的な引力", detail: "意図せずとも周囲を引き寄せるオーラがあります。その神秘的な存在感は計算によるものではなく、あなたの内側からにじみ出る本物の魅力です。" },
      { title: "深い共感力", detail: "相手の言葉にならない感情まで感じ取ることができます。この共感の深さが、人々があなたに心を開く理由のひとつです。" },
      { title: "距離感の達人", detail: "近すぎず離れすぎない絶妙な間合いを本能的に知っています。その戦略的な距離感が、場を支配する静かな力を生み出します。" },
    ],
    challenges: [
      { title: "本音を隠しすぎ", detail: "守るために作った壁が、本当の繋がりを遠ざけることがあります。信頼できる人には、少しずつ素顔を見せる勇気を持ってみましょう。" },
      { title: "完璧主義な関係観", detail: "理想の関係を追い求めるあまり、目の前の不完全な繋がりの価値を見逃してしまうことがあります。不完全さの中にこそ、本物の絆は宿ります。" },
      { title: "自己犠牲の傾向", detail: "他者を優先するあまり、気づかないうちに自分のニーズを後回しにしています。自分を満たすことが、周りへの力をより豊かにします。" },
    ],
    luckyElements: { color: "深い藍色", item: "水晶のペンダント", day: "水曜日", number: 7 },
  },
  "INFJ_FAPE": {
    title: "深淵の守護者",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたは人の心の奥深くを見通す、<mark>稀有な感受性の持ち主</mark>です。INFJの洞察力は表面的な言葉の裏にある感情を読み取り、相手が気づいていない本質さえ映し出します。その深さゆえに、少数の人とだけ真剣に向き合い、表面的な繋がりには興味を持てません。<span class="result-section-label">【行動傾向】</span>最後の恋人タイプの大きな器が交差するとき、<mark>魂ごと捧げられる強さ</mark>がどんな場面でもあなたの行動を特別なものにします。一度決めた相手への信頼は揺るぎなく、深い絆を育みます。その誠実さと深さの組み合わせは、あなたを真のカウンセラーのような存在にします。<span class="result-section-label">【注意点】</span>しかし<mark>自分を後回しにする傾向</mark>があり、気づかないうちに深く消耗してしまうことがあります。<span class="result-section-label">【メッセージ】</span>あなたの内なる炎は、<mark>自分自身を温めるためにも</mark>燃え続けるべきです。与え続けながらも、自分自身への慈愛を忘れないでください。`,
    advice: "自分を後回しにしすぎないで。あなたが満たされてこそ、周りへの力もより豊かになります。定期的に自分だけの時間を設けて、魂を回復させることが大切です。「ノー」と言える自由を自分に与えてください。それはあなたの深さを損なうことなく、むしろ長く輝き続けるための知恵です。",
    tarotCard: "女教皇",
    tarotMeaning: "内なる知恵と直感があなたを正しい道へ導く",
    loveReading: "INFJと最後の恋人の組み合わせは、この上なく深い魂の絆を形成します。お互いの本質を理解し合える稀有なパートナーシップが期待できます。感情の深さと誠実さが重なり合い、表面的な関係では決して得られない充実感が生まれます。",
    cosmicMessage: "あなたの愛の深さは宇宙の広さに等しい。ただ、自分自身も同じくらい大切に。女教皇の静寂の中で、あなた自身の声に耳を傾ける時間を持ちましょう。",
    strengths: [
      { title: "魂の繋がりを作る力", detail: "表面的な関係では満足できず、魂レベルの深い絆を築くことを自然に求めます。その深さがあなたの最大の魅力であり、人々が忘れられない存在にします。" },
      { title: "揺るぎない誠実さ", detail: "一度決めた信念や人への忠誠は容易に揺らぎません。その一貫性が、周囲の人に深い安心感と信頼を与え続けます。" },
      { title: "深い共感と寄り添い", detail: "人の痛みや喜びを自分ごととして感じ取る力があります。言葉がなくても相手の状態を感じ取り、最適なサポートができます。" },
      { title: "長期的な関係の育成", detail: "時間をかけて関係を深めることへの忍耐力と意志があります。年月を重ねるほど輝く、本物の絆を作り出せます。" },
    ],
    challenges: [
      { title: "自己犠牲が過剰", detail: "与えることへの喜びが強い分、気づかないうちに自分の限界を超えてしまうことがあります。定期的に自分自身を満たす時間を意識的に作りましょう。" },
      { title: "距離を置く防衛反応", detail: "傷つくことへの恐れから、親密になりかけたときに無意識に距離を置いてしまうことがあります。その恐れの向こう側に、あなたが求める深い絆があります。" },
      { title: "回復に時間がかかる", detail: "深く感じる分、ダメージからの回復にも時間を要します。自分のペースを認めて、焦らず回復することを許してあげてください。" },
    ],
    luckyElements: { color: "深緑と紫", item: "月長石のブレスレット", day: "月曜日", number: 9 },
  },

  // ── INFP ──────────────────────────────────────────────────
  "INFP_FCRO": {
    title: "月影の詩人",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたの心は詩そのものです。INFPの<mark>純粋な感受性</mark>は、他の人が見過ごすような日常の細部に、深い意味と美しさを発見し続けます。夕暮れの光の角度、誰かの何気ない一言に込められた感情、古い曲が呼び起こす記憶——あなたはそういった微細なものを宝石のように拾い集めます。<span class="result-section-label">【行動傾向】</span>ロマンスマジシャンのクールな魅力と組み合わさり、<mark>神秘的な引力を放つ存在</mark>になります。あなたの繊細さとその距離感が、周囲を引きつけて放さない力を生みます。意図せずして、あなたはミステリアスなオーラを纏っています。<span class="result-section-label">【注意点】</span>理想と現実が乖離するたびに<mark>深く傷つきやすい</mark>側面があります。<span class="result-section-label">【メッセージ】</span>傷ついた心を責めないで。<mark>あなたの感受性は世界をより豊かに感じる</mark>ための贈り物です。その深さこそが、あなたを替えのきかない存在にしているのです。`,
    advice: "傷ついた心を責めないで。あなたの感受性は、世界をより豊かに感じるための贈り物です。理想が高いことは弱さではなく、あなたが人生に深い意味を求めているからです。小さな現実の美しさにも目を向けながら、その詩心を大切に育ててください。完璧でない日常の中にも、あなたが書くべき物語があります。",
    tarotCard: "月",
    tarotMeaning: "内なる世界に眠る真実が浮かび上がる",
    loveReading: "INFP×ロマンスマジシャンの行動スタイルは、詩的で神秘に満ちています。言葉にならない感情の交換が二人の世界を作り上げます。あなたは相手の言葉の奥にある感情を直感的に掴み取り、心と心の対話を大切にします。",
    cosmicMessage: "月が満ちるように、あなたの夢は必ず現実の形を取ります。その過程を大切に。月の満ち欠けのように、あなたの感情の波も自然なリズムを持っています。",
    strengths: [
      { title: "感受性と美への眼識", detail: "他の人が見過ごすような日常の細部に、深い意味と美しさを発見し続けます。その繊細な感性が、あなたの表現や行動をひと味違うものにします。" },
      { title: "言語化できない感知力", detail: "言葉にならない感情や雰囲気を直感的に掴み取ることができます。この能力が、深い人間理解と共感的なコミュニケーションを可能にします。" },
      { title: "独自の世界観", detail: "誰とも異なる視点と創造性を持っています。その独特の世界観が、あなたの存在を唯一無二のものにし、周囲に新鮮な刺激を与えます。" },
      { title: "純粋な繋がりへの意志", detail: "表面的な関係ではなく、本物の心の交流を求め続けます。その誠実さが、深く信頼される人間関係の基盤となっています。" },
    ],
    challenges: [
      { title: "理想と現実のギャップ", detail: "高い理想を持つゆえに、現実との乖離に傷つきやすい面があります。理想は目指すべき星であり、今この瞬間の不完全さも美しいと気づけると楽になります。" },
      { title: "批判の受け取り方", detail: "批判を個人的な攻撃として受け取りすぎてしまうことがあります。相手の言葉と自分の価値は別物だと少しずつ切り離す練習が助けになります。" },
      { title: "感情表現への躊躇", detail: "内側に豊かな感情を持ちながら、それを表現することをためらってしまいます。信頼できる人に少しずつ心を開くことで、関係の深さが増します。" },
    ],
    luckyElements: { color: "月白（白に近い薄い青）", item: "日記と万年筆", day: "金曜日", number: 4 },
  },
  "INFP_FAPE": {
    title: "静寂の花守り",
    description:
      `<span class="result-section-label">【性格の核心】</span>静かに、深く、誰かを支えることがあなたの本質です。INFPの<mark>内向きの情熱</mark>は外からは見えにくいけれど、その炎は誰より熱く燃え続けます。あなたの価値観は揺るぎなく、一度信じたことへの忠誠は強固です。表面的な社交性ではなく、少数の人との深い繋がりを選びます。<span class="result-section-label">【行動傾向】</span>最後の恋人タイプの大きな包容力が融合し、<mark>言葉より行動で思いを表現する</mark>あなたは、小さな気遣いに深い誠意を込めます。誰も気づかないところで誰かを支え、その満足感を密かに胸に抱きます。<span class="result-section-label">【注意点】</span>自分の気持ちを後回しにする傾向があり、<mark>気づけば静かに消耗してしまう</mark>ことがあります。<span class="result-section-label">【メッセージ】</span><mark>NOと言うことも、誠実さの一形態</mark>です。自分を守ることは、他者をより深く愛するための条件です。`,
    advice: "NOと言うことも、誠実さの一形態。自分の感情に正直であることが、本当の関係を育てます。あなたが枯れてしまっては、誰も守れません。自分の花に水をやることを忘れないで。感情を言葉にする練習を少しずつ始めてみましょう。",
    tarotCard: "隠者",
    tarotMeaning: "内省の中に、真の答えが宿る",
    loveReading: "INFPと最後の恋人の組み合わせは、互いを深く包み込む穏やかな絆を育みます。言葉より心が通じ合う関係です。静かながらも確固たる誠実さが、あなたの関係の柱となります。",
    cosmicMessage: "隠者の灯りのように、あなたの静かな誠実さは確かに誰かの道を照らしています。内側で燃え続ける情熱を、少しずつ外に向けて解放してみましょう。",
    strengths: [
      { title: "献身と誠実さ", detail: "言葉より行動で思いを示す、揺るぎない誠実さがあります。静かながら確固たるその姿勢が、周囲の人々に深い安心感を与えます。" },
      { title: "細やかな気遣い", detail: "誰も気づかないような小さなことにも心を配ります。その繊細な思いやりが、あなたとの関係を特別なものにしています。" },
      { title: "内なる価値観の強さ", detail: "外からは見えにくいけれど、揺るぎない価値観と内なる強さを持っています。その芯の強さがあなたの行動を一貫したものにしています。" },
      { title: "行動で示す愛情", detail: "言葉にしなくても、行動によって深い愛情と誠実さを示すことができます。その無言の献身が、大切な人の心に確実に届いています。" },
    ],
    challenges: [
      { title: "感情を抱え込みすぎ", detail: "内側にある感情や不満を表に出さず、ひとりで抱え込んでしまうことがあります。信頼できる人に少しずつ打ち明けることが、心の解放につながります。" },
      { title: "自己主張の難しさ", detail: "自分の意見や希望を前に出すことへの抵抗感があります。あなたの声には価値があり、それを伝えることは関係をより豊かにします。" },
      { title: "恐れからの距離", detail: "傷つくことへの恐れから、大切な人との深い関係を避けてしまうことがあります。脆さを見せることが、本物の絆の始まりです。" },
    ],
    luckyElements: { color: "淡いラベンダー", item: "押し花のしおり", day: "土曜日", number: 6 },
  },

  // ── ENFP ──────────────────────────────────────────────────
  "ENFP_LCPO": {
    title: "虹色の自由人",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたの存在は、部屋に入っただけで空気を変えます。ENFPの<mark>あふれるエネルギーと好奇心</mark>は、あなたがどこへ行っても人々を引きつけます。新しいアイデア、新しい人、新しい可能性——あなたはいつも次の冒険を探しています。その熱量は本物であり、あなたのそばにいる人々に確実に伝播します。<span class="result-section-label">【行動傾向】</span>主役体質の華やかさが合わさり、<mark>どんなステージでも自然と中心に立つ</mark>力があります。あなたのそばにいると、他の人も輝き始めます。人の可能性を信じ、その才能を引き出すことに喜びを感じます。<span class="result-section-label">【注意点】</span>熱しやすく、ときに冷めることもあるため、<mark>長期的なコミットメントに慎重さ</mark>が求められます。<span class="result-section-label">【メッセージ】</span><mark>深く踏み込むことを怖れないで</mark>。広く浅くではなく、一つのことに全力を注ぐ経験があなたを次のレベルへ導きます。`,
    advice: "深く踏み込むことを怖れないで。あなたの情熱は、根を張るほど大きな花を咲かせます。広さよりも深さを、たまには選んでみてください。一つのことに長く向き合うことで見えてくる世界が、あなたの可能性をさらに広げます。好奇心は武器ですが、一点突破の集中力がそれを最大化します。",
    tarotCard: "愚者",
    tarotMeaning: "新しい旅の始まりに、無限の可能性が宿る",
    loveReading: "ENFP×主役体質の対人スタイルは、周囲を巻き込んで世界を明るくする関係です。お互いの輝きを高め合う最高のパートナーシップ。あなたの情熱と熱量は、相手の隠れた可能性を引き出す触媒となります。",
    cosmicMessage: "愚者の軽やかな一歩が、最もすばらしい旅の始まりです。恐れずに踏み出して。愚者のカードが示すように、あなたの無邪気な好奇心こそが最大の強みです。",
    strengths: [
      { title: "場を変えるエネルギー", detail: "部屋に入っただけで空気を変えてしまうほどのエネルギーを持っています。そのポジティブな熱量が、周囲の人々を自然と引き寄せます。" },
      { title: "可能性を引き出す力", detail: "人の中に眠る可能性を誰よりも早く見つけ、それを信じて引き出すことができます。あなたのそばにいると、人は自分の力を発揮できるようになります。" },
      { title: "独創的な発想力", detail: "型にとらわれない自由な発想と創造性を持っています。その斬新なアイデアが、停滞した状況に新しい風を吹き込みます。" },
      { title: "自然なカリスマ性", detail: "計算せずとも人々を惹きつける自然なカリスマ性があります。その影響力は演技ではなく、あなたの本質的な魅力から生まれています。" },
    ],
    challenges: [
      { title: "集中力の持続", detail: "豊富なアイデアと興味の広さゆえ、一つのことに長く集中し続けることが難しいことがあります。小さな完了体験を積み重ねることが助けになります。" },
      { title: "コミットメントへの恐れ", detail: "可能性を広く持ち続けたいという欲求から、深い関わりや約束を避けてしまうことがあります。一点に深く踏み込む経験が、新しい成長をもたらします。" },
      { title: "感情先行の計画性", detail: "感情とインスピレーションが先走り、計画や実行が後回しになることがあります。熱量を持続させるための仕組み作りが、夢を現実にする鍵です。" },
    ],
    luckyElements: { color: "虹色（とくに明るいオレンジ）", item: "万華鏡", day: "日曜日", number: 3 },
  },
  "ENFP_LARE": {
    title: "光の開拓者",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたは誰にも縛られず、<mark>自分の軌道を自分で描く人</mark>です。ENFPの豊かな感性とカリスマバランサーの芯の強さが共鳴します。感情的でありながら論理的、自由でありながら責任感を持つ——その二面性があなたを稀有な存在にしています。<span class="result-section-label">【行動傾向】</span>対等なパートナーシップを求め、<mark>バランスのとれた深い関係</mark>を築きます。リーダーシップと感受性が絶妙に交差し、集団の中でも個人としても力を発揮します。<span class="result-section-label">【注意点】</span>自由を求めるあまり、誰かの好意を<mark>無意識に遠ざけてしまう</mark>ことがあります。<span class="result-section-label">【メッセージ】</span><mark>心を開くことは弱さではありません</mark>。本当の自由は、信頼できる繋がりの中でより豊かに輝きます。`,
    advice: "心を開くことは弱さではありません。信頼できる人には、あなたの内側も見せてみて。自由であることと深く繋がることは矛盾しません。あなたの感受性と論理性の両方を活かした関係が、あなたをさらに成長させます。一つの関係に深く根を張ることで、より遠くへ飛べるようになります。",
    tarotCard: "太陽",
    tarotMeaning: "あなたの輝きが、世界を照らし出す時",
    loveReading: "ENFPとカリスマバランサーの組み合わせは、互いの個性を尊重しながら高め合う理想的な関係を形成します。対等でありながらも補い合い、一緒にいることで両者がより大きな力を発揮できます。",
    cosmicMessage: "太陽のように、あなたの本来の輝きを隠さないで。真の輝きが本物の出会いを引き寄せます。今のあなたには、自分を信じる太陽の力が宿っています。",
    strengths: [
      { title: "感性と論理のバランス", detail: "感情的でありながら論理的、という稀有な二面性を持っています。この組み合わせが複雑な状況でも最適な判断を可能にします。" },
      { title: "対等な関係構築力", detail: "依存も支配も求めず、対等なパートナーシップを自然に構築できます。その姿勢が、長続きする深い関係の基盤となります。" },
      { title: "鼓舞するカリスマ性", detail: "人の可能性を信じ、それを言葉と行動で伝えることができます。あなたの鼓舞によって、自分の力に気づく人が必ずいます。" },
      { title: "開拓精神", detail: "前例のない道を切り拓くことへの恐れがありません。その開拓精神が、あなたと周囲の人々に新たな可能性を開き続けます。" },
    ],
    challenges: [
      { title: "親密さを避ける傾向", detail: "自由でいたいという欲求から、深い関わりを無意識に避けてしまうことがあります。真の自由は、信頼できる繋がりの中でより豊かになります。" },
      { title: "感情と論理の葛藤", detail: "感情と論理の両方が強いゆえに、どちらを優先するか迷う瞬間があります。どちらも本物のあなたの一部であり、両方を信頼してよいのです。" },
      { title: "ニーズの言語化", detail: "自分が何を必要としているかを言葉にすることが苦手なことがあります。感情を表現する練習が、より深い相互理解へとつながります。" },
    ],
    luckyElements: { color: "明るいゴールド", item: "コンパス", day: "火曜日", number: 1 },
  },

  // ── INTJ ──────────────────────────────────────────────────
  "INTJ_LARO": {
    title: "暗夜の戦略家",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたは一人でも完結できる、<mark>強靭な内側の世界</mark>を持っています。INTJの冷徹なビジョンは、感情に揺れる周囲が見えていないものを遠く先まで見通す力があります。長期的な視野と完璧主義的な実行力は、あなたを最も信頼できる存在の一人にします。<span class="result-section-label">【行動傾向】</span>憧れの先輩タイプの包容力と結びつき、<mark>深い信頼を基盤にした関係</mark>を築きます。言葉は少なくても、行動でその信念の深さを示します。少数精鋭の関係を選び、その関係を深く丁寧に育てます。<span class="result-section-label">【注意点】</span>完璧主義が人間関係にも適用されてしまい、<mark>相手に過度な基準を求める</mark>ことがあります。<span class="result-section-label">【メッセージ】</span><mark>脆さを許すことが、真の強さ</mark>です。完璧な計画より、不完全な繋がりの方が人生をより豊かにすることがあります。`,
    advice: "完璧な計画より、不完全な繋がりの方が人生を豊かにすることも。脆さを許してみて。あなたの強さは疑いようがありません——今必要なのは、その強さの鎧の一部を外す勇気です。弱さを見せることができる人だけが、本物の信頼を勝ち取れます。戦略の外側にある、感情的な繋がりの価値を体験してみてください。",
    tarotCard: "皇帝",
    tarotMeaning: "内なる秩序と意志の力で、運命を切り拓く",
    loveReading: "INTJと憧れの先輩の組み合わせは、知性と包容力が融合した、静かだが非常に深い絆を育みます。感情を表に出さなくても、その存在感と行動力が相手に深い安心感を与えます。",
    cosmicMessage: "皇帝の意志の力は素晴らしい。ただ、心の扉をほんの少し開けることで、より豊かな世界が待っています。あなたのビジョンは正しい——あとは信頼を育てる忍耐力です。",
    strengths: [
      { title: "戦略的ビジョン", detail: "他の人が見えていない先まで見通す長期的なビジョンを持っています。その戦略的思考が、困難な状況でも最善の道を見つける力になります。" },
      { title: "完璧な実行力", detail: "計画を立て、それを緻密に実行する能力は群を抜いています。完璧主義的な徹底さが、あなたの成果物を際立って高品質なものにします。" },
      { title: "深い関係への忠誠心", detail: "少数の人との深い関係を大切にし、その関係への忠誠は揺るぎません。信頼を得た相手には、あなたのすべてを惜しみなく注ぎます。" },
      { title: "冷静な判断力", detail: "感情に左右されず、状況を客観的に分析して判断できます。その冷静さが、混乱した状況でもブレない軸となっています。" },
    ],
    challenges: [
      { title: "感情表現の難しさ", detail: "内側には深い感情があるのに、それを表現することが苦手で誤解を生むことがあります。小さな感情表現の練習が、人間関係を豊かにします。" },
      { title: "完璧主義の対人影響", detail: "自分への高い基準が無意識のうちに相手にも適用され、関係に緊張を生むことがあります。不完全さを受け入れる柔軟性が、絆をより強くします。" },
      { title: "変化への適応速度", detail: "計画や予定外の変化に適応するのに時間がかかることがあります。変化を脅威ではなく新しい可能性として捉える視点が助けになります。" },
    ],
    luckyElements: { color: "深い群青", item: "羅針盤", day: "木曜日", number: 8 },
  },
  "INTJ_FCRE": {
    title: "深淵の設計士",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたは長期的なビジョンを描き、<mark>それを緻密に実行する力</mark>を持っています。INTJの分析力は、複雑な問題を整理し、最も効率的な解決策を導き出します。その鋭さは時に周囲を驚かせますが、あなた自身はいつも謙虚にデータと向き合っています。<span class="result-section-label">【行動傾向】</span>ちゃっかりうさぎの愛嬌と直感が加わり、<mark>クールな頭脳と温かい感情</mark>が見事に共存します。相手を見極める目が鋭く、本物だと感じた信頼への忠誠は揺るぎません。その愛嬌は武器であり、あなたの本質的な鋭さを柔らかく包んでいます。<span class="result-section-label">【注意点】</span>分析しすぎて<mark>タイミングを逃す</mark>ことがあります。<span class="result-section-label">【メッセージ】</span><mark>ときには直感を信じて一歩踏み出して</mark>。すべてのデータが揃う瞬間は来ないかもしれません。`,
    advice: "分析しすぎて機会を逃すことも。ときには直感を信じて、一歩踏み出してみて。完璧な情報はありません——ある時点での最善策を選ぶ勇気を持ってください。あなたの直感は実は非常に洗練されています。論理が答えを出せないとき、その声に耳を傾けてみましょう。",
    tarotCard: "世界",
    tarotMeaning: "完成と達成、新たなサイクルの幕開け",
    loveReading: "INTJとちゃっかりうさぎの組み合わせは、知性と愛嬌が絶妙に絡み合うユニークな行動スタイルを生みます。クールな外見とは裏腹に、信頼できる相手への深い献身があります。",
    cosmicMessage: "世界のカードが示すように、あなたの人生の完成形はすでに描かれています。信じて進んで。一つの章が終わるとき、次の扉がすでに開いています。",
    strengths: [
      { title: "精密な分析力", detail: "複雑な問題を整理し、最も効率的な解決策を導き出す分析力があります。その精密さが、あなたの判断を信頼できるものにしています。" },
      { title: "長期的な計画実行力", detail: "目標を設定し、それに向けて緻密に実行し続ける力があります。長期的な視野と実行力の組み合わせが、大きな成果を生み出します。" },
      { title: "愛嬌と知性の共存", detail: "クールな知性と親しみやすい愛嬌が絶妙に共存しています。この二面性が、多様な人々との関係構築を可能にしています。" },
      { title: "本物への揺るぎない忠誠", detail: "信頼できると判断した相手への忠誠は、時間が経っても揺らぎません。その一貫性が、あなたを最も信頼できる存在にしています。" },
    ],
    challenges: [
      { title: "分析過多のタイミング", detail: "完璧な情報を求めて分析しすぎるあまり、最適なタイミングを逃してしまうことがあります。ある段階での決断を信頼する練習が助けになります。" },
      { title: "感情の言語化抵抗", detail: "感情を言葉にすることへの抵抗感があります。感情を分析データのように扱うのではなく、そのまま受け入れて表現することが関係を深めます。" },
      { title: "完璧主義と休息", detail: "高い基準を追い求めるあまり、十分な休息を取ることを後回しにしてしまいます。休息もパフォーマンスの一部だと捉えることが重要です。" },
    ],
    luckyElements: { color: "鋼青色", item: "設計図と万年筆", day: "水曜日", number: 11 },
  },

  // ── ENFJ ──────────────────────────────────────────────────
  "ENFJ_LAPE": {
    title: "魂の案内人",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたが笑うと、周りの人たちも自然と顔がほころびます。ENFJの<mark>カリスマ的な共感力</mark>は、人の心の奥底にある可能性を引き出す天賦の才能です。あなたが部屋に入ると、その空間の温度が上がります——それはあなたが持つ、生まれながらのリーダーとしての輝きです。<span class="result-section-label">【行動傾向】</span>キャプテンライオンの優しさと強さが融合し、あなたはいつも<mark>誰かのために全力を注ぐ</mark>存在です。仲間の成長を自分のことのように喜べる、稀有なリーダーです。人を鼓舞することが自然にできるあなたは、組織やコミュニティの中心的な存在になります。<span class="result-section-label">【注意点】</span>人を導き支えることに喜びを見出す一方で、<mark>自分が甘えたいと思う瞬間</mark>も確かにあります。<span class="result-section-label">【メッセージ】</span><mark>あなたが受け取ることも、人に喜びを与える</mark>ことです。`,
    advice: "あなたが受け取ることも、人に喜びを与えることです。愛を循環させることを学んで。リーダーにも、甘えられる場所が必要です。すべてを抱え込まず、信頼できる人に支えを求めることは、あなたの強さをより持続させます。あなたが大切にしている人たちは、あなたのことも大切にしたいと思っています。",
    tarotCard: "女帝",
    tarotMeaning: "豊かさと愛が、あなたを通じて溢れ出す",
    loveReading: "ENFJとキャプテンライオンの組み合わせは、人を導く力と深い献身が融合した、圧倒的な存在感を放つ関係です。あなたがいるだけで、相手は自分の可能性を信じられるようになります。",
    cosmicMessage: "女帝の豊かさを受け取る準備を。あなたが満たされることで、周りへの力はさらに輝きます。大地のように安定し、豊かに実るあなたの愛は、必ず戻ってきます。",
    strengths: [
      { title: "可能性を引き出すカリスマ", detail: "人の中に眠る可能性を見抜き、それを引き出すカリスマ的な力があります。あなたの鼓舞と共感が、多くの人の成長を後押ししています。" },
      { title: "深い共感と感情知性", detail: "相手の感情を深く理解し、適切に応じる感情的知性が高いです。その共感力がコミュニティの中心的な存在にあなたをします。" },
      { title: "集団をまとめる力", detail: "組織やコミュニティの中で自然と中心的な役割を担い、まとめる力があります。その指導力は強制ではなく、信頼と温かさに基づいています。" },
      { title: "誠実さと温かさの放射", detail: "意図せずとも誠実さと温かさが周囲に伝わります。その自然な人間的魅力が、人々をあなたのもとに引き寄せます。" },
    ],
    challenges: [
      { title: "自己ニーズを後回しに", detail: "他者のために尽くすことへの喜びが強く、自分のニーズを後回しにしてしまいます。自分を満たすことが、周りへの力をより豊かにします。" },
      { title: "承認欲求の波", detail: "自分が正しくできているかを気にしすぎる瞬間があります。あなたの価値は他者の評価に依存しない——その確信が自由をもたらします。" },
      { title: "傷ついても強がる", detail: "リーダーとして強くあろうとするあまり、傷ついていても表に出さないことがあります。弱さを見せられる安全な場所を持つことが大切です。" },
    ],
    luckyElements: { color: "温かいゴールデンオレンジ", item: "金のブレスレット", day: "日曜日", number: 2 },
  },

  // ── ISTJ ──────────────────────────────────────────────────
  "ISTJ_LARO": {
    title: "礎の守護者",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたの信頼性は、砂漠の中の水源のようです。ISTJの<mark>揺るぎない誠実さ</mark>は、周囲の人たちに深い安心感を与え続けます。約束は必ず守り、一度引き受けたことはやり遂げる——その姿勢が、あなたへの信頼を年月と共に積み上げていきます。<span class="result-section-label">【行動傾向】</span>憧れの先輩タイプの包容力が重なり、<mark>一度決めた約束は命がけで守る</mark>という覚悟を持っています。集団の中で深く信頼される存在になります。あなたの一貫性と責任感は、周囲が困難な時ほど輝きを増します。<span class="result-section-label">【注意点】</span>変化への抵抗が強く、<mark>新しい関係性のパターンに戸惑う</mark>ことがあります。<span class="result-section-label">【メッセージ】</span><mark>変化を恐れず、新しい扉を少しだけ開けて</mark>みて。あなたの誠実さは、どんな新しい環境でも必ず通用します。`,
    advice: "変化を恐れず、新しい扉を少しだけ開けてみて。伝統の中にも、進化の芽は宿っています。あなたのルーティンは力ですが、時に柔軟性を加えることで、より多くの可能性が開きます。小さな変化から始めてみましょう。あなたの誠実さは、どんな状況でも最大の武器です。",
    tarotCard: "力",
    tarotMeaning: "内なる静けさと意志が、どんな困難も乗り越える",
    loveReading: "ISTJと憧れの先輩の組み合わせは、揺るぎない信頼と包容力が重なる、岩のように堅固な絆を生み出します。言葉より行動で愛を示し、その継続的な誠実さが相手に深い安心感を与えます。",
    cosmicMessage: "力のカードが示す内なる強さが、あなたの最大の武器です。その誠実さで必ず本物の絆を結べます。静かな意志の力は、どんな嵐にも揺らぎません。",
    strengths: [
      { title: "岩盤の信頼性", detail: "約束を必ず守り、一貫した誠実さで周囲の信頼を積み上げています。その信頼性は年月と共に深まり、あなたをかけがえない存在にします。" },
      { title: "完遂する意志力", detail: "一度引き受けたことは最後まで完遂する強い意志があります。その責任感と実行力が、あなたへの信頼の核となっています。" },
      { title: "安定した環境創出力", detail: "周囲に安心感と安定をもたらす環境を自然に作り出します。その安定性が、多くの人があなたのそばにいたいと思う理由のひとつです。" },
      { title: "細部への注意力", detail: "他の人が見落としがちな細部にも注意を払い、正確さを維持します。その精密さが、あなたの仕事や関係の品質を際立たせます。" },
    ],
    challenges: [
      { title: "変化への適応速度", detail: "慣れ親しんだ環境やルーティンへの安心感が強く、変化に適応するのに時間がかかることがあります。小さな変化から試してみることが助けになります。" },
      { title: "感情表現の少なさ", detail: "内側に豊かな感情があっても、それを表現することが少ないため誤解を生むことがあります。感情を少しずつ言葉にする練習が関係を深めます。" },
      { title: "完璧主義の自己追込み", detail: "高い基準を自分に課すあまり、十分にできていても「まだ足りない」と感じてしまいます。今の自分を認める「十分さ」の感覚を育てていきましょう。" },
    ],
    luckyElements: { color: "深いネイビー", item: "革製の手帳", day: "木曜日", number: 5 },
  },

  // ── ISFP ──────────────────────────────────────────────────
  "ISFP_FAPO": {
    title: "刹那の芸術家",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたは今この瞬間の美しさを、<mark>誰よりも鮮明に感じることができる</mark>存在です。ISFPの豊かな感性は普通の日常を非日常の芸術に変えます。風の音、光の色、誰かの笑顔の瞬間——それらすべてがあなたにとって生きた芸術作品です。<span class="result-section-label">【行動傾向】</span>デビル天使の優しさと自由奔放さが共鳴し、<mark>予測不能で刺激的な動き</mark>があなたを唯一無二の存在にします。自由に動きながらも、深いところで人と繋がる力があります。あなたの行動には常に本物の温かさが宿っています。<span class="result-section-label">【注意点】</span>深く感じるぶん、<mark>失ったときの痛みも大きい</mark>です。<span class="result-section-label">【メッセージ】</span><mark>あなたの美しさは、その傷も含めて完成している</mark>のです。傷は弱さではなく、深く生きた証明です。`,
    advice: "過去の傷を抱えながらでも、前を向くことができます。あなたの美しさは、その傷も含めて完成しています。感情を芸術として表現することを恐れないで。あなたが感じるすべての感情には意味があり、それを表現することで誰かの心を動かすことができます。今この瞬間に集中することがあなたの最大の才能です。",
    tarotCard: "恋人",
    tarotMeaning: "心の選択が、運命を形作る",
    loveReading: "ISFPとデビル天使の組み合わせは、自由と誠実さが共存する芸術的な行動スタイルを描きます。縛らず縛られず、でも深く繋がる関係。あなたとの時間は、相手にとって忘れられない体験になります。",
    cosmicMessage: "恋人のカードが示すように、心からの選択が最も美しい結果をもたらします。直感を信じて。あなたの心が「yes」と言うとき、それが最も純粋な真実です。",
    strengths: [
      { title: "現在への感受性", detail: "今この瞬間の美しさを誰よりも鮮明に感じ取ることができます。その鋭い感受性が、日常を芸術に変えるあなたの最大の才能です。" },
      { title: "自由と誠実さの両立", detail: "束縛を嫌いながらも、大切な人への誠実さは揺るぎません。自由と誠実さを共存させる稀有な能力がります。" },
      { title: "芸術的センスと表現力", detail: "内側に豊かな美的センスを持ち、それを独自の方法で表現します。あなたの表現は見る人の心に直接届く、本物の力を持っています。" },
      { title: "予測不能な独自の魅力", detail: "型にはまらない行動と独自性が、唯一無二の存在感を作り出します。その予測不能な魅力が、人々をあなたから目が離せなくします。" },
    ],
    challenges: [
      { title: "傷への恐れからの回避", detail: "深く感じるゆえに、傷つくことへの恐れから関係を避けてしまうことがあります。その傷の先にこそ、あなたが求める深い繋がりがあります。" },
      { title: "長期コミットメント感", detail: "自由でいたいという本質的な欲求から、長期的な約束や関わりへの抵抗感が生まれることがあります。深さと自由は共存できると知ることが解放をもたらします。" },
      { title: "感情の波の大きさ", detail: "感受性の高さゆえに、感情の波が大きくなることがあります。その波を泳ぐ方法として、感情を表現するアウトレットを持つことが安定をもたらします。" },
    ],
    luckyElements: { color: "テラコッタとターコイズ", item: "スケッチブック", day: "金曜日", number: 3 },
  },

  // ── ESTP ──────────────────────────────────────────────────
  "ESTP_LCRO": {
    title: "炎の先駆者",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたはルールより直感、計画より行動を選ぶ、<mark>生粋の自由人</mark>です。ESTPのエネルギーは周囲を巻き込む爆発力を持ちます。現場で判断し、即座に行動する——その決断力と実行力は、あなたを真の意味でのリーダーたらしめます。<span class="result-section-label">【行動傾向】</span>ボス猫タイプの自分ペースが合わさり、<mark>常に主導権を持って動く</mark>ことを好みます。マイペースな同士が引き合う独特のダイナミクスが生まれます。あなたは本能的に場の空気を読み、最適な行動を瞬時に選択します。<span class="result-section-label">【注意点】</span>飽きるのが早く束縛を嫌うあなたですが、<mark>深い信頼を築くには時間と継続が必要</mark>です。<span class="result-section-label">【メッセージ】</span>本当に心を許した人にだけ見せる<mark>無防備な笑顔</mark>がある。その瞬間こそ、あなたの最も美しい姿です。`,
    advice: "スピードを緩める瞬間を作って。人生で最も大切なものは、立ち止まったときにしか見えないこともあります。行動力はあなたの最大の武器ですが、立ち止まって深呼吸する習慣が、さらなる高みへ導きます。信頼できる人に心を許す経験が、あなたの人生をより豊かにします。",
    tarotCard: "戦車",
    tarotMeaning: "意志と行動力が、勝利を引き寄せる",
    loveReading: "ESTPとボス猫の組み合わせは、二人ともマイペースな強者同士の独特のダイナミクスを生みます。お互いの強さを認め合うからこそ、深い絆が生まれます。対等で自由な関係の中に、確かな信頼が育まれます。",
    cosmicMessage: "戦車の勢いは素晴らしい。ただ、時には手綱を緩めることで、より豊かな景色が見えてきます。勝利は目の前だけにあるのではなく、横道にも隠れています。",
    strengths: [
      { title: "瞬時の判断と実行力", detail: "状況を瞬時に把握して即座に行動する判断力と実行力があります。その迅速さが、チャンスを誰よりも早く掴む力となっています。" },
      { title: "主導権を握る力", detail: "どんな場でも自然と主導権を握り、流れを作り出すことができます。その本能的なリーダーシップが、周囲を動かす力を持っています。" },
      { title: "現場の問題解決力", detail: "理論より実践を重視し、現場で即座に問題を解決する能力があります。その実際的なアプローチが、具体的な成果を生み出します。" },
      { title: "本能的な空気読み", detail: "場の空気を本能的に読み取り、最適なタイミングで最適な行動を選択します。その直感的な状況判断が、あなたの行動を際立たせます。" },
    ],
    challenges: [
      { title: "持続力の課題", detail: "初動の爆発力は誰にも負けない反面、時間の経過とともに興味が薄れることがあります。継続するための仕組みや仲間を持つことが助けになります。" },
      { title: "感情的深さへの距離", detail: "深い感情表現や内省的な会話を避けてしまうことがあります。感情的な深さを探求することが、あなたの人間関係をより豊かにします。" },
      { title: "束縛感への反応", detail: "義務感や束縛を強く感じると反発してしまうことがあります。約束や責任を自分の意志で選んだものとして捉え直すことが自由をもたらします。" },
    ],
    luckyElements: { color: "炎のオレンジ", item: "赤い腕時計", day: "火曜日", number: 1 },
  },

  // ── ESFJ ──────────────────────────────────────────────────
  "ESFJ_FCPE": {
    title: "陽だまりの守り人",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたの周りには、いつも<mark>温かい空気が漂っています</mark>。ESFJの社交性は、どんな場でも自然に人と人をつなぎます。誰が傷ついているか、誰が必要とされていないと感じているか——そういったことをあなたは本能的に感じ取ります。<span class="result-section-label">【行動傾向】</span>忠犬ハチ公タイプの誠実さと組み合わさり、<mark>人間関係を何より大切にする</mark>あなたは、一途で真っ直ぐな行動で周囲の信頼を勝ち取ります。その温かさと誠実さの組み合わせは、あなたをコミュニティにとって欠かせない存在にします。<span class="result-section-label">【注意点】</span>与えることに慣れすぎて、<mark>受け取ることが苦手</mark>になっていませんか？<span class="result-section-label">【メッセージ】</span><mark>あなた自身も誰かに守られる価値がある</mark>ことを忘れずに。太陽も、時には曇りの日が必要です。`,
    advice: "与えるばかりでなく、受け取る勇気も必要です。誰かを頼ることは、関係をより深めます。助けを求めることは、あなたの弱さではなく、その関係への信頼の証明です。あなたが困っているとき、手を差し伸べたいと思っている人が必ずいます。その人に声をかけてみてください。",
    tarotCard: "正義",
    tarotMeaning: "真心を尽くした行いは、必ず報われる",
    loveReading: "ESFJと忠犬ハチ公の組み合わせは、誠実さと思いやりが二重に重なる、深い信頼関係を育みます。あなたの一途さと温かさは、相手に安心と幸福感をもたらします。",
    cosmicMessage: "正義のカードが示すように、あなたの誠実さは必ず相手の心に届きます。信じ続けて。真の誠実さは宇宙のバランスを保つ力を持ちます——あなたの温かさは必ず循環します。",
    strengths: [
      { title: "温かさで場を和ませる力", detail: "あなたがいるだけで場の空気が温かくなります。その自然な社交性と温かさが、どんな環境でも人々を安心させます。" },
      { title: "人と人を繋ぐ才能", detail: "誰が誰と相性が良いかを本能的に感じ取り、自然な形で人々を繋げることができます。そのコネクター的な才能がコミュニティを豊かにします。" },
      { title: "誠実な関係への献身", detail: "一度大切にしようと決めた人への献身は、時間が経っても変わりません。その一途な誠実さが、深い信頼関係の基盤となっています。" },
      { title: "ニーズを感じ取る力", detail: "誰がどんなサポートを必要としているかを本能的に感じ取ります。その敏感さが、あなたを周囲にとって欠かせない存在にしています。" },
    ],
    challenges: [
      { title: "他者評価への敏感さ", detail: "自分がどう見られているかを気にしすぎることがあります。他者の評価はあなたの価値の一部に過ぎず、本質的な自分への信頼を育てることが大切です。" },
      { title: "断ることへの罪悪感", detail: "断ることへの罪悪感が強く、自分の限界を超えてしまうことがあります。断ることは拒絶ではなく、自己の誠実な表現だと捉えてみましょう。" },
      { title: "自分のニーズを伝える遠慮", detail: "自分が何を必要としているかを表現することに遠慮してしまいます。あなたのニーズは大切であり、それを伝えることが関係をより対等にします。" },
    ],
    luckyElements: { color: "暖かいローズゴールド", item: "マグカップ（誰かへのプレゼント）", day: "土曜日", number: 6 },
  },

  // ── INTP ──────────────────────────────────────────────────
  "INTP_FCRO": {
    title: "迷宮の哲学者",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたの頭の中には、<mark>果てしない知の迷宮</mark>が広がっています。INTPの思考は終わることなく走り続け、「なぜ？」という問いがすべての行動の起点です。表面では静かに見えても、内側では宇宙を再構築するような思索が止まることなく続いています。<span class="result-section-label">【行動傾向】</span>ロマンスマジシャンの距離感の達人としての側面が重なり、<mark>親密になりすぎない絶妙な間合い</mark>を保ちます。知的な刺激を与えてくれる相手には深い関心を示し、退屈さを感じると自然と距離を置きます。<span class="result-section-label">【注意点】</span>論理で感情を処理しようとしすぎて、<mark>大切な人の感情的なニーズを見落とす</mark>ことがあります。<span class="result-section-label">【メッセージ】</span>すべてに答えを出す必要はありません。<mark>答えのない問いを誰かと共に抱える</mark>こともまた、深い絆の形です。`,
    advice: "思考の迷宮に入り込みすぎたら、誰かの声に耳を傾けてみて。知的な分析だけでは解けない答えが、感情の中にあることもあります。今日一つ、自分の感情を言葉にして誰かに伝えてみましょう。論理が導けない場所へ、感情が連れて行ってくれます。",
    tarotCard: "魔術師",
    tarotMeaning: "秘められた能力が目覚め、新しい可能性が開く",
    loveReading: "INTPとロマンスマジシャンの組み合わせは、知的探求と場の読みが絶妙に融合した神秘的な存在感を生みます。相手の知性を試しながらも、本物だと感じた瞬間には深い忠誠を示します。",
    cosmicMessage: "魔術師のカードが示すように、あなたの中には使い切れていない才能が眠っています。今こそその力を外に向けて解放する時です。",
    strengths: [
      { title: "深い論理的洞察力", detail: "複雑な問題を分解し、本質を見抜く論理的洞察力があります。その鋭い思考が、他の人が見えない答えを見つけ出します。" },
      { title: "知的独立心", detail: "他者の意見に流されず、自分自身で徹底的に考え抜く独立心があります。その自律的な思考が、オリジナルなアイデアを生み出します。" },
      { title: "概念化の才能", detail: "複雑な概念を明快に整理し、体系化する才能があります。その能力が、難しいテーマをわかりやすく伝えることを可能にします。" },
      { title: "客観的な視点", detail: "感情に左右されず、物事を客観的に分析できます。その冷静な視点が、偏りのない判断を可能にします。" },
    ],
    challenges: [
      { title: "感情的ニーズへの不感", detail: "論理を優先するあまり、相手の感情的なニーズを見落とすことがあります。感情も情報として捉える視点を持つことが助けになります。" },
      { title: "完成への執着", detail: "完璧なアイデアが固まるまで行動を先送りにしてしまいます。「良い計画を今すぐ実行」が「完璧な計画をいつか実行」に勝ります。" },
      { title: "社交的疲労", detail: "長時間の社交的な場に疲れを感じやすいです。自分にとって必要なリチャージの時間を意識的に確保することが大切です。" },
    ],
    luckyElements: { color: "アイスブルー", item: "哲学書と良質なコーヒー", day: "水曜日", number: 11 },
  },

  // ── ENTP ──────────────────────────────────────────────────
  "ENTP_LAPO": {
    title: "カオスの触媒",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたは<mark>あらゆる枠組みを疑い、突き破ることに喜びを感じる</mark>存在です。ENTPの討論好きな知性は、会話を格上げし、相手の思考を刺激せずにはいられません。退屈は最大の敵であり、常に新しい刺激と可能性を求めて動き続けます。<span class="result-section-label">【行動傾向】</span>パーフェクトカメレオンの適応力が加わり、<mark>どんな場でも自分のペースに周囲を引き込む</mark>カオスの才能があります。変化を恐れないどころか、変化そのものをエネルギー源にしています。<span class="result-section-label">【注意点】</span>議論のための議論が過ぎると、<mark>相手を傷つけてしまう</mark>ことがあります。<span class="result-section-label">【メッセージ】</span>知的な強さを持つあなたへ——<mark>相手の感情も尊重することで、真の知性が完成</mark>します。`,
    advice: "論破よりも対話を。相手の感情を受け止めることが、最も知的な選択です。あなたのアイデアは素晴らしい——それを相手の心に届けるには、共感という橋が必要です。議論の勝ちより、関係の深さを選ぶ場面を意識的に作ってみましょう。",
    tarotCard: "愚者",
    tarotMeaning: "無限の可能性を抱えた、新しい冒険の始まり",
    loveReading: "ENTPとパーフェクトカメレオンの組み合わせは、知的な刺激と柔軟な適応力が融合した、飽きることのないダイナミックな関係を生み出します。相手の思考を刺激しながらも、その場に必要な姿に変化する能力を持ちます。",
    cosmicMessage: "愚者の自由な精神が、次の偉大な発見へとあなたを導きます。思い切って踏み出して。既存の答えに満足しないあなたこそ、新時代を切り拓く力を持っています。",
    strengths: [
      { title: "思考の速度と柔軟性", detail: "素早く多角的に思考を展開する能力があります。その知的な柔軟性が、複雑な問題を短時間で解決することを可能にします。" },
      { title: "既成概念への挑戦力", detail: "当たり前とされていることを疑い、より良い方法を探し続けます。その挑戦的な姿勢が、革新的なアイデアを生み出します。" },
      { title: "適応する知性", detail: "異なる環境や状況に知性的に適応する能力があります。その柔軟性が、多様な場面での成功を可能にします。" },
      { title: "議論を通じた深化力", detail: "対話と議論を通じて問題を深く掘り下げ、より良い答えに近づく力があります。その対話スキルが、周囲の思考を刺激します。" },
    ],
    challenges: [
      { title: "感情的配慮の欠如", detail: "論理と知的刺激を優先するあまり、相手の感情的な側面を見落とすことがあります。感情は論理と同じくらい重要な情報源です。" },
      { title: "継続力の課題", detail: "新しいことへの興味が尽きず、一つのことに長期間集中することが難しいです。完了する習慣を意識的に作ることが助けになります。" },
      { title: "相手への過剰な期待", detail: "自分と同レベルの知的応答を相手に期待しすぎることがあります。異なる強みを持つ人との協力が、より大きな成果を生みます。" },
    ],
    luckyElements: { color: "エレクトリックブルー", item: "ホワイトボードとマーカー", day: "火曜日", number: 5 },
  },

  // ── ISFJ ──────────────────────────────────────────────────
  "ISFJ_FARE": {
    title: "縁の下の月明かり",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたは誰も見ていないところで、<mark>誰かのために光を灯し続ける</mark>存在です。ISFJの深い思いやりは、静かながら確実に周囲の人々の生活を豊かにしています。献身的であることへの喜びを感じながらも、それが当然であるかのように振る舞わない謙虚さがあります。<span class="result-section-label">【行動傾向】</span>敏腕マネージャータイプの俯瞰力が加わり、<mark>全体を見渡しながら最適なサポートを届ける</mark>力があります。誰が何を必要としているかを本能的に察知し、最適なタイミングで動きます。<span class="result-section-label">【注意点】</span>縁の下に徹しすぎて、<mark>自分の功績が見えにくくなる</mark>ことがあります。<span class="result-section-label">【メッセージ】</span><mark>あなた自身の価値を、あなた自身が認めてあげてください</mark>。月の光は太陽がなければ生まれませんが、なければ夜は真の暗闇です。`,
    advice: "あなたの貢献を誰かに伝える練習をしてみて。謙虚さは美徳ですが、自己評価の低さは美徳ではありません。今週、あなたが誰かのためにしていることを、一つだけ声に出してみましょう。あなたの価値は、あなた自身が一番最初に認めるべきです。",
    tarotCard: "女教皇",
    tarotMeaning: "内なる叡智と静かな強さが道を照らす",
    loveReading: "ISFJと敏腕マネージャーの組み合わせは、細やかなサポートと全体を見渡す俯瞰力が融合した、頼れる縁の下のパートナーを形成します。言葉は少なくても、行動でその深い愛情を示し続けます。",
    cosmicMessage: "女教皇の静かな叡智があなたを守っています。あなたの誠実さは宇宙に刻まれています。縁の下で輝くあなたの光は、気づかれないように見えても、確実に誰かの心を温めています。",
    strengths: [
      { title: "細やかな観察力と察知力", detail: "誰が何を必要としているかを本能的に察知する観察力があります。その繊細な感知力が、最適なタイミングでのサポートを可能にします。" },
      { title: "変わらぬ誠実さと責任感", detail: "一度引き受けたことへの責任感は強く、どんな状況でも誠実に向き合います。その一貫性が、深い信頼を積み上げていきます。" },
      { title: "記憶の豊かさと配慮", detail: "大切な人のことをよく覚えており、その情報を思いやりのある形で活かします。その細やかな気遣いが、あなたとの関係を特別なものにしています。" },
      { title: "全体最適を見渡す力", detail: "集団の中でどこに何が必要かを俯瞰して見極める力があります。その全体視が、組織やコミュニティの中での縁の下の力持ちとしての役割を生みます。" },
    ],
    challenges: [
      { title: "自己評価の低さ", detail: "自分の貢献を過小評価し、他者の評価を待ちがちです。あなたの価値はあなた自身が最初に認める必要があります。" },
      { title: "断ることの難しさ", detail: "人のニーズを優先するあまり、自分の限界を超えた要求にも応えようとしてしまいます。「ノー」を言うことも、誠実さの一形態です。" },
      { title: "変化への抵抗感", detail: "慣れ親しんだパターンへの安心感が強く、新しい環境や変化に適応するのに時間がかかります。変化を小さなステップに分けて試みることが助けになります。" },
    ],
    luckyElements: { color: "穏やかなクリーム", item: "手作りのお菓子セット", day: "木曜日", number: 4 },
  },

  // ── ESTJ ──────────────────────────────────────────────────
  "ESTJ_LARE": {
    title: "黄金の礎石",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたは<mark>確固たる秩序と誠実さで世界を支える</mark>柱のような存在です。ESTJの実行力は、計画を現実に変える驚異的な力を持っています。「こうあるべき」という明確な基準を持ち、それに従って行動し続けるあなたは、周囲にとって最も信頼できる存在のひとつです。<span class="result-section-label">【行動傾向】</span>カリスマバランサーの対立を調和させる力が加わり、<mark>集団全体が動ける状態を作り出すリーダー</mark>として輝きます。秩序と柔軟性の両方を兼ね備えた、稀有な実行者です。<span class="result-section-label">【注意点】</span>「こうすべき」という基準が強すぎて、<mark>他者の異なるアプローチを認めにくく</mark>なることがあります。<span class="result-section-label">【メッセージ】</span>あなたの秩序は美しい——<mark>その中に少しだけ遊びの余白を作る</mark>ことで、さらに豊かな結果が生まれます。`,
    advice: "計画の中に、少しだけ「即興」の余白を作ってみて。想定外の出来事が、最高の結果をもたらすことがあります。あなたのルールは世界を良くするための道具であり、目的そのものではありません。時に柔軟に変化させることで、より多くの人があなたのビジョンに共鳴します。",
    tarotCard: "皇帝",
    tarotMeaning: "強固な意志と秩序が、確かな未来を築く",
    loveReading: "ESTJとカリスマバランサーの組み合わせは、秩序と調和を同時に体現する力強いリーダーシップを生み出します。明確なビジョンと人心掌握力が融合し、あなたの周囲に安心感と活力をもたらします。",
    cosmicMessage: "皇帝の強さが今週のあなたを後押ししています。ルールを作る側として、思いやりを忘れずに。確固たる意志と柔らかな心の両方を持つとき、あなたは最高の結果を生み出します。",
    strengths: [
      { title: "圧倒的な実行力", detail: "計画を現実に変える実行力は群を抜いています。決めたことを必ずやり遂げる姿勢が、周囲からの信頼の核となっています。" },
      { title: "秩序を作り出す組織力", detail: "混乱した状況にも明確な秩序を作り出す組織力があります。その構造化の能力が、集団の効率と成果を大幅に高めます。" },
      { title: "調和を生むリーダーシップ", detail: "対立する意見を調整しながら全体が動ける状態を作るリーダーシップがあります。その公正なアプローチが、多様なメンバーを束ねます。" },
      { title: "信頼される安定感", detail: "何があっても揺らがない誠実さと安定感があります。その一貫した態度が、長期的な深い信頼を生み出します。" },
    ],
    challenges: [
      { title: "異なるアプローチへの許容度", detail: "自分のやり方への確信が強く、異なるアプローチを認めにくいことがあります。多様な方法論が同じ目標に到達できると理解することが、組織を豊かにします。" },
      { title: "感情への処理スペース", detail: "効率と実行を優先するあまり、感情を処理する時間を後回しにしがちです。定期的に自分の内側を確認する時間が、長期的な安定をもたらします。" },
      { title: "完璧主義からの解放", detail: "高い基準が自分や周囲へのプレッシャーになることがあります。「十分に良い」を認める柔軟さが、持続可能な成果につながります。" },
    ],
    luckyElements: { color: "ダークゴールド", item: "高品質な名刺入れ", day: "月曜日", number: 8 },
  },

  // ── ISTP ──────────────────────────────────────────────────
  "ISTP_FARO": {
    title: "静寂の観察者",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたは世界を<mark>誰よりも鋭い目で観察し、自分だけの角度で理解する</mark>存在です。ISTPの実践的な知性は、実際に手を動かし体験することで最大限に発揮されます。言葉を多く使わずとも、その行動と眼差しが深い知性を語っています。<span class="result-section-label">【行動傾向】</span>不思議生命体タイプの独自の視点が重なり、<mark>誰も思いつかない角度から物事の本質を捉える</mark>稀有な知性を持ちます。その独創性は意図的なものではなく、あなたの本質的な物の見方から自然に生まれます。<span class="result-section-label">【注意点】</span>内側が豊かなゆえに、<mark>自分を外に表現することを後回しにしがち</mark>です。<span class="result-section-label">【メッセージ】</span>あなたの視点は世界の宝です。<mark>誰かに語ることで、その価値がさらに輝き</mark>はじめます。`,
    advice: "あなたの観察と発見を、今日誰かに一つ話してみて。内側の豊かさを外に出すほど、あなたの世界は広がります。言葉は短くても構わない——あなたの独自の視点は、相手にとって新鮮な驚きをもたらします。沈黙の中にもあなたの知性は伝わりますが、声に出すことでさらに深い繋がりが生まれます。",
    tarotCard: "隠者",
    tarotMeaning: "内なる光が、外の世界を照らし始める",
    loveReading: "ISTPと不思議生命体の組み合わせは、静かながらも深い独自性を持つ、唯一無二の存在感を生み出します。相手の予想を外す角度から現れ、一度惹かれると忘れられない印象を残します。",
    cosmicMessage: "隠者の光があなたの道を照らしています。一人でいることを恐れないで——その静寂の中に、最も重要な答えがあります。そして見つけた答えを、信頼できる誰かと分かち合ってみてください。",
    strengths: [
      { title: "鋭い実践的観察力", detail: "物事を実際に手を動かしながら観察し、本質を見抜く実践的な知性があります。理論より経験から学ぶその姿勢が、確かな技術と判断力を育てています。" },
      { title: "独自の視点と発見力", detail: "誰も気づかない角度から物事を捉える独自の視点があります。その独創的な発見が、問題解決に新しい光をもたらします。" },
      { title: "冷静な危機対応力", detail: "緊急事態でも冷静さを保ち、即座に最適な行動を取る能力があります。その落ち着いた対応力が、周囲に信頼感を与えます。" },
      { title: "自立した内なる世界", detail: "他者の評価を必要としない、確固たる内側の世界を持っています。その自立した精神が、あなたの独自性の源泉となっています。" },
    ],
    challenges: [
      { title: "感情表現の少なさ", detail: "内側に豊かな感情があっても、それを表現することが少ないため誤解を生むことがあります。感情を言葉にする練習が、関係の深さを増します。" },
      { title: "長期計画への抵抗感", detail: "今この瞬間を大切にするゆえ、長期的な計画や約束へ抵抗感を感じることがあります。短期の目標と長期のビジョンを結びつける橋を作ることが助けになります。" },
      { title: "社交的場面でのエネルギー消費", detail: "大人数での社交的な場でエネルギーを消耗しやすいです。必要なリチャージの時間を確保することが、持続的な関係維持のカギです。" },
    ],
    luckyElements: { color: "スモーキーグレー", item: "多機能ツール", day: "土曜日", number: 6 },
  },

  // ── ESFP ──────────────────────────────────────────────────
  "ESFP_LAPO": {
    title: "輝ける花火師",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたは生きているだけで、周囲を<mark>祭りの夜のように輝かせる</mark>存在です。ESFPの陽気で自発的なエネルギーは、暗い部屋にも光を運びます。今この瞬間の喜びを最大限に感じ取り、それを周囲と分かち合うことに本物の幸福を見出しています。<span class="result-section-label">【行動傾向】</span>パーフェクトカメレオンの適応力が重なり、<mark>どんな場でも自分らしさを失わずに溶け込む</mark>天才的な能力があります。いつでも場の一番明るいエネルギーをまとい、人々を笑顔にします。<span class="result-section-label">【注意点】</span>輝きすぎて<mark>自分の内側が空洞になっていないか</mark>、時々確認することが大切です。<span class="result-section-label">【メッセージ】</span>あなたの喜びは本物——<mark>その喜びを自分自身にも向けてあげて</mark>ください。`,
    advice: "楽しさを人と分かち合うのが得意なあなたへ——自分一人の時間に「自分だけの喜び」を見つけることも大切です。外側に向けているエネルギーの一部を、自分自身を理解することに使ってみましょう。内側が満たされるほど、あなたの輝きはさらに深くなります。",
    tarotCard: "太陽",
    tarotMeaning: "本来の輝きが全開になり、すべてが照らされる",
    loveReading: "ESFPとパーフェクトカメレオンの組み合わせは、どんな状況でも輝き続ける、飽きることのないエネルギッシュな存在感を生み出します。相手を笑顔にしながら、自分自身も深く楽しむことができます。",
    cosmicMessage: "太陽のカードがあなたに告げます——あなたの喜びは世界への贈り物です。輝き続けて。そしてその輝きの源である自分自身を、大切に育て続けてください。",
    strengths: [
      { title: "空気を変えるエネルギー", detail: "部屋に入るだけで場の雰囲気を明るく変える自然なエネルギーがあります。その太陽のような存在感が、周囲の人々に喜びをもたらします。" },
      { title: "現在への完全な没入力", detail: "今この瞬間に完全に没入して楽しめる能力があります。その純粋な喜びの感受性が、日常をより豊かな体験に変えます。" },
      { title: "あらゆる環境への適応力", detail: "異なる人や場所にも柔軟に適応しながら、自分らしさを失わない稀有な能力があります。その適応力が、多様な場での活躍を可能にします。" },
      { title: "人を笑顔にするセンス", detail: "ユーモアと温かさで自然と人々を笑顔にするセンスがあります。その才能が、あなたのそばにいる人たちの人生を明るくしています。" },
    ],
    challenges: [
      { title: "深い反省と計画の後回し", detail: "今の楽しさを優先するあまり、深い反省や将来の計画を後回しにしがちです。短い振り返りの時間を日課にすることが、持続的な成長をもたらします。" },
      { title: "批判への敏感さ", detail: "ポジティブなエネルギーが強いゆえに、批判や否定的なフィードバックに過剰に反応することがあります。建設的な批判を成長のギフトとして受け取る練習が助けになります。" },
      { title: "深い感情の処理", detail: "表面の明るさの裏で、深い感情が処理されないままになることがあります。信頼できる人との深い対話が、内側のバランスを保ちます。" },
    ],
    luckyElements: { color: "サンシャインイエロー", item: "カラフルなアクセサリー", day: "金曜日", number: 3 },
  },

  // ── Default fallbacks by love type ────────────────────────
  "default_FAPE": {
    title: "愛の巡礼者",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたの行動はいつも深く、<mark>純粋で揺るぎない</mark>ものです。最後の恋人タイプの大きな器があなたの誠実さをさらに深くします。あなたの愛は条件を付けず、相手の全てを受け入れようとする広大さを持っています。<span class="result-section-label">【行動傾向】</span>大切な人のためなら何でもしてあげたいという<mark>魂の深くからの献身</mark>がありますが、それは時に一方通行になることも。あなたが深く関わるとき、相手は特別な存在として扱われていることを全身で感じます。<span class="result-section-label">【注意点】</span>その献身の中に、<mark>あなた自身の願いや夢も潜んでいる</mark>ことを忘れないで。<span class="result-section-label">【メッセージ】</span>他者を支えることと、<mark>自分を大切にすることは矛盾しません</mark>。あなたが幸せであることが、最高の贈り物です。`,
    advice: "自分の心の声に正直になる日を作ってみて。あなたが満たされてこそ、力は循環します。定期的に「自分は今何が欲しいか」と自問する習慣をつけてみましょう。あなたが相手に与えるように、自分自身にも同じ温かさを向けてください。",
    tarotCard: "カップのクイーン",
    tarotMeaning: "感情の豊かさが、あなたの周りを潤す",
    loveReading: "最後の恋人タイプのあなたは、誰よりも深く、誰よりも長く人を支え続けることができます。その誠実さが本物のパートナーを引き寄せます。相互に支え合える関係を意識的に選んでいきましょう。",
    cosmicMessage: "あなたの器の大きさは宇宙に等しい。自分自身へもその愛を向けることを忘れずに。カップのクイーンのように、感情の深さを力に変えて。",
    strengths: [
      { title: "無条件の包容力", detail: "条件をつけず、相手のすべてを受け入れようとする広大な包容力があります。その無条件の愛が、あなたのそばにいる人に深い安心感をもたらします。" },
      { title: "誰への誠実な献身", detail: "特定の人だけでなく、関わるすべての人に誠実に向き合います。その一貫した献身が、あなたへの信頼を積み重ねていきます。" },
      { title: "痛みへの深い共感", detail: "相手の痛みや苦しみを自分ごととして感じ取る深い共感力があります。その理解が、誰もがあなたに心を開ける理由です。" },
      { title: "長期的な関係の育み", detail: "時間をかけて丁寧に関係を育てる忍耐力と誠実さを持っています。年月を重ねるほど深まる、本物の絆を作り出せます。" },
    ],
    challenges: [
      { title: "与えすぎる傾向", detail: "愛情深さゆえに与え続けてしまい、自分が枯れてしまうことがあります。自分自身への愛も、他者への愛と同じくらい大切にしてください。" },
      { title: "相手への過剰期待", detail: "自分が与えるほどを相手にも期待してしまうことがあります。人はそれぞれ異なる与え方をする——その多様性を受け入れることが関係を楽にします。" },
      { title: "感情の先送り", detail: "他者を優先するあまり、自分の感情を後回しにしてしまいます。定期的に「今自分はどう感じているか」と確認する習慣が自己理解を深めます。" },
    ],
    luckyElements: { color: "深いワインレッド", item: "ハーブティーのセット", day: "月曜日", number: 9 },
  },
  "default_LARO": {
    title: "孤高の輝き星",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたは自分の軸を持ち、<mark>誰の目も気にせず進むことができる</mark>稀有な存在です。憧れの先輩タイプの自然な包容力がさらにその魅力を引き立てます。あなたの存在感は演じたものではなく、揺るぎない自己理解から生まれる本物のオーラです。<span class="result-section-label">【行動傾向】</span>集団においても個人においても、<mark>対等な関係を求め、依存も支配も求めません</mark>。自然と頼られる存在になりながらも、それに縛られない自由さを保ちます。<span class="result-section-label">【注意点】</span>強さの裏に、<mark>誰かに弱さを見せることへの怖れ</mark>が隠れていることがあります。<span class="result-section-label">【メッセージ】</span><mark>心の扉を少し開けてみて</mark>。あなたの本物の姿を知りたいと思っている人が、すでそこにいます。`,
    advice: "心の扉を少し開けてみて。あなたの強さは、誰かを信頼することでさらに輝きます。孤高の星も、星座の中でその輝きを増します。信頼できる人と共にいることで、あなたの魅力はより深くなります。",
    tarotCard: "カップのキング",
    tarotMeaning: "感情のバランスが、真の力をもたらす",
    loveReading: "憧れの先輩タイプのあなたは、自然と人々から頼られ、慕われます。その温かな包容力が理想のパートナーを引き寄せます。対等なパートナーシップを築くことで、あなたはさらに輝きます。",
    cosmicMessage: "あなたの存在そのものが、誰かにとっての星明かりです。その輝きを信じて。カップのキングのように、感情と理性のバランスがあなたに真の力をもたらします。",
    strengths: [
      { title: "確固たる自分軸", detail: "周囲の意見に流されない、揺るぎない自己軸を持っています。そのアイデンティティの確かさが、あなたを特別な存在感を放つ人にしています。" },
      { title: "自然な影響力と包容力", detail: "押し付けがましくなく、自然な温かさで人々に影響を与えます。その包容力が、多くの人があなたに惹かれる理由です。" },
      { title: "対等な関係の構築力", detail: "依存も支配も求めず、対等で互いを尊重する関係を構築できます。その姿勢が、長続きする健全な人間関係の基盤となっています。" },
      { title: "独立心と信頼性の両立", detail: "自立していながら、必要な時には確かな信頼性を発揮します。この二面性が、多くの場面であなたを頼れる存在にしています。" },
    ],
    challenges: [
      { title: "弱さを見せる抵抗感", detail: "強くあろうとするあまり、弱さを見せることへの抵抗感があります。脆さを見せることができる人だけが、本物の深い信頼を得られます。" },
      { title: "完璧に見せるプレッシャー", detail: "常に完璧に見せようとするプレッシャーを自分に課してしまいます。不完全なあなたも同じくらい魅力的であると認めることが自由をもたらします。" },
      { title: "孤独を選びすぎる傾向", detail: "強さゆえに孤独を選びすぎてしまうことがあります。信頼できる人と共にいることが、あなたの輝きをさらに増させます。" },
    ],
    luckyElements: { color: "星のシルバー", item: "望遠鏡", day: "火曜日", number: 7 },
  },
  "default_FCRO": {
    title: "夢追う旅人",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたは現実の中に夢を見つけ、<mark>日常を物語に変える力</mark>を持っています。ロマンスマジシャンの洗練された魅力がその世界観を彩ります。あなたの目を通すと、平凡な風景が映画のワンシーンになります。その独特の視点が、あなたを忘れられない存在にします。<span class="result-section-label">【行動傾向】</span>絶妙な距離感で周囲を引き寄せるその才能は、<mark>場の読み手ならでは</mark>のもの。近づきすぎず離れすぎず、その塩梅が人々を魅了します。あなたとの会話は、相手に特別感を与えます。<span class="result-section-label">【注意点】</span>魔法をかけすぎて<mark>本音を隠しすぎてしまう</mark>ことがあります。<span class="result-section-label">【メッセージ】</span><mark>地に足をつけながらも、その夢の炎を絶やさないで</mark>。`,
    advice: "地に足をつけながらも、その夢の炎を絶やさないで。現実と理想は、共存できます。あなたの夢は逃避ではなく、あなたが生きる理由です。その夢に向かって、今日一つの小さな行動を取ってみましょう。",
    tarotCard: "カップのエース",
    tarotMeaning: "新しい感情と始まりが訪れる",
    loveReading: "ロマンスマジシャンのあなたは、場を芸術の域まで高める才能があります。その魔法を信じて、本物の繋がりに踏み込んで。あなたの魅力は特別——それを知っていながらも謙虚でいられることが、さらなる魅力です。",
    cosmicMessage: "カップのエースが示す新しい始まりが近づいています。心を開く準備を。新しい感情の扉を開くとき、あなたはより豊かな世界へと踏み出します。",
    strengths: [
      { title: "日常を物語に変える視点", detail: "平凡な日常の中に誰も気づかない物語と意味を見出します。その独自の視点が、あなたとの時間をかけがえない体験にしています。" },
      { title: "絶妙な距離感の引力", detail: "近すぎず離れすぎない絶妙な間合いで人を引き寄せます。その魅力的な距離感が、周囲の人々をあなたの軌道上に引き込みます。" },
      { title: "洗練された会話力", detail: "相手を飽きさせない洗練された魅力と会話センスがあります。あなたとの対話は、相手に特別感と知的な刺激を与えます。" },
      { title: "夢と現実をつなぐ力", detail: "夢想しながらも現実とのバランスを保てる想像力があります。その橋渡しの力が、理想を少しずつ現実に変えていきます。" },
    ],
    challenges: [
      { title: "本音を見せる恐れ", detail: "魔法のような魅力の裏に、本音を見せることへの恐れが隠れていることがあります。本当の自分を見せることが、最も深い繋がりへの扉です。" },
      { title: "距離感が壁になる", detail: "絶妙な距離感が時に壁となり、深い関係の形成を妨げることがあります。信頼できる相手には、その距離を少しずつ縮める勇気を持ちましょう。" },
      { title: "理想の高さと現実", detail: "理想が高いゆえに、現実の素晴らしさを見逃してしまうことがあります。今この瞬間の不完全な美しさにも目を向けてみてください。" },
    ],
    luckyElements: { color: "ミステリアスなティール", item: "旅行本と地図", day: "木曜日", number: 4 },
  },
  "default_LCPE": {
    title: "堅実なる宝石",
    description:
      `<span class="result-section-label">【性格の核心】</span>あなたは地に足ついた確かな価値観で、<mark>人生の本質を見抜く目</mark>を持っています。ツンデレヤンキータイプのエネルギッシュな行動力がその魅力を爆発させます。外見のクールさとは裏腹に、大切な人への情熱は誰よりも深い——その矛盾が、あなたを最も魅力的にしています。<span class="result-section-label">【行動傾向】</span>大切な人への誠実さは誰より深いけれど、<mark>表現することに照れがある</mark>という矛盾が魅力でもあります。守りたいと思ったとき、その行動力は誰にも引けを取りません。<span class="result-section-label">【注意点】</span>現実ばかりを見すぎて、<mark>ときめきや非日常を遠ざけてしまう</mark>ことがあります。<span class="result-section-label">【メッセージ】</span><mark>感情を表現することを恐れないで</mark>。あなたの内側にある温かさを、言葉にすることを少しずつ試みてみて。`,
    advice: "感情を表現することを恐れないで。あなたの内側にある温かさを、信頼できる人に見せてみて。不器用でいい——その不器用さが、あなたの誠実さの証明です。言葉にならなければ、行動で示すことから始めても構いません。あなたの熱量は、必ず伝わります。",
    tarotCard: "ペンタクルスのクイーン",
    tarotMeaning: "実直さと信頼が、豊かな未来を築く",
    loveReading: "ツンデレヤンキータイプのあなたは、外見のクールさとは裏腹に、大切な人への誠実さは誰よりも深い。そのギャップが人を惹きつけます。一度信頼を得た相手への一途さは、あなたの最大の魅力です。",
    cosmicMessage: "あなたの本当の気持ちを表現するとき、最も素晴らしい奇跡が起きます。勇気を持って。ペンタクルスのクイーンのように、地に足をつけながらも豊かな感情を持ち続けて。",
    strengths: [
      { title: "地に足の確かな判断力", detail: "現実を直視して、地に足のついた確かな判断を下すことができます。その冷静な判断力が、混乱した状況でも信頼される存在にしています。" },
      { title: "燃えるような誠実さ", detail: "大切な人への誠実さは、クールな外見とは裏腹に誰よりも深く熱いです。一度信頼を得た相手への献身は、何があっても揺らぎません。" },
      { title: "行動で示す愛情", detail: "言葉より行動で愛情と誠実さを示すことができます。その不器用ながらも確かな愛の示し方が、受け取る人の心に深く刻まれます。" },
      { title: "現実的な問題解決力", detail: "感情に流されず、現実的で実践的な問題解決ができます。その実直なアプローチが、具体的な成果と信頼を生み出します。" },
    ],
    challenges: [
      { title: "感情表現の難しさ", detail: "内側には深い感情があるのに、それを表現することが難しく誤解を生むことがあります。不器用でも言葉にする練習が、関係の深さを増します。" },
      { title: "ときめきを遠ざける傾向", detail: "現実的であることを重視するあまり、ときめきや非日常を遠ざけてしまうことがあります。感情と現実は両立できると気づくことが豊かさをもたらします。" },
      { title: "感情の言語化への照れ", detail: "自分の感情を言葉にすることへの照れや恥ずかしさがあります。その不器用な正直さ自体があなたの魅力であり、伝えることを恐れないでください。" },
    ],
    luckyElements: { color: "深いバーガンディ", item: "ウィスキーグラス（大人の夜に）", day: "水曜日", number: 8 },
  },
};

// Helper to get the best matching result reading
export function getResultReading(
  mbtiType: string,
  loveType: LoveType,
  zodiac?: string,
  tarotCard?: string,
  isReversed?: boolean
): ResultReading {
  const exactKey = `${mbtiType}_${loveType}`;
  if (resultReadings[exactKey]) return resultReadings[exactKey];

  const mbtiKey = `${mbtiType}_default`;
  if (resultReadings[mbtiKey]) return resultReadings[mbtiKey];

  const loveKey = `default_${loveType}`;
  if (resultReadings[loveKey]) return resultReadings[loveKey];

  // Build a dynamic fallback using zodiac and tarot if provided
  const tarotNote = tarotCard
    ? (isReversed ? `【${tarotCard}（逆位置）】` : `【${tarotCard}】`)
    : "";
  const zodiacNote = zodiac ? `${zodiac}の星のもとに生まれたあなたは` : "あなたは";

  return {
    title: "あなただけの鑑定書",
    description: `<span class="result-section-label">【総合鑑定】</span>${zodiacNote}、<mark>独自の輝きを放つ存在</mark>です。${tarotNote}が示すメッセージと、あなたの持つ内なる力が交差するとき、新しい扉が開きます。その扉の向こうに何があるのかを知っているのは、あなた自身だけです。<span class="result-section-label">【行動傾向】</span>あなたの行動スタイルは<mark>唯一無二</mark>です。その個性が本物のパートナーを引き寄せます。真の繋がりは、自分らしさを発揮したときに初めて生まれます。<span class="result-section-label">【メッセージ】</span><mark>自分自身を信じることが、すべての始まり</mark>です。あなたはすでに、答えを持っています。`,
    advice: "自分の心の声に耳を傾けて。あなたの直感が最良の答えを知っています。今日、一つだけ自分のために何かをしてみましょう。小さな一歩が、大きな変化の始まりになります。",
    tarotCard: tarotCard || "星",
    tarotMeaning: "希望の光があなたの道を照らす",
    loveReading: "あなただけの行動スタイルを大切に。本物の繋がりは、自分らしさを発揮したときに生まれます。今のあなたのままで、すでに誰かを深く動かしています。",
    cosmicMessage: "星が示す通り、あなたの未来は輝きに満ちています。ただ信じて進んでください。星の光が届くまでに時間がかかるように、あなたの努力も必ず誰かの心に届きます。",
    strengths: [
      { title: "唯一無二の個性", detail: "誰とも異なる独自の視点と個性があります。その唯一無二の存在感が、あなたを替えのきかない特別な人にしています。" },
      { title: "自分らしさを守る力", detail: "周囲の圧力に流されず、自分らしさを大切にする芯の強さがあります。その真摯な自己表現が、本物の繋がりを引き寄せます。" },
      { title: "誠実さへの意志", detail: "表面的な関係ではなく、本物の繋がりを求め続ける誠実さを持っています。その姿勢が、深く信頼される人間関係の基盤となります。" },
    ],
    challenges: [
      { title: "強みの過小評価", detail: "自分の才能や価値を過小評価してしまうことがあります。他者の目には輝いて見えているあなたの強みを、自分自身も認めてみてください。" },
      { title: "比較による自信の揺らぎ", detail: "他者と比較することで自信を失いやすいことがあります。あなたの道はあなただけのものであり、比較は意味を持ちません。" },
    ],
    luckyElements: { color: "星のシルバー", item: "星座の本", day: "日曜日", number: 7 },
  };
}
