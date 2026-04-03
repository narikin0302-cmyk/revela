import type { LoveType, MBTIQuestion, LoveQuestion } from "@/data/questions";
import { mbtiQuestions, loveQuestions } from "@/data/questions";

// ============================================================
// MBTI Calculation
// ============================================================

// 1=そう思う, 2=ややそう思う, 3=どちらでもない, 4=ややそう思わない, 5=そう思わない
export type LikertScore = 1 | 2 | 3 | 4 | 5;
const LIKERT_WEIGHTS: Record<LikertScore, [number, number]> = {
  1: [2, 0],
  2: [1, 0],
  3: [0, 0],
  4: [0, 1],
  5: [0, 2],
};

export interface MBTIAnswers {
  [questionId: number]: LikertScore;
}

export function calculateMBTI(answers: MBTIAnswers, questions: MBTIQuestion[] = mbtiQuestions): string {
  const scores: Record<string, number> = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0,
  };

  questions.forEach((q) => {
    const answer = answers[q.id] as LikertScore | undefined;
    if (!answer) return;
    const [aScore, bScore] = LIKERT_WEIGHTS[answer];
    scores[q.aValue] = (scores[q.aValue] || 0) + aScore;
    scores[q.bValue] = (scores[q.bValue] || 0) + bScore;
  });

  const ei = scores.E >= scores.I ? "E" : "I";
  const sn = scores.S >= scores.N ? "S" : "N";
  const tf = scores.T >= scores.F ? "T" : "F";
  const jp = scores.J >= scores.P ? "J" : "P";

  return `${ei}${sn}${tf}${jp}`;
}

export interface MBTIDimensionScore {
  left: string;   // e.g. "E"
  right: string;  // e.g. "I"
  leftPct: number;  // 0-100
  rightPct: number; // 0-100
  winner: string;
}

export function getMBTIScores(answers: MBTIAnswers, questions: MBTIQuestion[] = mbtiQuestions): MBTIDimensionScore[] {
  const scores: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  questions.forEach((q) => {
    const answer = answers[q.id] as LikertScore | undefined;
    if (!answer) return;
    const [aScore, bScore] = LIKERT_WEIGHTS[answer];
    scores[q.aValue] = (scores[q.aValue] || 0) + aScore;
    scores[q.bValue] = (scores[q.bValue] || 0) + bScore;
  });

  const pairs: [string, string][] = [["E", "I"], ["S", "N"], ["T", "F"], ["J", "P"]];
  return pairs.map(([left, right]) => {
    const total = scores[left] + scores[right];
    const leftPct = total === 0 ? 50 : Math.round((scores[left] / total) * 100);
    return { left, right, leftPct, rightPct: 100 - leftPct, winner: leftPct >= 50 ? left : right };
  });
}

// ============================================================
// Love Type Calculation (16-type system)
// Axis 1: L vs F (積極的 vs 受動的)
// Axis 2: C vs A (クール vs 感情的)
// Axis 3: R vs P (現実的 vs 情熱的)
// Axis 4: O vs E (オープン vs 内向的)
// ============================================================

export interface LoveAnswers {
  [questionId: number]: LikertScore;
}

export function calculateLoveType(answers: LoveAnswers, questions: LoveQuestion[] = loveQuestions): LoveType {
  const axis1: Record<string, number> = { A: 0, S: 0 };
  const axis2: Record<string, number> = { E: 0, L: 0 };
  const axis3: Record<string, number> = { R: 0, V: 0 };
  const axis4: Record<string, number> = { F: 0, P: 0 };

  questions.forEach((q) => {
    const answer = answers[q.id] as LikertScore | undefined;
    if (!answer) return;
    const [aScore, bScore] = LIKERT_WEIGHTS[answer];
    const axisMap = q.axis === "1" ? axis1 : q.axis === "2" ? axis2 : q.axis === "3" ? axis3 : axis4;
    axisMap[q.aValue] = (axisMap[q.aValue] || 0) + aScore;
    axisMap[q.bValue] = (axisMap[q.bValue] || 0) + bScore;
  });

  const a1 = axis1.A >= axis1.S ? "A" : "S";
  const a2 = axis2.E >= axis2.L ? "E" : "L";
  const a3 = axis3.R >= axis3.V ? "R" : "V";
  const a4 = axis4.F >= axis4.P ? "F" : "P";

  return `${a1}${a2}${a3}${a4}` as LoveType;
}

// ============================================================
// True Self MBTI verification
// Returns the suggested alternative type based on 3 introspective questions
// ============================================================

export interface TrueSelfAnswers {
  [questionId: number]: "A" | "B";
}

export function calculateTrueSelf(
  originalMBTI: string,
  answers: TrueSelfAnswers
): { confirmed: boolean; suggestedType: string } {
  // Question 1 → EI axis
  // Question 2 → TF axis
  // Question 3 → SN axis (used as JP proxy for simplicity)

  const q1 = answers[1]; // EI
  const q2 = answers[2]; // TF
  const q3 = answers[3]; // SN

  if (!q1 || !q2 || !q3) {
    return { confirmed: true, suggestedType: originalMBTI };
  }

  const eiSuggested = q1 === "A" ? "E" : "I";
  const tfSuggested = q2 === "A" ? "T" : "F";
  const snSuggested = q3 === "A" ? "S" : "N";

  const originalEI = originalMBTI[0];
  const originalSN = originalMBTI[1];
  const originalTF = originalMBTI[2];
  const originalJP = originalMBTI[3];

  // Count how many axes differ
  const diffCount =
    (eiSuggested !== originalEI ? 1 : 0) +
    (tfSuggested !== originalTF ? 1 : 0) +
    (snSuggested !== originalSN ? 1 : 0);

  if (diffCount === 0) {
    return { confirmed: true, suggestedType: originalMBTI };
  }

  // Build suggested type
  const newEI = eiSuggested !== originalEI ? eiSuggested : originalEI;
  const newSN = snSuggested !== originalSN ? snSuggested : originalSN;
  const newTF = tfSuggested !== originalTF ? tfSuggested : originalTF;

  const suggestedType = `${newEI}${newSN}${newTF}${originalJP}`;

  return { confirmed: false, suggestedType };
}

// ============================================================
// Zodiac from birthdate
// ============================================================

export function getZodiacFromDate(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "牡羊座";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "牡牛座";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return "双子座";
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return "蟹座";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "獅子座";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "乙女座";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return "天秤座";
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return "蠍座";
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return "射手座";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "山羊座";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "水瓶座";
  return "魚座";
}

// ============================================================
// Zodiac element and ruling planet
// ============================================================

export const zodiacInfo: Record<string, { element: string; planet: string; emoji: string }> = {
  "牡羊座": { element: "火", planet: "火星", emoji: "♈" },
  "牡牛座": { element: "土", planet: "金星", emoji: "♉" },
  "双子座": { element: "風", planet: "水星", emoji: "♊" },
  "蟹座": { element: "水", planet: "月", emoji: "♋" },
  "獅子座": { element: "火", planet: "太陽", emoji: "♌" },
  "乙女座": { element: "土", planet: "水星", emoji: "♍" },
  "天秤座": { element: "風", planet: "金星", emoji: "♎" },
  "蠍座": { element: "水", planet: "冥王星", emoji: "♏" },
  "射手座": { element: "火", planet: "木星", emoji: "♐" },
  "山羊座": { element: "土", planet: "土星", emoji: "♑" },
  "水瓶座": { element: "風", planet: "天王星", emoji: "♒" },
  "魚座": { element: "水", planet: "海王星", emoji: "♓" },
};
