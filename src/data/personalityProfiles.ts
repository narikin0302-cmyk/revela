// ============================================================
// personalityProfiles.ts
// classNumber (1-16) を活用したパーソナライズデータ
// MBTI × loveType の各軸で強み・動機・環境を定義
// ============================================================

export interface MbtiProfile {
  strength: string;      // 強みキーワード（カンマ区切り）
  environment: string;   // 合う環境
  selfPR: string;        // 自己PR軸（面接フレーズのベース）
}

export interface LoveProfile {
  motivation: string;    // 本音の動機フレーズ
  weakness: string;      // 弱みの傾向
  interviewPhrase: string; // 面接で使える一言
}

// ── MBTIプロフィール（建前） ──────────────────────────────────

export const MBTI_PROFILES: Record<string, MbtiProfile> = {
  // LEADER グループ
  ENTJ: {
    strength: "戦略・統率・決断",
    environment: "裁量が大きく結果が問われる環境",
    selfPR: "目標から逆算して組織を動かせる",
  },
  ESTJ: {
    strength: "実行・管理・規律",
    environment: "明確な基準と役割がある組織",
    selfPR: "計画を現実に落とし込む実行力がある",
  },
  ENFJ: {
    strength: "共感・鼓舞・調整",
    environment: "人の成長が評価される職場",
    selfPR: "チームのモチベーションを引き出して動かせる",
  },
  ESTP: {
    strength: "行動・適応・突破",
    environment: "変化が多くスピードが求められる職場",
    selfPR: "状況を即座に読み、現場で問題を解決できる",
  },

  // BRAIN グループ
  INTJ: {
    strength: "設計・独立・洞察",
    environment: "専門性が評価される自律的な環境",
    selfPR: "複雑な問題を体系化して解決策を設計できる",
  },
  INTP: {
    strength: "分析・探求・論理",
    environment: "自律的に動ける研究・開発環境",
    selfPR: "問題の本質を論理的に掘り下げる分析力がある",
  },
  ISTP: {
    strength: "技術・冷静・即応",
    environment: "専門スキルが活かせる現場",
    selfPR: "冷静な判断と技術力で問題を解決できる",
  },
  INFJ: {
    strength: "洞察・ビジョン・共感",
    environment: "意味と使命感がある職場",
    selfPR: "本質を見抜き、人の可能性を長期視点で引き出せる",
  },

  // SUPPORT グループ
  ISTJ: {
    strength: "誠実・継続・正確",
    environment: "安定した基準と継続性がある組織",
    selfPR: "責任感と正確さで長期的な信頼を築ける",
  },
  ISFJ: {
    strength: "献身・細やか・忠実",
    environment: "人への貢献が評価される職場",
    selfPR: "細やかな気配りとサポートでチームを支えられる",
  },
  ESFJ: {
    strength: "調和・気配り・実務",
    environment: "チームワークと協力を重視する環境",
    selfPR: "関係構築力と実務能力でチームの結束を高められる",
  },
  INFP: {
    strength: "価値観・創造・誠実",
    environment: "個性と価値観が尊重される環境",
    selfPR: "強い価値観と創造性でオリジナルな解決策を出せる",
  },

  // TRICKSTER グループ
  ENTP: {
    strength: "発想・議論・革新",
    environment: "新しいことに挑戦できる刺激的な環境",
    selfPR: "既存の枠を超えたアイデアで新しい価値を生み出せる",
  },
  ENFP: {
    strength: "熱量・巻き込み・直感",
    environment: "自由と創造性がある環境",
    selfPR: "熱量と共感力で人を巻き込み、可能性を広げられる",
  },
  ISFP: {
    strength: "感性・柔軟・温かさ",
    environment: "個性と感性が活きる環境",
    selfPR: "柔軟な感性と温かいサポートで場の空気を作れる",
  },
  ESFP: {
    strength: "表現・明るさ・共感",
    environment: "人との交流と表現が求められる環境",
    selfPR: "明るさと共感力でチームに活気をもたらせる",
  },
};

// ── loveTypeプロフィール（本音） ─────────────────────────────

export const LOVE_PROFILES: Record<string, LoveProfile> = {
  // 前衛グループ（A + F）
  ALRF: {
    motivation: "論理的な成果で存在感を示したい",
    weakness: "効率を重視しすぎて感情を見落としやすい",
    interviewPhrase: "数字と論理で成果を出し、チームを牽引します",
  },
  ALVF: {
    motivation: "ビジョンを形にして注目されたい",
    weakness: "飽きやすく、継続フェーズに苦手感が出やすい",
    interviewPhrase: "アイデアを実装まで持っていく推進力があります",
  },
  AERF: {
    motivation: "人に認められ、必要とされる存在でありたい",
    weakness: "承認を求めすぎて消耗することがある",
    interviewPhrase: "人を動かしながら、現場で実績を積み上げます",
  },
  AEVF: {
    motivation: "世界を変える存在でありたい",
    weakness: "理想と現実のギャップに苦しみやすい",
    interviewPhrase: "熱量で人を動かし、大きなビジョンを追います",
  },

  // 自由グループ（A + P）
  ALRP: {
    motivation: "自分のやり方で、論理的に結果を出したい",
    weakness: "協調より自律を優先しすぎることがある",
    interviewPhrase: "独自のアプローチで、再現性のある成果を出します",
  },
  ALVP: {
    motivation: "信念を持って、自分の理想を追い続けたい",
    weakness: "柔軟性が低く、周囲との摩擦が生まれやすい",
    interviewPhrase: "自分の信念を軸に、ぶれない姿勢で仕事します",
  },
  AERP: {
    motivation: "自分らしく、誠実に関わり続けたい",
    weakness: "感情に従いすぎて判断が揺れることがある",
    interviewPhrase: "誠実さと人への共感を武器に、関係を作ります",
  },
  AEVP: {
    motivation: "理想の未来を、自分の手で作りたい",
    weakness: "完璧主義で動き出しが遅くなることがある",
    interviewPhrase: "理想から逆算し、信念を持って動き続けます",
  },

  // 後衛グループ（S + F）
  SLRF: {
    motivation: "論理的に正確に、縁の下で貢献したい",
    weakness: "自己主張が弱く、評価されにくいことがある",
    interviewPhrase: "確実なサポートとデータで、チームを支えます",
  },
  SLVF: {
    motivation: "未来を見据えながら、誰かの力になりたい",
    weakness: "期待が大きく、裏切られたと感じやすい",
    interviewPhrase: "長期視点でチームの可能性を広げるサポートをします",
  },
  SERF: {
    motivation: "必要とされることが、自分の力になる",
    weakness: "他者の感情に引っ張られすぎて消耗しやすい",
    interviewPhrase: "共感力と現場感覚で、チームの空気を整えます",
  },
  SEVF: {
    motivation: "大切な人の夢を、陰から支えたい",
    weakness: "自分を後回しにしすぎるリスクがある",
    interviewPhrase: "深い献身とビジョン理解で、チームを下から支えます",
  },

  // 頭脳グループ（S + P）
  SLRP: {
    motivation: "深い専門性を積み上げ、長く貢献したい",
    weakness: "変化への対応が遅くなりやすい",
    interviewPhrase: "論理と原則を軸に、専門性で長期的な価値を出します",
  },
  SLVP: {
    motivation: "理想の仕組みを追求し、完成させたい",
    weakness: "完璧主義で完成までに時間がかかりやすい",
    interviewPhrase: "理想の構造を設計し、本質的な解決策を作ります",
  },
  SERP: {
    motivation: "誠実さと深さで、信頼を積み上げたい",
    weakness: "深入りしすぎて視野が狭くなることがある",
    interviewPhrase: "誠実に深く関わり、長期的な信頼関係を築けます",
  },
  SEVP: {
    motivation: "自分の価値観と信念を守り続けたい",
    weakness: "頑固さが周囲との摩擦になることがある",
    interviewPhrase: "強い信念と深い共感力で、ぶれない仕事をします",
  },
};

// ── 軸相性スコア補正（L/E軸 × R/V軸） ───────────────────────
// classNumber を活用した、グループ相性にプラスする詳細補正
// loveType[1]: L(論理) / E(感情)
// loveType[2]: R(現実) / V(ビジョン)

export function calcAxisBonus(loveTypeA: string, loveTypeB: string): number {
  if (loveTypeA.length < 3 || loveTypeB.length < 3) return 0;
  let bonus = 0;

  // L/E軸: 同じ → +2（思考スタイルの共鳴）
  const leA = loveTypeA[1];
  const leB = loveTypeB[1];
  if (leA === leB) bonus += 2;

  // R/V軸: 補完（R+V）→ +3 / 同じ → +1
  const rvA = loveTypeA[2];
  const rvB = loveTypeB[2];
  if (rvA !== rvB) {
    bonus += 3; // 現実志向 × ビジョン志向は互いを補完
  } else {
    bonus += 1; // 同じ志向はシンパシーがある
  }

  return bonus; // 0〜5
}
