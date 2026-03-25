import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "タロット | 3枚引きスプレッド",
  description: "過去・現在・未来を3枚のタロットカードで読み解く。正位置・逆位置込みのリーディング。",
  openGraph: {
    title: "タロット | revela",
    description: "過去・現在・未来を3枚のタロットカードで読み解く3枚引きスプレッド。",
    type: "website",
    locale: "ja_JP",
    siteName: "revela",
    url: "https://revela.jp/uranai/tarot",
  },
  twitter: {
    card: "summary_large_image",
    title: "タロット | revela",
    description: "過去・現在・未来を3枚のタロットカードで読み解く3枚引きスプレッド。",
  },
};

export default function TarotLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
