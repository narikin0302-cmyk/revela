// ============================================================
// 今日の運勢データ
// ============================================================

export interface DailyFortune {
  overall: number; // 1-5 stars
  love: number;
  work: number;
  money: number;
  message: string;
  luckyColor: string;
  luckyItem: string;
  luckyDirection: string;
  luckyTime: string;
}

const dailyMessages = [
  "今日、あなたの一言が誰かの人生を変えるかもしれません。",
  "迷ったときは、心が向く方へ。理由は後からついてきます。",
  "今日の小さな勇気が、未来の大きな扉を開けます。",
  "あなたが存在するだけで、誰かの世界は豊かになっています。",
  "完璧でなくていい。今日もあなたらしくいることが最善です。",
  "宇宙はあなたの背中を押しています。一歩踏み出して。",
  "今日出会う人は、あなたに何かを教えるために現れています。",
  "焦らなくていい。月が満ちるように、あなたの時は来ます。",
  "手放すことで、より大切なものが入ってくる空間ができます。",
  "今日の直感を信じて。あなたの内なる声は正しい。",
  "比べることをやめた瞬間、あなたの本当の輝きが現れます。",
  "困難は変装した贈り物。その包みを開く時が来ています。",
  "あなたの優しさは、見えないところで確かに誰かを救っています。",
  "今日は自分を甘やかす日。それもまた大切な自己愛です。",
  "静けさの中にこそ、宇宙からの答えが隠れています。",
  "今日のあなたは、昨日より確かに強くなっています。",
  "繋がりたいと思った人に、今日こそ連絡してみて。",
  "あなたの夢は、現実になる準備をしています。",
  "今日の笑顔が、明日の幸運を呼び込みます。",
  "過去は変えられない。でも今日からは何でも変えられます。",
  "あなたの存在そのものが、この世界へのギフトです。",
  "今日、感謝を一つ言葉にしてみて。世界が変わります。",
  "迷いも含めて、すべてがあなたを作っています。",
  "今日の種が、来月の花を咲かせます。",
  "あなたの魂は、今もっとも必要なものを知っています。",
  "失敗しても大丈夫。それはゴールへの地図の一部です。",
  "今日の出来事に、偶然はひとつもありません。",
  "深呼吸して。あなたにはすでに必要なものが全て揃っています。",
  "今日、あなたを大切にする選択をすることが最高の魔法です。",
  "光は闇の中でこそ最も美しく輝きます。あなたもそうです。",
];

const luckyColors = [
  "赤", "オレンジ", "黄色", "緑", "水色", "青", "紫", "ピンク",
  "白", "金色", "銀色", "ラベンダー", "コーラル", "ターコイズ",
];

const luckyItems = [
  "お気に入りのアクセサリー", "天然石", "手帳", "花束", "お茶",
  "音楽プレイリスト", "写真", "香り", "本", "笑顔",
  "新しい文房具", "鏡", "植物", "キャンドル", "水晶",
];

const luckyDirections = ["北", "南", "東", "西", "北東", "南東", "北西", "南西"];

const luckyTimes = [
  "7:00〜8:00", "10:00〜11:00", "13:00〜14:00",
  "15:00〜16:00", "18:00〜19:00", "21:00〜22:00",
];

// Seeded random function for consistent daily results
function seededRandom(seed: number): () => number {
  let s = seed;
  return function () {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function getDailyFortune(zodiacName: string, dateString: string): DailyFortune {
  // Create a seed from date + zodiac
  const dateNum = parseInt(dateString.replace(/-/g, ""), 10);
  const zodiacNum = zodiacName.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const seed = dateNum + zodiacNum;

  const rand = seededRandom(seed);

  const overall = Math.floor(rand() * 5) + 1;
  const love = Math.floor(rand() * 5) + 1;
  const work = Math.floor(rand() * 5) + 1;
  const money = Math.floor(rand() * 5) + 1;
  const messageIdx = Math.floor(rand() * dailyMessages.length);
  const colorIdx = Math.floor(rand() * luckyColors.length);
  const itemIdx = Math.floor(rand() * luckyItems.length);
  const dirIdx = Math.floor(rand() * luckyDirections.length);
  const timeIdx = Math.floor(rand() * luckyTimes.length);

  return {
    overall,
    love,
    work,
    money,
    message: dailyMessages[messageIdx],
    luckyColor: luckyColors[colorIdx],
    luckyItem: luckyItems[itemIdx],
    luckyDirection: luckyDirections[dirIdx],
    luckyTime: luckyTimes[timeIdx],
  };
}

// Daily message seeded by date only (for top page)
export function getDailyMessage(dateString: string): string {
  const dateNum = parseInt(dateString.replace(/-/g, ""), 10);
  const rand = seededRandom(dateNum * 31337);
  const idx = Math.floor(rand() * dailyMessages.length);
  return dailyMessages[idx];
}
