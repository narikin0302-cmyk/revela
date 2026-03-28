import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP, Cinzel } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import BottomNav from "@/components/BottomNav";
import PageTransition from "@/components/PageTransition";
import { Analytics } from "@vercel/analytics/next";

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://revela.jp"),
  title: {
    default: "revela | 本当の自分を知る",
    template: "%s | revela",
  },
  description:
    "MBTI×ラブタイプ×星座×タロット。4つの診断で、本当の自分を発見しよう。revela",
  keywords: "MBTI, 星座, タロット, ラブタイプ, 性格診断, 自己分析, 相性診断, 職場キャラ診断",
  manifest: "/manifest.json",
  openGraph: {
    title: "revela | 本当の自分を知る",
    description:
      "MBTI×ラブタイプ×星座×タロット。4つの診断で、本当の自分を発見しよう。",
    type: "website",
    locale: "ja_JP",
    siteName: "revela",
    url: "https://revela.jp",
  },
  twitter: {
    card: "summary_large_image",
    title: "revela | 本当の自分を知る",
    description: "MBTI×ラブタイプ×星座×タロット。4つの診断で、本当の自分を発見しよう。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSerifJP.variable} ${notoSansJP.variable} ${cinzel.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5804541642841457" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0a0a0a" />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "revela",
              description: "MBTI×ラブタイプ×星座×タロット。自己分析ツール",
              url: "https://revela.jp",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://revela.jp/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased relative">
        <div className="relative z-10 min-h-screen flex flex-col">
          <NavBar />

          {/* Page content */}
          <main className="flex-1 pt-14 pb-[60px] sm:pb-0">
            <PageTransition>{children}</PageTransition>
          </main>

          <BottomNav />

          {/* Footer */}
          <footer className="relative z-10 py-10 px-4 text-center">
            <div
              className="w-full h-px mb-8"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
              }}
            />
            <p
              className="font-cinzel text-xs tracking-widest opacity-25"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              © 2026 revela
            </p>
            <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>
              診断結果はMBTI・キャラクターコード・星座のみ、匿名で統計目的に収集されます。
            </p>
          </footer>
        </div>
      <Analytics />
      </body>
    </html>
  );
}
