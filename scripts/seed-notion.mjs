/**
 * Notion Blog Seeder
 * 36記事を一括作成: 16タイプ特徴+仕事 / 16タイプラブ / 4RPGロール
 */

import { Client } from "@notionhq/client";

const notion = new Client({ auth: "process.env.NOTION_API_KEY" });
const DB_ID = "331f9aba91e3804aa3dcddbd34b79c65";

// ── MBTI 定義 ────────────────────────────────────────────
const MBTI_TYPES = [
  { type: "INTJ", name: "建築家", group: "分析家", color: "紫" },
  { type: "INTP", name: "論理学者", group: "分析家", color: "紫" },
  { type: "ENTJ", name: "指揮官", group: "分析家", color: "紫" },
  { type: "ENTP", name: "討論者", group: "分析家", color: "紫" },
  { type: "INFJ", name: "提唱者", group: "外交官", color: "緑" },
  { type: "INFP", name: "仲介者", group: "外交官", color: "緑" },
  { type: "ENFJ", name: "主人公", group: "外交官", color: "緑" },
  { type: "ENFP", name: "広報運動家", group: "外交官", color: "緑" },
  { type: "ISTJ", name: "管理者", group: "番人", color: "青" },
  { type: "ISFJ", name: "擁護者", group: "番人", color: "青" },
  { type: "ESTJ", name: "幹部", group: "番人", color: "青" },
  { type: "ESFJ", name: "領事", group: "番人", color: "青" },
  { type: "ISTP", name: "巨匠", group: "探検家", color: "茶" },
  { type: "ISFP", name: "冒険家", group: "探検家", color: "茶" },
  { type: "ESTP", name: "起業家", group: "探検家", color: "茶" },
  { type: "ESFP", name: "エンターテイナー", group: "探検家", color: "茶" },
];

// ── タイプ別詳細データ ────────────────────────────────────
const MBTI_DATA = {
  INTJ: {
    strengths: ["戦略的思考", "長期ビジョン", "高い自立心", "完璧主義", "知的好奇心"],
    weaknesses: ["感情的距離感", "批判的すぎる傾向", "コミュニケーションの難しさ", "完璧主義による遅延"],
    jobs: ["戦略コンサルタント・経営企画", "ソフトウェアエンジニア・アーキテクト", "科学者・研究者", "医師・弁護士（専門職）", "起業家・経営者", "プロジェクトマネージャー", "データサイエンティスト", "投資家・ファンドマネージャー", "大学教授・学術研究者", "製品開発・イノベーター"],
    loveStyle: "知的つながりを重視し、表面的な付き合いを好まない。感情表現は苦手だが、信頼を築くと非常に誠実。",
    loveStrengths: ["誠実さ・一途さ", "知的対話の充実", "安定した関係の構築", "パートナーの成長を支援"],
    loveChallenges: ["感情表現が少ない", "批判的になりすぎる", "自分の世界に閉じこもりがち"],
    bestMatch: "ENFP・ENTP",
    famousPeople: "イーロン・マスク、マーク・ザッカーバーグ、クリストファー・ノーラン",
  },
  INTP: {
    strengths: ["深い論理的思考", "独創的なアイデア", "客観的な分析力", "柔軟な思考", "探究心"],
    weaknesses: ["優柔不断になりがち", "感情表現が苦手", "ルーティン作業が苦手", "社交的な場が疲れやすい"],
    jobs: ["研究者・科学者", "ソフトウェア開発者・プログラマー", "哲学者・理論家", "大学教授・学術者", "システムアーキテクト", "数学者・統計学者", "テクニカルライター", "ゲームデザイナー", "AIエンジニア・機械学習研究者", "分析家・エコノミスト"],
    loveStyle: "知的刺激を求め、パートナーとの深い議論を楽しむ。感情より論理で関係を捉えがち。",
    loveStrengths: ["知的対話・議論の深さ", "束縛しない自由な関係", "誠実さ", "ユニークな視点でのアドバイス"],
    loveChallenges: ["感情的サポートが薄い", "関係を「分析」しすぎる", "社交イベントが苦手"],
    bestMatch: "ENTJ・ENFJ",
    famousPeople: "アルバート・アインシュタイン、ビル・ゲイツ、チャールズ・ダーウィン",
  },
  ENTJ: {
    strengths: ["強いリーダーシップ", "戦略的な意思決定", "高い目標設定力", "効率的な実行力", "カリスマ性"],
    weaknesses: ["他者の感情への配慮不足", "支配的になりすぎる", "完璧主義によるストレス", "批判的な物言い"],
    jobs: ["経営者・CEO", "戦略コンサルタント", "政治家・官僚", "弁護士・裁判官", "起業家", "投資銀行家", "軍人・防衛系リーダー", "大学学長・教育機関長", "スポーツ監督・コーチ", "プロダクトマネージャー"],
    loveStyle: "関係においても目標と効率を重視。パートナーに強さと独立性を求める。",
    loveStrengths: ["強いリード力・頼れる存在", "共に成長できる関係", "明確なコミュニケーション", "安定した生活基盤の提供"],
    loveChallenges: ["支配的になりすぎることがある", "感情より理論で話す", "余裕がないと冷たく見える"],
    bestMatch: "INFP・INTP",
    famousPeople: "スティーブ・ジョブズ、マーガレット・サッチャー、ジャック・ウェルチ",
  },
  ENTP: {
    strengths: ["創造的な問題解決", "優れた議論力", "革新的思考", "多角的な視点", "知的な柔軟性"],
    weaknesses: ["物事を完成させるのが苦手", "議論好きで対立を生む", "ルールや権威への反発", "飽きやすい"],
    jobs: ["起業家・スタートアップ創業者", "弁護士・議員", "コンサルタント", "マーケター・コピーライター", "エンジニア・研究者", "プロダクトデザイナー", "ジャーナリスト・評論家", "俳優・コメディアン", "イノベーター・発明家", "ベンチャーキャピタリスト"],
    loveStyle: "知的刺激と新鮮さを求める。パートナーとの議論や新しい体験を重視する。",
    loveStrengths: ["会話が尽きない刺激的な関係", "柔軟でユーモアがある", "パートナーの可能性を引き出す", "自由で束縛しない"],
    loveChallenges: ["議論で傷つけることがある", "感情的なサポートが薄い", "集中力が続かない"],
    bestMatch: "INFJ・INTJ",
    famousPeople: "マーク・トウェイン、トーマス・エジソン、レオナルド・ダ・ヴィンチ",
  },
  INFJ: {
    strengths: ["深い洞察力", "強い共感力", "長期ビジョン", "誠実さ・誠意", "創造性"],
    weaknesses: ["燃え尽き症候群になりやすい", "完璧主義", "批判に敏感", "人間関係で消耗しやすい"],
    jobs: ["カウンセラー・心理士", "作家・詩人", "教師・教育者", "社会活動家・NPOスタッフ", "UXデザイナー", "医師・看護師", "人事・コーチング", "ソーシャルワーカー", "聖職者・宗教家", "研究者（社会科学系）"],
    loveStyle: "深い精神的つながりを求める。表面的な関係ではなく、魂レベルでの共鳴を大切にする。",
    loveStrengths: ["深い理解と共感", "一途で献身的", "パートナーの成長を応援", "精神的な安定感"],
    loveChallenges: ["理想が高くギャップで傷つく", "自分を犠牲にしすぎる", "感情を内に溜め込む"],
    bestMatch: "ENFP・ENTP",
    famousPeople: "マーティン・ルーサー・キング、ネルソン・マンデラ、J.K.ローリング",
  },
  INFP: {
    strengths: ["豊かな感情・共感力", "強い価値観・信念", "創造性・芸術性", "献身的な姿勢", "適応力"],
    weaknesses: ["現実的でないことがある", "批判に非常に敏感", "決断が遅い", "感情に流されやすい"],
    jobs: ["ライター・作家・詩人", "グラフィックデザイナー・イラストレーター", "カウンセラー・セラピスト", "音楽家・アーティスト", "ソーシャルワーカー", "教師・教育者", "心理学者", "俳優・パフォーマー", "NPOスタッフ・社会活動家", "翻訳者・通訳者"],
    loveStyle: "理想の愛を求め、深い感情的つながりを大切にする。純粋で一途なロマンチスト。",
    loveStrengths: ["深い愛情と献身", "パートナーを理想化して大切にする", "感情的なつながりの深さ", "創造的なデートや表現"],
    loveChallenges: ["理想と現実のギャップに傷つく", "感情的になりすぎる", "自己主張が苦手"],
    bestMatch: "ENFJ・ENTJ",
    famousPeople: "シェイクスピア、J.R.R.トールキン、ジョニー・デップ",
  },
  ENFJ: {
    strengths: ["カリスマ的なリーダーシップ", "高い共感力", "人を惹きつける魅力", "コミュニケーション力", "組織力"],
    weaknesses: ["他者に依存されすぎる", "批判に敏感", "自分のニーズを後回しにする", "完璧主義"],
    jobs: ["コーチ・メンター", "政治家・社会活動家", "教師・教育者", "人事マネージャー", "カウンセラー・セラピスト", "PR・広報担当", "ファシリテーター", "NGO・NPOリーダー", "医師・看護師", "俳優・TV司会者"],
    loveStyle: "パートナーの成長を全力でサポートする。関係全体の調和を重んじる天性の関係づくり名人。",
    loveStrengths: ["思いやりと献身", "パートナーを最優先にする", "コミュニケーションが豊か", "感情的なつながりの深さ"],
    loveChallenges: ["自己犠牲になりすぎる", "パートナーへの期待が高い", "批判を受け入れにくい"],
    bestMatch: "INFP・ISFP",
    famousPeople: "バラク・オバマ、オプラ・ウィンフリー、マハトマ・ガンジー",
  },
  ENFP: {
    strengths: ["創造性・発想力", "高い共感力", "情熱・エネルギー", "コミュニケーション力", "適応力"],
    weaknesses: ["飽きやすい", "集中力が続かない", "過度に楽観的", "ルーティン作業が苦手"],
    jobs: ["コピーライター・クリエイティブディレクター", "カウンセラー・心理士", "起業家・スタートアップ創業者", "俳優・パフォーマー", "ジャーナリスト・ライター", "教師・教育者", "マーケター・SNSマネージャー", "人事・採用担当", "社会起業家・NPO運営", "UXデザイナー"],
    loveStyle: "情熱的で感情豊か。パートナーをインスパイアし、新しい体験を一緒に楽しむ関係を求める。",
    loveStrengths: ["情熱的で楽しい関係", "パートナーを特別に感じさせる", "感情表現が豊か", "変化と新鮮さをもたらす"],
    loveChallenges: ["熱しやすく冷めやすい面がある", "感情の波が激しい", "約束を守り続けるのが苦手なことも"],
    bestMatch: "INTJ・INFJ",
    famousPeople: "ロビン・ウィリアムズ、ウィル・スミス、エレン・デジェネレス",
  },
  ISTJ: {
    strengths: ["強い責任感・誠実さ", "高い組織力・計画性", "信頼性と一貫性", "細部への注意力", "実行力"],
    weaknesses: ["変化への抵抗感", "感情表現が苦手", "融通が利かない面がある", "新しいアイデアへの慎重さ"],
    jobs: ["会計士・税理士", "プロジェクトマネージャー", "公務員・行政職", "軍人・警察官", "品質管理・監査", "法律家・裁判官", "医師・薬剤師（専門職）", "教師・学校管理職", "エンジニア（インフラ系）", "財務・経理担当"],
    loveStyle: "安定と誠実さを重視する。浮ついた感情より行動で愛を示す。長期的な関係を大切にする。",
    loveStrengths: ["絶対的な信頼と誠実さ", "安定した生活基盤の提供", "約束を必ず守る", "長期的なコミットメント"],
    loveChallenges: ["感情表現が少ない", "ロマンチックなサプライズが苦手", "変化への抵抗が関係に影響することも"],
    bestMatch: "ESFP・ESTP",
    famousPeople: "ジョージ・ワシントン、アンジェラ・メルケル、ウォーレン・バフェット",
  },
  ISFJ: {
    strengths: ["深い共感力・思いやり", "強い責任感", "実務能力の高さ", "忠実さ・献身性", "細部への注意"],
    weaknesses: ["自分の意見を主張しにくい", "批判に敏感", "変化を好まない", "自己犠牲になりすぎる"],
    jobs: ["看護師・医療職", "教師・保育士", "カスタマーサポート", "ソーシャルワーカー", "人事・総務", "司書・アーキビスト", "管理栄養士", "インテリアデザイナー", "事務職・秘書", "心理士・カウンセラー"],
    loveStyle: "相手の幸せを自分の幸せとする献身的な恋人。細かな気遣いで愛情を表現する。",
    loveStrengths: ["深い気遣いと献身", "安定した愛情の提供", "パートナーを大切に扱う", "家庭的で安心感がある"],
    loveChallenges: ["自分を後回しにしすぎる", "意見を言いにくい", "不満を溜め込む"],
    bestMatch: "ESTP・ESFP",
    famousPeople: "ビヨンセ、ケイト・ミドルトン、ローザ・パークス",
  },
  ESTJ: {
    strengths: ["強い実行力・組織力", "明確なリーダーシップ", "責任感と信頼性", "効率的な管理能力", "直接的なコミュニケーション"],
    weaknesses: ["柔軟性に欠けることがある", "感情を軽視しがち", "支配的に見える", "変化への抵抗"],
    jobs: ["マネージャー・管理職", "会計士・法務担当", "行政官・官僚", "軍人・警察幹部", "裁判官・弁護士", "建築監理・施工管理", "教育管理職", "製造業・工場管理", "保険・金融業", "経営コンサルタント"],
    loveStyle: "関係においても秩序と明確さを重視。役割分担を明確にし、責任を果たすことで愛を示す。",
    loveStrengths: ["安定感と頼れる存在感", "責任感が強く浮気しない", "生活を守る力", "明確な意思伝達"],
    loveChallenges: ["感情的なサポートが薄い", "融通が利かないことがある", "パートナーをコントロールしようとする"],
    bestMatch: "ISFP・INFP",
    famousPeople: "ジャッジ・ジュディ、ミシェル・オバマ、ヒラリー・クリントン",
  },
  ESFJ: {
    strengths: ["高い社交性・コミュニケーション力", "深い思いやり", "組織力・実務能力", "調和を保つ力", "信頼性"],
    weaknesses: ["他者の承認を求めすぎる", "批判に非常に敏感", "自分を犠牲にしすぎる", "変化への不安"],
    jobs: ["教師・保育士", "看護師・医療職", "人事・採用担当", "PR・広報担当", "ホテル・接客業", "社会福祉士", "カスタマーサービス", "イベントプランナー", "営業・販売職", "コミュニティマネージャー"],
    loveStyle: "相手を喜ばせることに全力を注ぐ。誕生日や記念日を大切にし、細やかな気配りで愛情を示す。",
    loveStrengths: ["パートナーを特別に感じさせる", "気配りと思いやりが豊か", "家族・友人との関係も大切にする", "積極的に愛情表現する"],
    loveChallenges: ["承認欲求が強い", "意見の衝突が苦手", "相手に依存しすぎることも"],
    bestMatch: "ISTJ・ISFJ",
    famousPeople: "テイラー・スウィフト、ホイットニー・ヒューストン、ビル・クリントン",
  },
  ISTP: {
    strengths: ["冷静な判断力", "優れた技術・実務能力", "危機への対応力", "独立心", "効率的な問題解決"],
    weaknesses: ["感情表現が極端に少ない", "長期コミットが苦手", "退屈をすぐ感じる", "ルールへの反発"],
    jobs: ["エンジニア・メカニック", "パイロット・航空技術者", "外科医・救急医", "ITシステム管理者", "大工・職人・クラフトマン", "法執行官・警察", "消防士・救助隊員", "スポーツ選手・コーチ", "農家・林業", "フォレンジックアナリスト"],
    loveStyle: "言葉より行動で愛情を示す。自立した関係を好み、干渉されすぎると距離を置く。",
    loveStrengths: ["実用的なサポートと問題解決", "落ち着いた安定感", "束縛しない自由な関係", "危機のときに頼れる"],
    loveChallenges: ["感情表現がほとんどない", "感情の話を避ける", "コミットメントへの慎重さ"],
    bestMatch: "ESFJ・ESTJ",
    famousPeople: "クリント・イーストウッド、ブルース・リー、マイケル・ジョーダン",
  },
  ISFP: {
    strengths: ["豊かな感性・芸術性", "深い共感力", "柔軟な適応力", "誠実さ・穏やかさ", "今を生きる力"],
    weaknesses: ["自己主張が苦手", "批判に敏感", "長期計画が苦手", "感情を内に秘めすぎる"],
    jobs: ["グラフィックデザイナー・イラストレーター", "フォトグラファー", "音楽家・アーティスト", "料理人・パティシエ", "看護師・介護士", "動物医療・獣医", "ファッションデザイナー", "インテリアデザイナー", "自然保護活動家", "ヨガ・フィットネスインストラクター"],
    loveStyle: "感情豊かで純粋な愛情を持つ。言葉より行動・芸術的な表現で気持ちを伝える。",
    loveStrengths: ["深い愛情と優しさ", "パートナーの感情に寄り添う", "一緒にいる空間を心地よくする", "サプライズや感動的な体験の提供"],
    loveChallenges: ["感情を言葉にするのが苦手", "不満を溜め込む", "将来の計画が苦手"],
    bestMatch: "ENFJ・ESFJ",
    famousPeople: "マイケル・ジャクソン、オードリー・ヘプバーン、ボブ・ディラン",
  },
  ESTP: {
    strengths: ["行動力・決断力", "現場での問題解決能力", "社交性・説得力", "リスクへの耐性", "適応力"],
    weaknesses: ["長期計画が苦手", "衝動的な行動", "ルールへの反発", "感情の深い部分を避ける"],
    jobs: ["トップ営業・セールス", "起業家・ビジネスオーナー", "スポーツ選手・コーチ", "救急医・外科医", "消防士・警察官", "トレーダー・投資家", "現場監督・施工管理", "イベントプロデューサー", "俳優・エンターテイナー", "プロゲーマー"],
    loveStyle: "刺激的で情熱的な恋愛を好む。退屈を嫌い、常に新しい体験をパートナーと共有したがる。",
    loveStrengths: ["情熱的で刺激的なデート", "行動で愛情を示す", "問題を即座に解決する頼れる存在", "楽しい時間を作り出す"],
    loveChallenges: ["深い感情の話を避ける", "刺激がないと飽きる", "衝動的な言動で傷つけることも"],
    bestMatch: "ISFJ・ISTJ",
    famousPeople: "ドナルド・トランプ、マドンナ、アーネスト・ヘミングウェイ",
  },
  ESFP: {
    strengths: ["高い社交性・明るさ", "即興力・適応力", "共感力・思いやり", "エネルギッシュな行動力", "楽観主義"],
    weaknesses: ["長期計画が苦手", "衝動的な判断", "批判に敏感", "集中力が続かない"],
    jobs: ["俳優・芸人・エンターテイナー", "PRプランナー・イベントプロデューサー", "ホテル・観光業", "SNSインフルエンサー", "販売・接客業", "看護師・介護士", "ダンサー・パフォーマー", "フライトアテンダント", "子ども向け教師・保育士", "スポーツトレーナー"],
    loveStyle: "明るく情熱的な恋人。楽しい思い出を作ることを重視し、パートナーを笑顔にすることが喜び。",
    loveStrengths: ["いつも楽しい気分にさせてくれる", "感情豊かで愛情表現が豊富", "柔軟で相手に合わせられる", "毎日に彩りをもたらす"],
    loveChallenges: ["深刻な話が苦手", "飽きやすい面がある", "将来のことを先延ばしにする"],
    bestMatch: "ISTJ・ISFJ",
    famousPeople: "マリリン・モンロー、エルトン・ジョン、レディー・ガガ",
  },
};

// ── RPGロール定義 ────────────────────────────────────────
const RPG_ROLES = [
  {
    role: "LEADER",
    slug: "rpg-role-leader",
    title: "【職業RPG】LEADERロールとは？覇王・執行官・聖騎士・海賊王の特徴完全解説",
    description: "revelaの職業RPGにおけるLEADERロール（覇王・執行官・聖騎士・海賊王）の特徴、強み、パーティーでの役割を徹底解説します。",
    classes: ["覇王（ENTJ）", "執行官（ESTJ）", "聖騎士（ENFJ）", "海賊王（ESTP）"],
    mbtiTypes: ["ENTJ", "ESTJ", "ENFJ", "ESTP"],
    roleDesc: "前衛・カリスマ型。チームを引っ張り、方向性を示すリーダータイプ。",
    overview: "LEADERロールは、組織やチームの前面に立ち、方向性と勢いをもたらすタイプです。カリスマ性・決断力・行動力に優れ、困難な状況でも仲間を鼓舞し続けます。",
    characteristics: ["カリスマ的な存在感でチームを引っ張る", "決断が速く、行動に迷いがない", "危機的状況で最も輝く", "チームの士気・モチベーションを高める", "明確なビジョンとゴール設定が得意"],
    partyRole: "パーティーにLEADERがいると、チームの方向性が定まり、行動速度が上がります。意思決定のスピードと突破力がチームの強みになります。",
    bestSynergy: "BRAINロールとの組み合わせが最強。LEADERの行動力にBRAINの戦略性が加わると、計画的かつ速い組織になります。",
    tags: ["職業RPG", "LEADERロール", "MBTI活用", "チーム分析"],
  },
  {
    role: "SUPPORT",
    slug: "rpg-role-support",
    title: "【職業RPG】SUPPORTロールとは？聖職者・ギルドマスター・騎士団長・吟遊詩人の特徴完全解説",
    description: "revelaの職業RPGにおけるSUPPORTロール（聖職者・ギルドマスター・騎士団長・吟遊詩人）の特徴、強み、パーティーでの役割を徹底解説します。",
    classes: ["聖職者（ISFJ）", "ギルドマスター（ESFJ）", "騎士団長（ISTJ）", "吟遊詩人（INFP）"],
    mbtiTypes: ["ISFJ", "ESFJ", "ISTJ", "INFP"],
    roleDesc: "後衛・共感・調整型。チームの調和と安定を支える縁の下の力持ち。",
    overview: "SUPPORTロールは、チームの内側から力を発揮するタイプです。献身性・気配り・安定感に優れ、他のメンバーが最大限の力を発揮できる環境を作り出します。",
    characteristics: ["チームの感情と雰囲気を整える", "細かな気配りで全員をサポート", "安定感と信頼性が抜群", "チームの衝突を調整・緩和する", "長期的な関係構築が得意"],
    partyRole: "パーティーにSUPPORTがいると、チームの継続力と安定性が大幅に向上します。燃え尽きを防ぎ、チームを長期的に機能させる力があります。",
    bestSynergy: "LEADERロールとの組み合わせが効果的。LEADERが前に進む力を、SUPPORTが内部から支えることで、強靭な組織が生まれます。",
    tags: ["職業RPG", "SUPPORTロール", "MBTI活用", "チーム分析"],
  },
  {
    role: "BRAIN",
    slug: "rpg-role-brain",
    title: "【職業RPG】BRAINロールとは？賢者・錬金術師・影の刺客・予言者の特徴完全解説",
    description: "revelaの職業RPGにおけるBRAINロール（賢者・錬金術師・影の刺客・予言者）の特徴、強み、パーティーでの役割を徹底解説します。",
    classes: ["賢者（INTJ）", "錬金術師（INTP）", "影の刺客（ISTP）", "予言者（INFJ）"],
    mbtiTypes: ["INTJ", "INTP", "ISTP", "INFJ"],
    roleDesc: "頭脳・論理・戦略型。深い分析と長期戦略でチームを影から動かす。",
    overview: "BRAINロールは、チームの知的エンジンとして機能するタイプです。分析力・戦略思考・専門性に優れ、表には出なくても、チームの方向性と品質を決定的に左右します。",
    characteristics: ["深い分析力と戦略的思考", "長期視点でのリスク管理", "高い専門性と知識量", "問題の根本原因を特定する力", "複雑なシステムを理解・設計する能力"],
    partyRole: "パーティーにBRAINがいると、チームの意思決定の質が大幅に向上します。感情的な判断ではなく、データと論理に基づいた戦略が立てられます。",
    bestSynergy: "TRICKSTERロールとの組み合わせが化学反応を起こす。BRAINの緻密な計画にTRICKSTERの予測不能なアイデアが加わると、革新的なソリューションが生まれます。",
    tags: ["職業RPG", "BRAINロール", "MBTI活用", "チーム分析"],
  },
  {
    role: "TRICKSTER",
    slug: "rpg-role-trickster",
    title: "【職業RPG】TRICKSTERロールとは？奇術師・冒険者・森の狩人・星の踊り子の特徴完全解説",
    description: "revelaの職業RPGにおけるTRICKSTERロール（奇術師・冒険者・森の狩人・星の踊り子）の特徴、強み、パーティーでの役割を徹底解説します。",
    classes: ["奇術師（ENTP）", "冒険者（ENFP）", "森の狩人（ISFP）", "星の踊り子（ESFP）"],
    mbtiTypes: ["ENTP", "ENFP", "ISFP", "ESFP"],
    roleDesc: "自由・直感・カオス型。予測不能な発想でチームに革新と活力をもたらす。",
    overview: "TRICKSTERロールは、チームに新鮮な風を吹き込むタイプです。直感力・創造性・柔軟性に優れ、固定観念を打ち破り、チームが行き詰まったときに全く新しい視点を提供します。",
    characteristics: ["既存の枠を超えた発想力", "直感的・即興的な対応力", "エネルギーと情熱でチームを活性化", "変化を恐れない柔軟性", "遊び心でチームの雰囲気を明るくする"],
    partyRole: "パーティーにTRICKSTERがいると、チームの創造性と革新性が高まります。行き詰まりを打開し、誰も思いつかなかったアイデアを生み出します。",
    bestSynergy: "BRAINロールとの組み合わせが特に効果的。TRICKSTERの自由な発想をBRAINが整理・体系化することで、実現可能な革新的アイデアが生まれます。",
    tags: ["職業RPG", "TRICKSTERロール", "MBTI活用", "チーム分析"],
  },
];

// ── ブロック生成ヘルパー ──────────────────────────────────
function h2(text) {
  return { object: "block", type: "heading_2", heading_2: { rich_text: [{ type: "text", text: { content: text } }] } };
}
function h3(text) {
  return { object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: text } }] } };
}
function p(text) {
  return { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: text } }] } };
}
function bullet(text) {
  return { object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: [{ type: "text", text: { content: text } }] } };
}
function numbered(text) {
  return { object: "block", type: "numbered_list_item", numbered_list_item: { rich_text: [{ type: "text", text: { content: text } }] } };
}
function divider() {
  return { object: "block", type: "divider", divider: {} };
}

// ── MBTI 特徴+仕事記事のブロック生成 ──────────────────────
function buildMbtiGuideBlocks(type, data, info) {
  const blocks = [];

  blocks.push(h2(`${type}（${info.name}）とは？`));
  blocks.push(p(`${type}は「${info.group}グループ」に属するMBTIタイプです。${info.name}とも呼ばれ、独自の強みと個性を持ちます。世界人口に占める割合や特徴的な思考・行動パターンがあり、自分がこのタイプだとわかると多くの謎が解けるでしょう。`));
  blocks.push(p(`有名人では${data.famousPeople}などが${type}と言われています。`));

  blocks.push(h2(`${type}の主な特徴`));
  for (const s of data.strengths) blocks.push(bullet(s));

  blocks.push(h2(`${type}の強み`));
  blocks.push(p(`${type}最大の武器は${data.strengths[0]}と${data.strengths[1]}です。この組み合わせにより、他のタイプが苦手とする領域でも卓越した成果を出せます。`));
  blocks.push(p(`特に${data.strengths[2]}の面では群を抜いており、チームや組織の中で独自の貢献ができます。${data.strengths[3]}と${data.strengths[4]}も相まって、長期的な成功を収めやすいタイプです。`));

  blocks.push(h2(`${type}の弱み・克服すべき課題`));
  for (const w of data.weaknesses) blocks.push(bullet(w));

  blocks.push(h2(`${type}に向いている仕事・職業10選`));
  blocks.push(p(`${type}の強みが最大限に活かせる職種を10個厳選しました。`));

  data.jobs.forEach((job, i) => {
    blocks.push(h3(`${i + 1}. ${job}`));
    blocks.push(p(`${type}の${data.strengths[i % data.strengths.length]}を活かせる職種です。この仕事では${type}の本領が発揮されます。`));
  });

  blocks.push(h2(`${type}が仕事で成功するためのコツ`));
  blocks.push(bullet(`自分の強みである${data.strengths[0]}を活かせるポジションを選ぶ`));
  blocks.push(bullet(`${data.weaknesses[0]}という弱みを意識して改善する`));
  blocks.push(bullet(`相性の良い${data.bestMatch}タイプの人と組んでチームを作る`));
  blocks.push(bullet(`自分のペースで深く集中できる環境を整える`));

  blocks.push(h2(`まとめ`));
  blocks.push(p(`${type}（${info.name}）は${data.strengths[0]}と${data.strengths[1]}を核とした独特の強みを持つタイプです。自分のタイプを知ることで、キャリア選択や人間関係が劇的に改善されます。`));
  blocks.push(p(`revelaで詳しく診断して、自分だけのMBTIコードを確認してみてください。`));

  return blocks;
}

// ── ラブタイプ記事のブロック生成 ────────────────────────────
function buildLoveBlocks(type, data, info) {
  const blocks = [];

  blocks.push(h2(`${type}の恋愛スタイルの根底にあるもの`));
  blocks.push(p(`${type}（${info.name}）の恋愛観を理解するには、まずこのタイプの根本的な価値観を知ることが大切です。${data.loveStyle}`));

  blocks.push(h2(`${type}の恋愛における強み`));
  for (const s of data.loveStrengths) blocks.push(bullet(s));

  blocks.push(h2(`${type}の恋愛における課題`));
  for (const c of data.loveChallenges) blocks.push(bullet(c));

  blocks.push(h2(`${type}が求める理想のパートナー像`));
  blocks.push(p(`${type}は${data.loveStyle.split('。')[0]}を大切にします。理想のパートナーは自立しており、${type}の世界観を理解・尊重できる人です。`));
  blocks.push(p(`MBTIの相性では**${data.bestMatch}**との組み合わせが特に良いとされます。互いの強みが補完し合い、長期的な関係が築きやすいです。`));

  blocks.push(h2(`${type}との上手な付き合い方`));
  blocks.push(bullet(`${type}の${data.loveStrengths[0]}を積極的に認め、感謝を伝える`));
  blocks.push(bullet(`${data.loveChallenges[0]}という傾向を理解して、過度に反応しない`));
  blocks.push(bullet(`${type}の価値観と世界観を尊重する`));
  blocks.push(bullet(`定期的に深い対話の時間を作る`));

  blocks.push(h2(`${type}の有名カップル・著名人の恋愛傾向`));
  blocks.push(p(`${data.famousPeople}などが${type}と言われています。彼らの恋愛・パートナーシップの傾向を見ると、${type}の恋愛スタイルの特徴がよく現れています。`));

  blocks.push(h2(`revelaのラブタイプコードとは`));
  blocks.push(p(`revelaでは、MBTIタイプに加えて「ラブタイプコード」を使った恋愛相性診断が受けられます。4文字のコードが恋愛における自分の傾向を表し、より詳細な相性分析が可能です。`));
  blocks.push(p(`自分のラブタイプコードを知りたい方は、ぜひrevelaの総合診断を試してみてください。`));

  blocks.push(h2(`まとめ`));
  blocks.push(p(`${type}（${info.name}）は${data.loveStyle}このタイプの恋愛の本質を理解することで、より深い関係が築けます。`));

  return blocks;
}

// ── RPGロール記事のブロック生成 ──────────────────────────
function buildRpgRoleBlocks(role) {
  const blocks = [];

  blocks.push(h2(`${role.role}ロールとは？`));
  blocks.push(p(role.overview));
  blocks.push(p(`${role.roleDesc}`));

  blocks.push(h2(`${role.role}ロールの特徴`));
  for (const c of role.characteristics) blocks.push(bullet(c));

  blocks.push(h2(`${role.role}ロールに属する4つのクラス`));
  for (const cls of role.classes) {
    blocks.push(h3(cls));
    blocks.push(p(`このクラスは${role.roleDesc}という${role.role}ロールの特性を体現しています。`));
  }

  blocks.push(h2(`パーティーでの役割`));
  blocks.push(p(role.partyRole));

  blocks.push(h2(`最高の相性：ベストシナジー`));
  blocks.push(p(role.bestSynergy));

  blocks.push(h2(`${role.role}ロールを持つ有名人`));
  const famousByRole = {
    LEADER: "スティーブ・ジョブズ（ENTJ）、マドンナ（ESTP）、バラク・オバマ（ENFJ）",
    SUPPORT: "マハトマ・ガンジー（ISFJ）、マザー・テレサ（ISFJ）、ジョージ・ワシントン（ISTJ）",
    BRAIN: "イーロン・マスク（INTJ）、アルバート・アインシュタイン（INTP）、マーティン・ルーサー・キング（INFJ）",
    TRICKSTER: "マーク・トウェイン（ENTP）、ロビン・ウィリアムズ（ENFP）、マイケル・ジャクソン（ISFP）",
  };
  blocks.push(p(famousByRole[role.role]));

  blocks.push(h2(`あなたのロールを知ろう`));
  blocks.push(p(`自分がどのロールに属するかを知ることで、チームの中での自分の立ち位置がわかります。revelaでMBTI診断を受けて、職業RPGクラスを確認してみてください。`));
  blocks.push(p(`仲間と一緒にパーティーを組めば、チームの陣形とシナジーが可視化されます。ぜひ試してみてください！`));

  blocks.push(h2(`まとめ`));
  blocks.push(p(`${role.role}ロールは「${role.roleDesc}」という特性を持つ4クラスの総称です。このロールの特性を理解することで、チームビルディングや自己分析に役立てることができます。`));

  return blocks;
}

// ── Notion ページ作成 ────────────────────────────────────
async function createPage(title, slug, description, date, tags, blocks) {
  try {
    const page = await notion.pages.create({
      parent: { database_id: DB_ID },
      properties: {
        Title: { title: [{ type: "text", text: { content: title } }] },
        slug: { rich_text: [{ type: "text", text: { content: slug } }] },
        description: { rich_text: [{ type: "text", text: { content: description } }] },
        date: { date: { start: date } },
        tags: { multi_select: tags.map((t) => ({ name: t })) },
      },
      children: blocks.slice(0, 100), // Notion APIは一度に100ブロックまで
    });

    // 100ブロック超の場合は追加
    if (blocks.length > 100) {
      await notion.blocks.children.append({
        block_id: page.id,
        children: blocks.slice(100),
      });
    }

    console.log(`✓ Created: ${title}`);
    return page.id;
  } catch (err) {
    console.error(`✗ Failed: ${title}`, err.message);
    return null;
  }
}

// ── メイン処理 ───────────────────────────────────────────
async function main() {
  let created = 0;
  let failed = 0;

  console.log("=== Notion Blog Seeder ===");
  console.log(`Creating ${MBTI_TYPES.length * 2 + RPG_ROLES.length} articles...\n`);

  // 1. MBTI 特徴+仕事 記事（16本）
  console.log("--- Phase 1: MBTI Guide Articles (16) ---");
  for (const info of MBTI_TYPES) {
    const data = MBTI_DATA[info.type];
    const title = `${info.type}（${info.name}）の特徴・強み・弱みと向いている仕事10選`;
    const slug = `${info.type.toLowerCase()}-guide`;
    const description = `MBTIの${info.type}（${info.name}）タイプの特徴・強み・弱みを完全解説。${info.type}に向いている仕事・職業10選と成功するためのコツも紹介。`;
    const tags = [info.type, "MBTI解説", "仕事・キャリア", "16タイプ"];
    const blocks = buildMbtiGuideBlocks(info.type, data, info);

    const id = await createPage(title, slug, description, "2026-03-29", tags, blocks);
    if (id) created++; else failed++;

    // レート制限対策
    await new Promise(r => setTimeout(r, 400));
  }

  // 2. ラブタイプ記事（16本）
  console.log("\n--- Phase 2: Love Type Articles (16) ---");
  for (const info of MBTI_TYPES) {
    const data = MBTI_DATA[info.type];
    const title = `${info.type}の恋愛傾向・ラブスタイル完全解説｜ラブタイプコードとの関係も`;
    const slug = `${info.type.toLowerCase()}-love`;
    const description = `${info.type}（${info.name}）の恋愛傾向・好きな人へのアプローチ・理想のパートナー像を徹底解説。revelaのラブタイプコードとの関連も紹介。`;
    const tags = [info.type, "恋愛", "MBTI相性", "ラブタイプ"];
    const blocks = buildLoveBlocks(info.type, data, info);

    const id = await createPage(title, slug, description, "2026-03-29", tags, blocks);
    if (id) created++; else failed++;

    await new Promise(r => setTimeout(r, 400));
  }

  // 3. RPGロール記事（4本）
  console.log("\n--- Phase 3: RPG Role Articles (4) ---");
  for (const role of RPG_ROLES) {
    const blocks = buildRpgRoleBlocks(role);
    const id = await createPage(role.title, role.slug, role.description, "2026-03-29", role.tags, blocks);
    if (id) created++; else failed++;

    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\n=== Done ===`);
  console.log(`✓ Created: ${created}`);
  console.log(`✗ Failed:  ${failed}`);
}

main();
