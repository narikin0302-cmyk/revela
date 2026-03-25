import Link from "next/link";
import type { Metadata } from "next";
import DailyMessage from "@/components/DailyMessage";

export const metadata: Metadata = {
  title: "revela | 深層の本質を、言語化する",
  description:
    "MBTI×ラブタイプ×星座×タロット。256通りの組み合わせで、あなただけの自己分析。",
  openGraph: {
    title: "revela | 深層の本質を、言語化する",
    description: "MBTI×ラブタイプ×星座×タロット。256通りの組み合わせで、あなただけの自己分析。",
    type: "website",
    locale: "ja_JP",
    siteName: "revela",
    url: "https://revela.jp",
  },
  twitter: {
    card: "summary_large_image",
    title: "revela | 深層の本質を、言語化する",
    description: "MBTI×ラブタイプ×星座×タロット。256通りの組み合わせで、あなただけの自己分析。",
  },
};

const testimonials = [
  {
    text: "「自分のことを分かってくれた気がして、読みながら泣いてしまいました。」",
    type: "INFJ × ロマンスマジシャン × 魚座",
  },
  {
    text: "「こんなに的確な分析を見たことがない。友達全員に送りました。」",
    type: "ENFP × 主役体質 × 獅子座",
  },
  {
    text: "「曖昧だった自分の軸が、言語化されてすっきりしました。」",
    type: "INTJ × 憧れの先輩 × 水瓶座",
  },
];

const menuItems = [
  {
    icon: "✦",
    title: "総合診断",
    desc: "MBTI×ラブ×星座×タロット",
    href: "/shindan",
    isMain: true,
  },
  { icon: "⭐", title: "星座", desc: "12星座の今週の傾向", href: "/uranai/seiza", isMain: false },
  { icon: "🃏", title: "タロット", desc: "3枚引きスプレッド", href: "/uranai/tarot", isMain: false },
  { icon: "⚔️", title: "職場キャラ診断", desc: "あなたの職場タイプを診断", href: "/shindan/career", isMain: false },
  { icon: "💞", title: "相性診断", desc: "MBTIタイプの相性", href: "/shindan/aisei", isMain: false },
];

const faqs = [
  {
    q: "診断は完全無料ですか？",
    a: "はい、MBTI診断・ラブタイプ診断・星座・タロット・相性診断はすべて無料でご利用いただけます。",
  },
  {
    q: "MBTIの結果は正確ですか？",
    a: "revelaのMBTI診断は10問の厳選された質問で構成されており、傾向を把握するためのものです。より正確な結果が必要な方は公式16Personalitiesテストも合わせてご参照ください。",
  },
  {
    q: "個人情報は保存されますか？",
    a: "診断結果はお客様のデバイス上（ブラウザのlocalStorage）にのみ保存されます。サーバーへの送信は行っておらず、個人情報の収集はしていません。",
  },
  {
    q: "タロット診断は毎回同じ結果になりますか？",
    a: "いいえ。タロット診断はページを読み込むたびにカードの順番がシャッフルされます。引いたカードと3枚の組み合わせに基づいた独自のリーディングが毎回生成されます。逆位置も30%の確率で出現します。",
  },
  {
    q: "相性診断で低い結果が出ました。この関係はダメですか？",
    a: "相性診断はあくまで傾向の参考です。どんな組み合わせでも、お互いの理解と努力次第で深い関係を築くことができます。低いスコアは克服すべきポイントを知るためのヒントとして活用してください。",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">

      {/* ==================== HERO ==================== */}
      <section className="relative min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 py-20 text-center">

        <div className="animate-fade-in-up opacity-0" style={{ animationFillMode: "forwards" }}>
          <span
            className="font-cinzel inline-block text-xs tracking-[0.45em] mb-8 px-5 py-1.5 rounded-full"
            style={{
              color: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            SELF ANALYSIS TOOL
          </span>
        </div>

        <div
          className="animate-fade-in-up opacity-0 delay-100"
          style={{ animationFillMode: "forwards" }}
        >
          <h1
            className="text-5xl sm:text-7xl md:text-8xl font-light leading-tight mb-6"
            style={{ fontFamily: "var(--font-noto-serif-jp), serif", letterSpacing: "0.04em" }}
          >
            <span style={{ color: "#EDEDED" }}>深層の本質を、</span>
            <br />
            <span style={{ color: "rgba(255,255,255,0.55)" }}>言語化する。</span>
          </h1>
        </div>

        <div
          className="animate-fade-in-up opacity-0 delay-200"
          style={{ animationFillMode: "forwards" }}
        >
          <p
            className="text-sm sm:text-base leading-relaxed mb-2 font-light max-w-sm mx-auto"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-noto-serif-jp), serif" }}
          >
            4つの診断軸が交わるとき、<br />あなたの輪郭が浮かび上がる。
          </p>
          <p
            className="font-cinzel text-xs tracking-[0.3em] mb-10"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Based on 256 unique combinations
          </p>
        </div>

        {/* Analysis axes */}
        <div
          className="animate-fade-in-up opacity-0 delay-300 w-full max-w-xl mx-auto mb-10 px-4"
          style={{ animationFillMode: "forwards" }}
        >
          <div className="flex items-center justify-center gap-0 flex-wrap">
            {[
              { label: "MBTI" },
              { label: "星座" },
              { label: "タロット" },
              { label: "キャラ" },
              { label: "職業RPG" },
            ].map((item, i, arr) => (
              <div key={i} className="flex items-center">
                <span
                  className="font-cinzel text-xs tracking-[0.15em] px-3 py-1"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {item.label}
                </span>
                {i < arr.length - 1 && (
                  <span
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.15)" }}
                  >
                    ×
                  </span>
                )}
              </div>
            ))}
            <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 6px" }}>→</span>
            <span
              className="font-cinzel text-xs tracking-[0.2em] px-4 py-1.5 rounded-full"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              あなたの自己分析
            </span>
          </div>
        </div>

        <div
          className="animate-fade-in-up opacity-0 delay-400"
          style={{ animationFillMode: "forwards" }}
        >
          <Link
            href="/shindan"
            className="btn-outline-primary inline-flex items-center gap-3 px-10 py-4 rounded-full text-sm sm:text-base"
          >
            <span>分析をはじめる</span>
            <span style={{ opacity: 0.5 }}>→</span>
          </Link>
          <p className="mt-4 text-xs tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>無料 · 約5分</p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float" style={{ opacity: 0.25 }}>
          <div className="flex flex-col items-center gap-1">
            <span className="font-cinzel text-xs tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
              scroll
            </span>
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <path
                d="M8 0v16M2 10l6 6 6-6"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ==================== DAILY MESSAGE ==================== */}
      <section className="relative px-4 py-12 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="font-cinzel section-label mb-3">
            TODAY&apos;S WORD
          </p>
          <h2
            className="text-2xl sm:text-3xl font-light"
            style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
          >
            今日の一言
          </h2>
          <div className="divider-ornate mt-6">
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>◆</span>
          </div>
        </div>
        <DailyMessage />
      </section>

      {/* ==================== HOW IT WORKS (3 STEPS) ==================== */}
      <section className="relative px-4 py-16 max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-cinzel section-label mb-3">
            HOW IT WORKS
          </p>
          <h2
            className="text-2xl sm:text-3xl font-light"
            style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
          >
            使い方 3ステップ
          </h2>
          <div className="divider-ornate mt-6">
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>◆</span>
          </div>
        </div>

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 sm:gap-0">
          {/* Connecting line for desktop */}
          <div
            className="hidden sm:block absolute top-10 left-[16.66%] right-[16.66%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), rgba(255,255,255,0.1), transparent)" }}
          />

          {[
            { step: "01", icon: "📅", title: "星座を選ぶ", desc: "生年月日か\n星座を選択" },
            { step: "02", icon: "✍️", title: "質問に答える", desc: "MBTI・ラブタイプ\n各5〜10問" },
            { step: "03", icon: "📊", title: "結果を受け取る", desc: "あなただけの\n自己分析が完成" },
          ].map((item, i) => (
            <div key={i} className="relative flex-1 flex flex-col items-center text-center px-4">
              <div
                className="relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center mb-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span className="text-2xl">{item.icon}</span>
                <span
                  className="font-cinzel text-xs font-bold mt-1"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {item.step}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-medium mb-2">{item.title}</h3>
              <p className="text-xs whitespace-pre-line" style={{ color: "rgba(255,255,255,0.35)" }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shindan"
            className="btn-outline-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm"
          >
            今すぐ分析する →
          </Link>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="relative px-4 py-16 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-cinzel section-label mb-3">
            VOICES
          </p>
          <h2
            className="text-2xl sm:text-3xl font-light"
            style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
          >
            使った人の声
          </h2>
          <div className="divider-ornate mt-6">
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>◆</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="card-glow rounded-2xl p-6 relative overflow-hidden">
              <span className="quote-mark" aria-hidden="true">&ldquo;</span>
              <p className="text-xs sm:text-sm leading-relaxed mb-5 relative z-10"
                style={{ color: "rgba(255,255,255,0.65)" }}>
                {t.text}
              </p>
              <div
                className="font-cinzel text-xs tracking-[0.12em] pt-3"
                style={{
                  color: "rgba(255,255,255,0.3)",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {t.type}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== OTHER MENU ==================== */}
      <section className="relative px-4 py-16 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <p className="font-cinzel section-label mb-3">
            MENU
          </p>
          <h2
            className="text-2xl sm:text-3xl font-light"
            style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
          >
            その他の診断・ツール
          </h2>
          <div className="divider-ornate mt-6">
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>◆</span>
          </div>
        </div>

        <p className="text-center text-xs mb-8 tracking-wide" style={{ color: "rgba(255,255,255,0.25)" }}>
          総合診断が初めての方はまず「分析をはじめる」から
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href + item.title}
              href={item.href}
              className={`rounded-2xl p-5 sm:p-6 text-center group hover:scale-105 transition-transform duration-200 relative overflow-hidden ${item.isMain ? "" : "card-glow"}`}
              style={
                item.isMain
                  ? {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.18)",
                    }
                  : {}
              }
            >
              {item.isMain && (
                <div
                  className="absolute top-2 right-2 font-cinzel text-xs px-2 py-0.5 rounded-full tracking-wider"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    fontSize: "9px",
                  }}
                >
                  メイン
                </div>
              )}
              <div className="text-3xl mb-3 inline-block group-hover:animate-float">
                {item.icon}
              </div>
              <h3
                className="text-sm sm:text-base mb-1 font-medium"
                style={{ color: item.isMain ? "#EDEDED" : "rgba(255,255,255,0.7)" }}
              >
                {item.title}
              </h3>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="relative px-4 py-16 max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-cinzel section-label mb-3">
            FAQ
          </p>
          <h2
            className="text-2xl sm:text-3xl font-light"
            style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
          >
            よくある質問
          </h2>
          <div className="divider-ornate mt-6">
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>◆</span>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>

      {/* ==================== SNS FOLLOW ==================== */}
      <section className="relative px-4 py-16 max-w-2xl mx-auto text-center">
        <div className="text-center mb-10">
          <p className="font-cinzel section-label mb-3">
            FOLLOW US
          </p>
          <h2
            className="text-2xl sm:text-3xl font-light"
            style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
          >
            SNSでフォローする
          </h2>
          <p className="text-sm max-w-xs mx-auto mt-3" style={{ color: "rgba(255,255,255,0.35)" }}>
            新機能や新しいコンテンツのお知らせをお届けします。
          </p>
          <div className="divider-ornate mt-6">
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>◆</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* TikTok */}
          <a
            href="#"
            className="card-glow rounded-2xl p-5 flex items-center gap-4 hover:scale-105 transition-transform duration-200 text-left"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" opacity="0.7">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.29a8.17 8.17 0 0 0 4.77 1.53V7.38a4.85 4.85 0 0 1-1-.69z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">TikTok</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>@revela_official</p>
            </div>
          </a>

          {/* Instagram */}
          <a
            href="#"
            className="card-glow rounded-2xl p-5 flex items-center gap-4 hover:scale-105 transition-transform duration-200 text-left"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="rgba(255,255,255,0.6)" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Instagram</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>@revela_official</p>
            </div>
          </a>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="relative px-4 py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-100"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.02) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        <div className="relative">
          <p className="font-cinzel section-label mb-5">
            DEEP SELF ANALYSIS
          </p>
          <h2
            className="text-3xl sm:text-4xl font-light mb-3"
            style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
          >
            あなたの本質を、
          </h2>
          <h2
            className="text-3xl sm:text-4xl font-light mb-8"
            style={{
              fontFamily: "var(--font-noto-serif-jp), serif",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            今すぐ言語化する。
          </h2>
          <Link
            href="/shindan"
            className="btn-outline-primary inline-flex items-center gap-3 px-10 py-4 rounded-full text-sm sm:text-base"
          >
            <span>分析をはじめる</span>
            <span style={{ opacity: 0.5 }}>→</span>
          </Link>
          <p className="mt-4 text-xs tracking-wider" style={{ color: "rgba(255,255,255,0.18)" }}>無料 · 登録不要 · 約5分</p>
        </div>
      </section>
    </div>
  );
}

// FAQ accordion item — server component with CSS-only toggle
function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details
      className="group rounded-xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <summary
        className="flex items-center justify-between px-5 py-4 cursor-pointer list-none text-sm font-medium select-none"
        style={{ color: "rgba(255,255,255,0.75)" }}
      >
        <span>{question}</span>
        <span
          className="text-lg transition-transform duration-200 flex-shrink-0 ml-4 group-open:rotate-45"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          +
        </span>
      </summary>
      <div className="px-5 pb-4">
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{answer}</p>
      </div>
    </details>
  );
}
