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

// ============================================================
// Party Synergy — 11-pattern group analysis
// ============================================================

export interface PartySynergy {
  rank: "S" | "A" | "B" | "C" | "D";
  name: string;
  nameEn: string;
  color: string;
  title: string;
  description: string;
  advantage: { label: string; text: string };
  fatalFlaw: { label: string; text: string };
  nextStrategy: { label: string; text: string };
}

type RoleCounts = Record<RoleType, number>;

function countRoles(classes: string[]): RoleCounts {
  const counts: RoleCounts = { LEADER: 0, SUPPORT: 0, BRAIN: 0, TRICKSTER: 0 };
  for (const cls of classes) {
    const role = CLASS_ROLES[cls];
    if (role) counts[role]++;
  }
  return counts;
}

export function analyzePartySynergy(classes: string[]): PartySynergy {
  const total = classes.length;
  if (total === 0) return FALLBACK_SYNERGY;

  const c = countRoles(classes);
  const hasL = c.LEADER > 0;
  const hasS = c.SUPPORT > 0;
  const hasB = c.BRAIN > 0;
  const hasT = c.TRICKSTER > 0;

  // 1. 黄金比: 全属性揃い
  if (hasL && hasS && hasB && hasT) {
    return {
      rank: "S",
      name: "黄金陣形",
      nameEn: "Golden Formation",
      color: "#d4af37",
      title: "伝説を創る、隙のない黄金パーティー",
      description: "推進力、癒やし、計算、そしてイレギュラー。RPGにおけるすべての役割が完璧に配置された、奇跡のパーティー編成です。どんな困難なクエストでも軽々とクリアできるでしょう。",
      advantage: {
        label: "完全無欠のオールラウンド陣形",
        text: "推進力、癒やし、計算、イレギュラーへの対応。すべてのパラメーターが高い水準で噛み合っており、どんな状況下でも最適解を叩き出せる圧倒的な総合力を持っています。",
      },
      fatalFlaw: {
        label: "完璧すぎるがゆえの「想定外」への経験不足",
        text: "システムとして完成されすぎているため、全員が自分の役割以外の動き（アドリブ）を苦手とする傾向があります。",
      },
      nextStrategy: {
        label: "Next Strategy",
        text: "陣形はすでに完成しています。現在のバランスを維持したまま、より難易度の高いクエストへ挑戦し、他のギルドにその力を見せつけてください。",
      },
    };
  }

  // 4. 船頭過多: 全員 LEADER
  if (c.LEADER === total) {
    return {
      rank: "C",
      name: "覇権争いの闘技場",
      nameEn: "Power Struggle",
      color: "#f87171",
      title: "全員が船頭。舵のない暴走船。",
      description: "全員が「自分が最前線で指揮を執りたい」ため、パーティーというよりライバル同士の集まりです。強烈なエネルギーに満ちていますが、常に主導権争いが発生するため陣形としては全く機能しません。",
      advantage: {
        label: "全員が主役クラス。極限状態での奇跡的な共闘体制",
        text: "強烈な熱量とエネルギーに満ちています。明確な「共通の敵（巨大な壁）」が外部に存在している間だけは、全滅を免れるために圧倒的な火力を一点集中させることができます。",
      },
      fatalFlaw: {
        label: "平時においては陣形として全く機能しない",
        text: "全員が「自分が最前線で指揮を執りたい」ため、常に内部で主導権争いが発生します。平和な日常の計画においては、全員の意見が衝突して一歩も前に進めません。",
      },
      nextStrategy: {
        label: "Next Strategy",
        text: "この闘技場を鎮めるために、あえて一歩引いて全体を俯瞰する「頭脳（BRAIN）」、または全員を宥める「後衛（SUPPORT）」のストッパーを至急介入させてください。",
      },
    };
  }

  // 5. 永遠の譲り合い: 全員 SUPPORT
  if (c.SUPPORT === total) {
    return {
      rank: "C",
      name: "波風の立たない真空地帯",
      nameEn: "Endless Courtesy",
      color: "#34d399",
      title: "誰も決めない、永遠の譲り合い。",
      description: "メンバー全員が他者の意見を尊重し、裏方に回ろうとする特異な陣形です。「みんなの好きなようにしていいよ」という言葉が飛び交い表立った衝突は起きませんが、誰も決定打を打たないため全く前進しません。",
      advantage: {
        label: "衝突や摩擦が一切起きない、究極の平和",
        text: "メンバー全員が他者の意見を尊重し、裏方に回ろうとするため、誰かが傷つくようなトラブルは発生しません。安心と配慮に満ちた、極めて治安の良い空間です。",
      },
      fatalFlaw: {
        label: "誰も決定打を打たないための、圧倒的な停滞",
        text: "「みんなの好きなようにしていいよ」という言葉が飛び交い、食事の店を決めるだけでも膨大な時間を消費します。波風は立ちませんが、パーティーとしての前進もありません。",
      },
      nextStrategy: {
        label: "Next Strategy",
        text: "この真空地帯を切り裂き、「俺が決める」と強引に引っ張る「前衛（LEADER）」を召喚するか、サイコロを振ってすべての運命を決定してください。",
      },
    };
  }

  // 8. 脳筋の集い: LEADER と TRICKSTER のみ
  if (hasL && hasT && !hasS && !hasB) {
    return {
      rank: "B",
      name: "ブレーキを失った暴走機関車",
      nameEn: "Full Throttle",
      color: "#fb923c",
      title: "考える前に動く、奇跡的な突破力。",
      description: "全員が「とりあえず行こうぜ！」と走り出す、推進力とノリに全振りした陣形です。一緒にいて最高に楽しいですが、誰も後先を考えていないため、高確率で壁に激突して全滅します。",
      advantage: {
        label: "考える前に動く、奇跡的なまでの初速と突破力",
        text: "迷いや躊躇が一切なく、壁があれば迷わずぶっ壊して進む圧倒的なエネルギーに満ちています。短期決戦や飲み会においては、右に出るパーティーは存在しません。",
      },
      fatalFlaw: {
        label: "計画性ゼロ。壁に激突するまで誰も止まらない",
        text: "誰も後先を考えていないため、高確率で崖から転落します。また、防御力が皆無なため、一度のミスでパーティー全体が致命傷を負います。",
      },
      nextStrategy: {
        label: "Next Strategy",
        text: "このパーティーが全滅を免れるには、冷静に手綱を握る「頭脳（BRAIN）」が至急必要です。心当たりのあるメンバーにURLを送り、一刻も早く陣形に組み込んでください。",
      },
    };
  }

  // 9. 平和ボケ: SUPPORT と BRAIN のみ
  if (hasS && hasB && !hasL && !hasT) {
    return {
      rank: "B",
      name: "会議だけして誰も動かない防衛軍",
      nameEn: "Analysis Paralysis",
      color: "#60a5fa",
      title: "完璧な計画と、誰も動かない現実。",
      description: "リスク管理と配慮に満ち溢れた圧倒的に平和な陣形です。完璧な計画と気遣いを展開しますが、全員が「で、誰が最初に突っ込むの？」と牽制し合うため、いつまで経っても物語が始まりません。",
      advantage: {
        label: "鉄壁のリスク管理と、圧倒的な心理的安全性",
        text: "誰も他者を傷つけず、すべてのリスクを事前に洗い出すことができるため、パーティー内の治安は最高レベルに保たれています。",
      },
      fatalFlaw: {
        label: "致命的なまでの「実行力」の欠落",
        text: "全員が「で、誰が最初に突っ込むの？」と牽制し合い、永遠に準備だけを繰り返します。波風は立ちませんが、物語も一生始まりません。",
      },
      nextStrategy: {
        label: "Next Strategy",
        text: "この膠着状態を打破するには、空気を読まずに先陣を切る「前衛（LEADER）」の存在が不可欠です。多少の摩擦を恐れず、引っ張ってくれる特攻隊長を召喚してください。",
      },
    };
  }

  // 10. 冷徹な進軍: LEADER と BRAIN のみ
  if (hasL && hasB && !hasS && !hasT) {
    return {
      rank: "A",
      name: "血の通わない効率化機構",
      nameEn: "Cold Efficiency",
      color: "#818cf8",
      title: "完璧な戦略と、容赦ない実行。",
      description: "完璧な戦略を立てる頭脳と、それを実行に移す前衛のみで構成された、極めて生産性の高い陣形です。ただし「感情」や「癒やし」の概念が存在しないため、長期間の運用には向かず空中分解するリスクを抱えています。",
      advantage: {
        label: "極限まで無駄を省いた、最高速のクエスト攻略",
        text: "完璧な戦略を立てる頭脳と、それを実行に移す前衛のみで構成された、極めて生産性の高い陣形です。プロジェクトや目的を達成するスピードは全パターン中で最速を誇ります。",
      },
      fatalFlaw: {
        label: "感情と癒やしの欠落。突然の空中分解リスク",
        text: "パーティー内に「心」の概念が存在しません。メンバーが疲弊しても誰もケアをしないため、長期間の運用には向かず、ある日突然システムがショートして全滅します。",
      },
      nextStrategy: {
        label: "Next Strategy",
        text: "冷たい機械の歯車に潤滑油を注ぐ「後衛（SUPPORT）」を至急配置し、パーティーの人間性を取り戻してください。",
      },
    };
  }

  // 11. 迷子の集団: SUPPORT と TRICKSTER のみ
  if (hasS && hasT && !hasL && !hasB) {
    return {
      rank: "C",
      name: "終わらないお茶会",
      nameEn: "Endless Tea Party",
      color: "#c084fc",
      title: "居心地は最高。目標は永遠に達成されない。",
      description: "直感で動く自由人と、それを全て許容する後衛で構成された、限りなく優しくルーズな陣形です。誰も他者を強制せず計画も立てないため居心地は最高ですが、目標を達成する能力は著しく欠落しています。",
      advantage: {
        label: "ストレスとは無縁の、限りなく優しくルーズなオアシス",
        text: "直感で動く自由人と、それを全て許容する後衛による空間です。誰も他者を強制しないため、現代社会のあらゆるプレッシャーから解放される居心地の良さがあります。",
      },
      fatalFlaw: {
        label: "推進力と論理性の完全な欠如",
        text: "誰も計画を立てず、誰も実行に移さないため、何かを決断したり目標を達成したりする能力は著しく欠落しています。ただ時間が溶けていくだけの空間です。",
      },
      nextStrategy: {
        label: "Next Strategy",
        text: "この終わらないティータイムに終止符を打つため、無理やりにでも行動を起こす「前衛（LEADER）」か、スケジュールを管理する「頭脳（BRAIN）」を呼んでください。",
      },
    };
  }

  // 7. ワンマン帝国: LEADER 1人 + 残り全員 SUPPORT
  if (c.LEADER === 1 && c.SUPPORT === total - 1) {
    return {
      rank: "A",
      name: "絶対君主と、それに仕えし者たち",
      nameEn: "One-Man Empire",
      color: "#fbbf24",
      title: "意思決定の摩擦ゼロ。完成された組織の究極系。",
      description: "1人の強力なリーダーがすべてを決定し、他のメンバーがそれを完璧にサポートする「組織」として非常に完成された陣形です。ただし、リーダーが道を間違えた瞬間、誰も止めることができずに全員で崖から落ちるリスクがあります。",
      advantage: {
        label: "意思決定の摩擦ゼロ。完成された組織の究極系",
        text: "1人の強力なリーダーがすべてを決定し、他のメンバーがそれを完璧にサポートします。トップダウンによる進行が極めてスムーズで、実行までのスピードが異常に速いです。",
      },
      fatalFlaw: {
        label: "ストッパー不在による、集団自決のリスク",
        text: "リーダーが道を間違えた瞬間、誰も異議を唱えたり止めることができず、全員で一緒に崖から落ちていく致命的なリスクを秘めています。",
      },
      nextStrategy: {
        label: "Next Strategy",
        text: "健全なバランスを保つため、リーダーを恐れずに唯一意見できる「自由（TRICKSTER）」を引き入れ、帝国に新しい風穴を開けてください。",
      },
    };
  }

  // 6. カオス: TRICKSTER が50%超
  if (c.TRICKSTER / total > 0.5) {
    return {
      rank: "D",
      name: "それぞれが別のゲームをしている無法地帯",
      nameEn: "Beautiful Chaos",
      color: "#a78bfa",
      title: "統率ゼロ。それぞれが別の方向へ。",
      description: "まともな陣形が一切組めていません。全員が自分の直感と気分だけで動いているため目的を達成する確率は極めて低いです。しかし予測不能な化学反応が起き続けるため、一緒にいて一番退屈しない組み合わせでもあります。",
      advantage: {
        label: "常識にとらわれない、奇跡的なアイデアの温床",
        text: "予測不能な化学反応が起き続けるため、一緒にいて一番「退屈しない」組み合わせです。ルールがないため、時として誰も思いつかないような大発明を生み出します。",
      },
      fatalFlaw: {
        label: "目的を達成する確率が極めて低い、崩壊したシステム",
        text: "全員が自分の直感と気分だけで動いているため、待ち合わせには遅刻し、話題は1分ごとに変わります。集団としての統制は完全に取れていません。",
      },
      nextStrategy: {
        label: "Next Strategy",
        text: "この動物園をまとめ上げるには、すべてを受け入れてくれる「後衛（SUPPORT）」の慈愛か、彼らを論理で縛り付ける「頭脳（BRAIN）」の檻が必要です。",
      },
    };
  }

  // 2. 燃え尽き症候群: SUPPORT 0 + 他3属性あり
  if (!hasS && hasL && hasB && hasT) {
    return {
      rank: "B",
      name: "崩壊寸前のハイパフォーマンス",
      nameEn: "Burnout Formation",
      color: "#f97316",
      title: "最高の結果と、迫り来る燃え尽き。",
      description: "推進力、戦略、アイデアは完璧に揃っていますが、「防御・回復」の役割だけがスッポリと抜け落ちています。短期的には圧倒的な成果を上げますが、常に誰かが限界を迎えて離脱するハイリスクな陣形です。",
      advantage: {
        label: "無駄を削ぎ落とした、圧倒的な成果創出スピード",
        text: "目的を達成するための戦略と推進力が完璧に直結しており、短期間で恐ろしいほどの成果を叩き出します。",
      },
      fatalFlaw: {
        label: "防御力ゼロ。蓄積し続ける見えないダメージ",
        text: "メンバーの誰も「他者のフォロー」や「メンタルケア」を行わないため、全員のHPが静かに削られ続けています。突然パーティーが空中分解するリスクと常に隣り合わせです。",
      },
      nextStrategy: {
        label: "Next Strategy",
        text: "至急「休む」というコマンドを選択するか、すべてを受け入れて回復してくれる「後衛（SUPPORT）」のクラスを招集し、野戦病院を設営してください。",
      },
    };
  }

  // 3. 予定調和: TRICKSTER 0 + 他3属性あり
  if (!hasT && hasL && hasS && hasB) {
    return {
      rank: "A",
      name: "マニュアル通りの優等生",
      nameEn: "By The Book",
      color: "#4ade80",
      title: "完璧な優等生と、想定外への脆さ。",
      description: "前衛の行動力、後衛の安定感、頭脳の計画性が揃った、非常に優秀で堅実な陣形です。しかしパーティーに「カオス（想定外）」をもたらす存在がいないため、前例のない危機的状況に直面した際、脆くも崩れ去る弱点を持っています。",
      advantage: {
        label: "想定内のクエストに対する、無類の安定感と突破力",
        text: "前衛の行動力、後衛の安定感、頭脳の計画性が揃った非常に優秀で堅実な陣形です。既存のルールや枠組みの中であれば、常に80点以上のハイスコアを叩き出します。",
      },
      fatalFlaw: {
        label: "マニュアル外のバグ（カオス）に対する脆弱性",
        text: "パーティーに「想定外」をもたらすイレギュラーが存在しないため、発想がスケールしません。前例のない危機的状況に直面した際、思考がフリーズして脆くも崩れ去ります。",
      },
      nextStrategy: {
        label: "Next Strategy",
        text: "この小さくまとまった枠組みを破壊し、盤面をかき回すイレギュラー「自由（TRICKSTER）」を投入し、パーティーの許容範囲を強制拡張してください。",
      },
    };
  }

  return FALLBACK_SYNERGY;
}

const FALLBACK_SYNERGY: PartySynergy = {
  rank: "B",
  name: "個性派集団",
  nameEn: "Unique Squad",
  color: "#94a3b8",
  title: "型破りな編成の、未知なる可能性。",
  description: "既存のどのパターンにも当てはまらない、珍しい編成です。それぞれの個性が予測不能な化学反応を起こし、固定概念を超えた結果をもたらす可能性を秘めています。",
  advantage: {
    label: "型にはまらない、予測不能な化学反応",
    text: "既存のパターンを超えた独自の動きができます。それぞれの個性が掛け合わさることで、誰も予測できなかった突破口を開く可能性を秘めています。",
  },
  fatalFlaw: {
    label: "役割分担が不明確で、連携が取りにくい",
    text: "お互いの強みと弱みの把握が難しく、いざという時に誰が何をすべきかが分からなくなりがちです。",
  },
  nextStrategy: {
    label: "Next Strategy",
    text: "まずはお互いのRPGクラスと役割を把握することから始めましょう。それぞれの「得意なこと」を言語化することで、このパーティーは急速に強くなります。",
  },
};
