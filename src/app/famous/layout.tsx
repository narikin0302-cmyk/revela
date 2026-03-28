import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "有名人・芸能人のMBTI一覧 | revela",
  description:
    "イーロン・マスク、スティーブ・ジョブズ、テイラー・スウィフトなど世界の著名人・有名人のMBTIタイプ一覧。INTJ・ENFP・INFJなど16タイプ別に掲載。",
  keywords:
    "有名人 MBTI, 芸能人 MBTI, イーロン・マスク MBTI, MBTI 有名人一覧, MBTI タイプ別 有名人",
  openGraph: {
    title: "有名人・芸能人のMBTI一覧 | revela",
    description:
      "世界の著名人・有名人のMBTIタイプ一覧。16タイプ別に掲載しています。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function FamousLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
