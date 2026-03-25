import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "プレミアム鑑定 | 本格占いプラン",
  description: "占い師による本格鑑定。ライト・スタンダード・ディープの3プランからあなたに合った鑑定をお選びください。",
  openGraph: {
    title: "プレミアム鑑定 | revela",
    description: "占い師による本格鑑定。あなただけのパーソナライズされた深い読みを体験してください。",
    type: "website",
    locale: "ja_JP",
    siteName: "revela",
    url: "https://revela.jp/premium",
  },
  twitter: {
    card: "summary_large_image",
    title: "プレミアム鑑定 | revela",
    description: "占い師による本格鑑定。あなただけのパーソナライズされた深い読みを体験してください。",
  },
};

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  notFound();
}
