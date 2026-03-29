import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "有名人・芸能人の性格タイプ一覧 | revela",
  description:
    "イーロン・マスク、スティーブ・ジョブズ、テイラー・スウィフトなど世界の著名人・有名人の性格タイプ一覧。16タイプ別に掲載。",
  keywords:
    "有名人 性格タイプ, 芸能人 性格タイプ, イーロン・マスク 性格タイプ, 性格タイプ 有名人一覧",
  openGraph: {
    title: "有名人・芸能人の性格タイプ一覧 | revela",
    description:
      "世界の著名人・有名人の性格タイプ一覧。16タイプ別に掲載しています。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function FamousLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
