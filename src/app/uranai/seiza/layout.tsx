import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "星座 | 12星座の今週の傾向",
  description: "12星座の今週の傾向を詳しくお届け。総合・恋愛・仕事・お金・健康の5項目で分析します。",
  openGraph: {
    title: "星座 | revela",
    description: "12星座の今週の傾向。総合・恋愛・仕事・お金・健康の5項目で分析。",
    type: "website",
    locale: "ja_JP",
    siteName: "revela",
    url: "https://revela.jp/uranai/seiza",
  },
  twitter: {
    card: "summary_large_image",
    title: "星座 | revela",
    description: "12星座の今週の傾向。総合・恋愛・仕事・お金・健康の5項目で分析。",
  },
};

export default function SeizaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
