"use client";

import { useMemo } from "react";

const DAILY_MESSAGES = [
  "今日、あなたが下す決断が未来の輪郭を描きます。",
  "心の奥深くで知っていることを、今日は声に出してみて。",
  "迷いは、正しい道を探している証拠です。",
  "あなたの存在そのものが、誰かの光になっています。",
  "小さな一歩も、確かな記録として残ります。",
  "昨日の傷が今日の強さになっています。",
  "信頼とは、相手に自分の一部を預けることです。",
  "夢を語ることは、すでに夢への第一歩です。",
  "静寂の中にこそ、本当の答えが宿ります。",
  "美しいものを見つける目を、今日も持ち続けてください。",
  "あなたのペースで進むことが、最速の道です。",
  "感謝を感じた瞬間、世界があなたに微笑みます。",
  "過去は変えられないけれど、意味は変えられます。",
  "直感は、あなたの深層からのメッセージです。",
  "誰かに優しくすることは、自分にも優しくすることです。",
  "変化を恐れないで。それはあなたが成長している証です。",
  "今日出会う言葉に、大切なヒントが隠れているかもしれません。",
  "あなたの笑顔は、周りの世界を温かくしています。",
  "不完全さの中にこそ、美しさが宿ります。",
  "自分を信じる力が、最強の原動力です。",
  "今この瞬間に集中することが、充実への最短ルートです。",
  "あなたが思う以上に、周りの人はあなたを必要としています。",
  "傷ついた心が最も深く、人の痛みを理解できます。",
  "本質はいつも輝いている。見えない夜も、曇りの日も。",
  "あなたの物語は、まだ続いています。",
  "深く感じる能力は、弱さではなく才能です。",
  "今日の選択が、明日の自分への贈り物になります。",
  "本物の繋がりは、本質と本質が触れ合うことから生まれます。",
  "あなたの内なる声に、もう少しだけ耳を傾けてみて。",
  "流れに乗ることと、流されることは違います。",
];

function getDailySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export default function DailyMessage() {
  const message = useMemo(() => {
    const seed = getDailySeed();
    const index = seed % DAILY_MESSAGES.length;
    return DAILY_MESSAGES[index];
  }, []);

  const today = useMemo(() => {
    const d = new Date();
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }, []);

  return (
    <div
      className="rounded-2xl p-6 sm:p-8 text-center"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p
        className="font-cinzel text-xs tracking-[0.35em] mb-5"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        {today}
      </p>
      <blockquote
        className="text-base sm:text-lg leading-relaxed font-light"
        style={{ fontFamily: "var(--font-noto-serif-jp), serif", color: "rgba(255,255,255,0.75)" }}
      >
        &ldquo;{message}&rdquo;
      </blockquote>
    </div>
  );
}
