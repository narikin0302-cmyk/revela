// ============================================================
// RPG Classes — 16 types (1:1 MBTI mapping)
// ============================================================

export interface RpgClass {
  id: string;
  mbtiType: string;       // single MBTI type
  name: string;
  nameEn: string;
  emoji: string;
  color: string;
  rank: "SSR" | "SR" | "R";
  tagline: string;
  desc: string;
  strengths: string[];
  career: string[];
}

export const RPG_CLASSES: RpgClass[] = [
  {
    id: "overlord",
    mbtiType: "ENTJ",
    name: "覇王",
    nameEn: "Overlord",
    emoji: "👑",
    color: "#6d28d9",
    rank: "SSR",
    tagline: "圧倒的な意志で世界を塗り替える者",
    desc: "生まれながらの支配者。ビジョンを掲げ、あらゆる障害を力で突破する。その圧倒的なカリスマと決断力で、組織を最速で目標へ導く絶対的なリーダー。",
    strengths: ["決断力", "戦略思考", "カリスマ", "行動力"],
    career: ["経営者・CEO", "戦略コンサルタント", "政治家・起業家"],
  },
  {
    id: "sage",
    mbtiType: "INTJ",
    name: "賢者",
    nameEn: "Sage",
    emoji: "🔮",
    color: "#7c3aed",
    rank: "SSR",
    tagline: "未知を照らす叡智の探究者",
    desc: "あらゆる情報を統合し、長期的な戦略で組織を動かす。言葉少なくとも、その洞察は場の方向を決定する。知識と論理で世界を設計する最高位の知性。",
    strengths: ["戦略思考", "分析力", "長期ビジョン", "システム設計"],
    career: ["経営戦略・研究者", "データサイエンティスト", "プロダクトマネージャー"],
  },
  {
    id: "trickster",
    mbtiType: "ENTP",
    name: "奇術師",
    nameEn: "Trickster",
    emoji: "🃏",
    color: "#a78bfa",
    rank: "SR",
    tagline: "常識を裏切り、盤面をかき回す革命者",
    desc: "誰も思いつかない角度から問題に切り込み、議論と実験で常識を解体する。神出鬼没のアイデアと論理で、あらゆる固定観念を軽やかに打ち砕くトリックスター。",
    strengths: ["革新的思考", "論理的説得力", "多角的視点", "議論力"],
    career: ["起業家・イノベーター", "エンジニア・研究開発", "コンサルタント"],
  },
  {
    id: "alchemist",
    mbtiType: "INTP",
    name: "錬金術師",
    nameEn: "Alchemist",
    emoji: "⚗️",
    color: "#8b5cf6",
    rank: "SR",
    tagline: "知識と試行錯誤でゼロから黄金を創る者",
    desc: "「なぜ？」を問い続け、誰も見えていなかった答えを見つける。確かな理論と果てしない試行錯誤で、ゼロから黄金の価値を練り上げる深淵の探究者。",
    strengths: ["分析力", "論理的思考", "独創性", "探究心"],
    career: ["研究者・サイエンティスト", "システムアーキテクト", "哲学者・理論家"],
  },
  {
    id: "prophet",
    mbtiType: "INFJ",
    name: "予言者",
    nameEn: "Prophet",
    emoji: "🌌",
    color: "#059669",
    rank: "SSR",
    tagline: "魂の声で人々を導く者",
    desc: "人の心の奥深くを感じ取る稀有な力を持つ。静かに、しかし確実に人々の変革を後押しし、社会の本質を見通す真のビジョナリー。",
    strengths: ["洞察力", "共感力", "使命感", "長期ビジョン"],
    career: ["カウンセラー・心理士", "教育者・コーチ", "UXデザイナー・作家"],
  },
  {
    id: "bard",
    mbtiType: "INFP",
    name: "吟遊詩人",
    nameEn: "Bard",
    emoji: "🎭",
    color: "#10b981",
    rank: "SR",
    tagline: "魂の表現で世界に色を与える者",
    desc: "豊かな感情と独自の価値観から、人の心に届くものを生み出す。表面的な成功より「本当に意味のある仕事」を追い求め続ける創造の魂。",
    strengths: ["創造力", "共感力", "誠実さ", "独自の世界観"],
    career: ["ライター・クリエイター", "デザイナー・音楽家", "ソーシャルワーカー"],
  },
  {
    id: "paladin",
    mbtiType: "ENFJ",
    name: "聖騎士",
    nameEn: "Paladin",
    emoji: "⚔️",
    color: "#047857",
    rank: "SR",
    tagline: "人々を鼓舞し、共に高みへ導く者",
    desc: "人の可能性を見抜き、最大限に引き出すことを喜びとする天性のリーダー。チームの調和を保ちながら、明確なビジョンへ全員を牽引する。",
    strengths: ["リーダーシップ", "共感力", "コミュニケーション力", "人材育成"],
    career: ["マネージャー・HR", "コーチ・ファシリテーター", "営業リーダー"],
  },
  {
    id: "adventurer",
    mbtiType: "ENFP",
    name: "冒険者",
    nameEn: "Adventurer",
    emoji: "🌟",
    color: "#34d399",
    rank: "R",
    tagline: "情熱と可能性で世界を染める者",
    desc: "常に新しい可能性を探し、人々を巻き込んで夢を形にしていく。どんな状況でも熱意と明るさで周囲を元気にする、チームの太陽的存在。",
    strengths: ["発想力", "情熱", "コミュニケーション", "適応力"],
    career: ["マーケター・企画", "起業家", "クリエイティブディレクター"],
  },
  {
    id: "knight",
    mbtiType: "ISTJ",
    name: "騎士団長",
    nameEn: "Knight Commander",
    emoji: "🛡️",
    color: "#1d4ed8",
    rank: "SR",
    tagline: "秩序と誠実で組織を守る柱の者",
    desc: "責任感と信頼性の塊。ルールと手順を大切にし、約束は必ず守る。チームや組織の「根幹」として、安定した結果を出し続ける存在。",
    strengths: ["信頼性", "組織力", "実行力", "責任感"],
    career: ["プロジェクトマネージャー", "品質管理・監査", "行政職"],
  },
  {
    id: "commander",
    mbtiType: "ESTJ",
    name: "執行官",
    nameEn: "Commander",
    emoji: "⚖️",
    color: "#1e40af",
    rank: "SR",
    tagline: "正義と効率で組織を統べる鉄の意志",
    desc: "私情を一切挟まず、完璧な実務とロジックで組織の秩序を絶対的に守り抜く。強い責任感と実行力で、決めたことを必ずやり遂げる組織の鉄柱。",
    strengths: ["実行力", "組織管理", "論理的判断", "責任感"],
    career: ["マネージャー・管理職", "会計士・法務", "行政官・経営幹部"],
  },
  {
    id: "cleric",
    mbtiType: "ISFJ",
    name: "聖職者",
    nameEn: "Cleric",
    emoji: "✨",
    color: "#2563eb",
    rank: "R",
    tagline: "献身と調和でチームを守る守護者",
    desc: "他者のために動くことを喜びとする、組織の「縁の下の力持ち」。細やかな気配りと強い責任感で、周囲の人を支え続ける。",
    strengths: ["気配り", "協調性", "実務能力", "共感力"],
    career: ["看護師・医療職", "教師・カスタマーサポート", "人事・総務"],
  },
  {
    id: "guildmaster",
    mbtiType: "ESFJ",
    name: "ギルドマスター",
    nameEn: "Guild Master",
    emoji: "🏰",
    color: "#0891b2",
    rank: "R",
    tagline: "絆と調和でコミュニティを築く者",
    desc: "その明るさと包容力で誰もが惹きつけられる、コミュニティの絶対的中心。確かな実務能力と安定感で、誰もが安心して帰ってこられる居場所を築く。",
    strengths: ["社交性", "協調性", "実務能力", "包容力"],
    career: ["人事・コミュニティマネージャー", "医療・福祉職", "教師・営業"],
  },
  {
    id: "assassin",
    mbtiType: "ISTP",
    name: "影の刺客",
    nameEn: "Shadow Assassin",
    emoji: "🗡️",
    color: "#92400e",
    rank: "SR",
    tagline: "冷静な技術と判断力で問題を解決する者",
    desc: "理論より行動、話すより手を動かすことで結果を出す実践的な技術者。危機的状況でも冷静で、最短経路で問題を解決する現場のエース。",
    strengths: ["技術力", "冷静な判断", "実行力", "危機対応"],
    career: ["エンジニア・外科医", "パイロット・システム管理者", "現場スペシャリスト"],
  },
  {
    id: "ranger",
    mbtiType: "ISFP",
    name: "森の狩人",
    nameEn: "Forest Ranger",
    emoji: "🌿",
    color: "#d97706",
    rank: "R",
    tagline: "感性と自由で自分らしい道を歩む者",
    desc: "美しいもの、本物のものに強く惹かれ、自分のペースで深い仕事をする感性豊かなアーティスト。静かに、しかし確実に独自の価値を生み出す。",
    strengths: ["美的センス", "柔軟性", "共感力", "独自のスタイル"],
    career: ["グラフィックデザイナー・フォトグラファー", "料理人・アーティスト", "クラフトマン"],
  },
  {
    id: "pirate",
    mbtiType: "ESTP",
    name: "海賊王",
    nameEn: "Pirate King",
    emoji: "⚓",
    color: "#b45309",
    rank: "SR",
    tagline: "機動力と度胸で荒波を乗り越える者",
    desc: "考えるより先に動き、現場で結果を出す行動の人。リスクを恐れず、スピード感ある意思決定で周囲を引っ張る「修羅場のスター」。",
    strengths: ["行動力", "度胸", "現場対応", "説得力"],
    career: ["トップ営業・起業家", "トレーダー・スポーツ選手", "現場リーダー"],
  },
  {
    id: "dancer",
    mbtiType: "ESFP",
    name: "星の踊り子",
    nameEn: "Star Dancer",
    emoji: "💃",
    color: "#f59e0b",
    rank: "R",
    tagline: "輝く存在感で場を満たす光の使者",
    desc: "いるだけで場が明るくなる存在。人を楽しませること、その瞬間を最高にすることに全力を注ぐ。柔軟で社交的なエンターテインメントの申し子。",
    strengths: ["明るさ", "社交性", "即興力", "共感力"],
    career: ["エンターテイナー・PRプランナー", "ホテリエ・SNSインフルエンサー", "接客・イベント"],
  },
];

// ============================================================
// Synergy: RPG class × zodiac element → 称号 + 解説
// ============================================================

export interface RpgSynergy {
  synergyName: string;
  synergyDesc: string;
}

// key: "クラス名_元素" (e.g. "覇王_火" / "賢者_水")
const SYNERGY_MAP: Record<string, RpgSynergy> = {
  "覇王_火": { synergyName: "爆炎の覇王", synergyDesc: "圧倒的な熱量と行動力で全てを巻き込み、群衆を熱狂させるカリスマ的な支配者。" },
  "覇王_土": { synergyName: "鋼鉄の覇王", synergyDesc: "揺るがぬ現実感覚と強固な基盤で、決して崩れることのない絶対的な帝国を築く。" },
  "覇王_風": { synergyName: "嵐の覇王", synergyDesc: "自由な発想と圧倒的なスピードで時代の風を読み、最前線を駆け抜ける変革の王。" },
  "覇王_水": { synergyName: "深淵の覇王", synergyDesc: "深い感情理解で人の心を掌握し、静かに、しかし確実に全てを裏から統べる王。" },
  "賢者_火": { synergyName: "業火の賢者", synergyDesc: "情熱的な探究心で、停滞した世界に革新の火を放つアグレッシブなマスターマインド。" },
  "賢者_土": { synergyName: "大地の賢者", synergyDesc: "膨大なデータと揺るがぬロジックで、鉄壁の戦略を練り上げる究極の参謀。" },
  "賢者_風": { synergyName: "天空の賢者", synergyDesc: "あらゆる情報網を駆使し、軽やかに常識を覆す最適解を導き出す知将。" },
  "賢者_水": { synergyName: "深海の賢者", synergyDesc: "人の心の機微すらも計算に入れ、静かなる洞察で未来を見通すミステリアスな頭脳。" },
  "奇術師_火": { synergyName: "閃光の奇術師", synergyDesc: "直感の赴くままに盤面をかき回し、一瞬の閃きで大逆転を狙う天才ジョーカー。" },
  "奇術師_土": { synergyName: "砂漠の奇術師", synergyDesc: "奇抜に見えて実は緻密な計算に裏打ちされた、絶対に負けないゲームメイクの達人。" },
  "奇術師_風": { synergyName: "幻影の奇術師", synergyDesc: "誰にも縛られない自由な精神で、あらゆる状況をハックする神出鬼没のトリックスター。" },
  "奇術師_水": { synergyName: "霧の奇術師", synergyDesc: "相手の感情の隙間に入り込み、気づけば自分のペースに巻き込んでいる魔術師。" },
  "錬金術師_火": { synergyName: "紅蓮の錬金術師", synergyDesc: "熱い知的好奇心でタブーを恐れず、誰も見たことのない発明を生み出す創生者。" },
  "錬金術師_土": { synergyName: "鉱石の錬金術師", synergyDesc: "確かな理論と果てしない試行錯誤で、ゼロから黄金の価値を練り上げる探究者。" },
  "錬金術師_風": { synergyName: "天雷の錬金術師", synergyDesc: "異なる知識を瞬時に掛け合わせ、雷のようなインスピレーションで最適解を導く。" },
  "錬金術師_水": { synergyName: "蒼波の錬金術師", synergyDesc: "冷徹な分析の中に深い洞察を隠し持ち、世界の真理を静かに解き明かす異端児。" },
  "聖騎士_火": { synergyName: "太陽の聖騎士", synergyDesc: "燃えるような正義感で先陣を切り、その背中で仲間を鼓舞し続ける絶対的な光。" },
  "聖騎士_土": { synergyName: "城塞の聖騎士", synergyDesc: "どんな困難にも揺るがず、仲間のために自らが最強の盾となる頼れるリーダー。" },
  "聖騎士_風": { synergyName: "疾風の聖騎士", synergyDesc: "状況に応じて柔軟に立ち回り、風のように素早く仲間を救い出す戦場の希望。" },
  "聖騎士_水": { synergyName: "聖泉の聖騎士", synergyDesc: "圧倒的な包容力と共感で仲間の痛みを分かち合い、共に歩む心優しき騎士。" },
  "予言者_火": { synergyName: "星火の予言者", synergyDesc: "強い使命感で人々の心に火を灯し、理想の未来へ向けて力強く導く先導者。" },
  "予言者_土": { synergyName: "巨石の予言者", synergyDesc: "現実的な視点と神秘の力を融合させ、確かな足取りで未来を切り拓く導き手。" },
  "予言者_風": { synergyName: "星辰の予言者", synergyDesc: "宇宙の真理を風のように感じ取り、自由な解釈で人々の固定観念を解き放つ。" },
  "予言者_水": { synergyName: "月鏡の予言者", synergyDesc: "相手の魂の奥底を鏡のように写し出し、言葉を超えた深い癒しをもたらす神秘の眼。" },
  "冒険者_火": { synergyName: "勇者の冒険者", synergyDesc: "燃え盛る情熱で未知の世界へ飛び込み、数々の奇跡を起こす生粋の主人公。" },
  "冒険者_土": { synergyName: "開拓の冒険者", synergyDesc: "夢を語るだけでなく、自らの手で確かな地図を描きながら進む現実的なチャレンジャー。" },
  "冒険者_風": { synergyName: "風来の冒険者", synergyDesc: "縛られることを嫌い、好奇心の赴くままに世界を渡り歩く自由な旅人。" },
  "冒険者_水": { synergyName: "星海の冒険者", synergyDesc: "出会う人々の心に寄り添い、絆を深めながらエモーショナルな旅を続ける主人公。" },
  "吟遊詩人_火": { synergyName: "情熱の吟遊詩人", synergyDesc: "魂の底から湧き上がる衝動を表現し、人々の心を激しく揺さぶるアーティスト。" },
  "吟遊詩人_土": { synergyName: "大樹の吟遊詩人", synergyDesc: "日常の何気ない美しさをすくい上げ、人々の心に根付く普遍的な愛を紡ぐ者。" },
  "吟遊詩人_風": { synergyName: "自由の吟遊詩人", synergyDesc: "特定の価値観に縛られず、風に乗せて軽やかに愛と希望のメッセージを届ける。" },
  "吟遊詩人_水": { synergyName: "涙の吟遊詩人", synergyDesc: "深い悲しみや痛みに寄り添い、それを美しい芸術へと昇華させる癒しの歌い手。" },
  "執行官_火": { synergyName: "烈火の執行官", synergyDesc: "正義のためには妥協を許さず、熱い信念を持ってルールを徹底する熱血の法。" },
  "執行官_土": { synergyName: "鉄壁の執行官", synergyDesc: "私情を一切挟まず、完璧な実務とロジックで組織の秩序を絶対的に守り抜く盾。" },
  "執行官_風": { synergyName: "天秤の執行官", synergyDesc: "常に客観的で公平な視点を持ち、状況に応じた柔軟な最適解を裁定する裁判官。" },
  "執行官_水": { synergyName: "氷華の執行官", synergyDesc: "冷徹な判断を下す一方で、裏には組織への深い愛情と守るべき信念を秘めた執行者。" },
  "騎士団長_火": { synergyName: "獅子の騎士団長", synergyDesc: "圧倒的なリーダーシップと行動力で、最前線で組織を引っ張る熱き大黒柱。" },
  "騎士団長_土": { synergyName: "磐石の騎士団長", synergyDesc: "絶対に裏切らない誠実さと責任感で、組織の根幹を支える最も信頼できる防壁。" },
  "騎士団長_風": { synergyName: "蒼穹の騎士団長", synergyDesc: "伝統を守りつつも新しい風を柔軟に取り入れ、組織をより高みへと導く司令塔。" },
  "騎士団長_水": { synergyName: "慈雨の騎士団長", synergyDesc: "厳しさの中に深い愛情を持ち、部下を家族のように守り抜く心優しきリーダー。" },
  "ギルドマスター_火": { synergyName: "太陽のギルドマスター", synergyDesc: "その明るさと熱量で誰もが惹きつけられる、コミュニティの絶対的中心。" },
  "ギルドマスター_土": { synergyName: "豊穣のギルドマスター", synergyDesc: "確かな実務能力と安定感で、誰もが安心して帰ってこられる居場所を築く。" },
  "ギルドマスター_風": { synergyName: "交差点のギルドマスター", synergyDesc: "あらゆる垣根を越えて人と人を繋ぎ、無限のネットワークを広げる達人。" },
  "ギルドマスター_水": { synergyName: "母なるギルドマスター", synergyDesc: "海のような包容力で仲間の傷を癒し、絆を何よりも大切にする心の拠り所。" },
  "聖職者_火": { synergyName: "灯火の聖職者", synergyDesc: "自らの身を削ってでも他者を救おうとする、情熱的で無償の愛を持つヒーラー。" },
  "聖職者_土": { synergyName: "大地の聖職者", synergyDesc: "日常の細やかなサポートを欠かさず、実務と気配りで仲間を支え続ける縁の下の力持ち。" },
  "聖職者_風": { synergyName: "そよ風の聖職者", synergyDesc: "重苦しい空気を軽やかに払い、そこにいるだけで場を和ませるナチュラルな癒し手。" },
  "聖職者_水": { synergyName: "慈愛の聖職者", synergyDesc: "他者の痛みを自分のことのように感じ取り、究極の共感力で傷を癒す最高峰のヒーラー。" },
  "海賊王_火": { synergyName: "爆走の海賊王", synergyDesc: "考えるより先に体が動き、圧倒的な度胸で誰よりも早くお宝（結果）を掻っ攫う。" },
  "海賊王_土": { synergyName: "不屈の海賊王", synergyDesc: "一度狙った獲物は絶対に逃がさず、どんな修羅場でも確実に生き残るしぶとい勝負師。" },
  "海賊王_風": { synergyName: "竜巻の海賊王", synergyDesc: "状況を瞬時に読み取り、誰も予測できないルートで最速のゴールを決める風雲児。" },
  "海賊王_水": { synergyName: "魅惑の海賊王", synergyDesc: "荒々しさの中に不思議な色気を持ち、気づけば周囲を自分の船に乗せているカリスマ。" },
  "影の刺客_火": { synergyName: "業火の刺客", synergyDesc: "普段は冷静沈着だが、一度スイッチが入ると爆発的な戦闘力でターゲットを仕留める。" },
  "影の刺客_土": { synergyName: "黒曜石の刺客", synergyDesc: "一切の感情を排し、ミスのない完璧な技術で確実に任務を遂行するプロフェッショナル。" },
  "影の刺客_風": { synergyName: "旋風の刺客", synergyDesc: "気配を消して現れ、疾風のごとく仕事を終わらせて去っていくスタイリッシュな職人。" },
  "影の刺客_水": { synergyName: "氷刃の刺客", synergyDesc: "相手の思考や感情を読み切り、最も効果的な一撃を静かに急所に撃ち込むスナイパー。" },
  "星の踊り子_火": { synergyName: "太陽の踊り子", synergyDesc: "爆発的なエネルギーと派手なパフォーマンスで、一瞬で全ての視線を釘付けにする。" },
  "星の踊り子_土": { synergyName: "宝石の踊り子", synergyDesc: "天性の華やかさに加えてブレない芯を持ち、確かな実力で魅了し続けるエンターテイナー。" },
  "星の踊り子_風": { synergyName: "流星の踊り子", synergyDesc: "誰にも予測できないステップで軽やかに場を沸かせ、常に新鮮な驚きを提供する。" },
  "星の踊り子_水": { synergyName: "月夜の踊り子", synergyDesc: "見る者の感情を揺さぶるエモーショナルな表現力で、神秘的な魅力に引き込むスター。" },
  "森の狩人_火": { synergyName: "陽だまりの狩人", synergyDesc: "自分の好きなことには全力で情熱を注ぎ、独自の世界観で周囲を魅了するアーティスト。" },
  "森の狩人_土": { synergyName: "琥珀の狩人", synergyDesc: "職人のようなこだわりと美学を持ち、長い時間をかけて本物の価値を創り上げる。" },
  "森の狩人_風": { synergyName: "木漏れ日の狩人", synergyDesc: "枠に囚われず自由なインスピレーションをキャッチし、軽やかに作品を生み出す。" },
  "森の狩人_水": { synergyName: "朝露の狩人", synergyDesc: "繊細な感性で世界の美しさを捉え、静かに、しかし深く心に刺さる矢（価値）を放つ。" },
};

export function getRpgClass(mbti: string): RpgClass | null {
  return RPG_CLASSES.find((c) => c.mbtiType === mbti) ?? null;
}

export function getRpgSynergy(className: string, element: string): RpgSynergy | null {
  return SYNERGY_MAP[`${className}_${element}`] ?? null;
}

// ============================================================
// 256-combo lookup: MBTI × LoveType → RPG class
// Latin-square distribution — each class appears exactly 16 times
// When loveType = LCRO, each MBTI gets their "natural" class
// ============================================================

const _MBTI_IDX: Record<string, number> = {
  ENTJ:0, INTJ:1, ENTP:2, INTP:3,
  INFJ:4, INFP:5, ENFJ:6, ENFP:7,
  ISTJ:8, ESTJ:9, ISFJ:10, ESFJ:11,
  ISTP:12, ISFP:13, ESTP:14, ESFP:15,
};

const _LOVE_IDX: Record<string, number> = {
  ALRF:0, ALRP:1, ALVF:2, ALVP:3,
  AERF:4, AERP:5, AEVF:6, AEVP:7,
  SLRF:8, SLRP:9, SLVF:10, SLVP:11,
  SERF:12, SERP:13, SEVF:14, SEVP:15,
  // legacy codes (pre-rename migration)
  LCRO:0, LCRE:1, LCPO:2, LCPE:3,
  LARO:4, LARE:5, LAPO:6, LAPE:7,
  FCRO:8, FCRE:9, FCPO:10, FCPE:11,
  FARO:12, FARE:13, FAPO:14, FAPE:15,
};

export function getRpgClassByCombo(mbti: string, loveType: string): RpgClass | null {
  const m = _MBTI_IDX[mbti];
  const l = _LOVE_IDX[loveType];
  if (m === undefined || l === undefined) return getRpgClass(mbti);
  return RPG_CLASSES[(m + l) % 16];
}
