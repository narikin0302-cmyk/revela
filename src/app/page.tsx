import Link from "next/link";
import type { Metadata } from "next";
import DailyMessage from "@/components/DailyMessage";

export const metadata: Metadata = {
  title: "revela | 深層の本質を、言語化する",
  description:
    "職業RPG×自己分析。256通りの組み合わせで、あなただけのRPGクラスを発見。",
  openGraph: {
    title: "revela | 深層の本質を、言語化する",
    description: "職業RPG×自己分析。256通りの組み合わせで、あなただけのRPGクラスを発見。",
    type: "website",
    locale: "ja_JP",
    siteName: "revela",
    url: "https://revela.jp",
  },
  twitter: {
    card: "summary_large_image",
    title: "revela | 深層の本質を、言語化する",
    description: "職業RPG×自己分析。256通りの組み合わせで、あなただけのRPGクラスを発見。",
  },
};

const testimonials = [
  {
    text: "「自分のことを分かってくれた気がして、読みながら泣いてしまいました。」",
    type: "予言者",
  },
  {
    text: "「こんなに的確な分析を見たことがない。友達全員に送りました。」",
    type: "冒険者",
  },
  {
    text: "「曖昧だった自分の軸が、言語化されてすっきりしました。」",
    type: "賢者",
  },
];

const menuItems = [
  {
    icon: "✦",
    title: "総合診断",
    desc: "現在地×本音×職業RPG",
    href: "/shindan",
    isMain: true,
  },

  { icon: "💞", title: "相性診断", desc: "性格タイプの相性", href: "/shindan/aisei", isMain: false },
];

const faqs = [
  {
    q: "診断は完全無料ですか？",
    a: "はい、現在地診断・本音診断・職業RPG診断・相性診断はすべて無料でご利用いただけます。",
  },
  {
    q: "診断結果は正確ですか？",
    a: "revelaの診断は厳選された質問で構成されており、傾向を把握するためのものです。日常での自分の行動パターンを思い浮かべながら答えると、より精度の高い結果が得られます。",
  },
  {
    q: "個人情報は保存されますか？",
    a: "診断結果はお客様のデバイス上（ブラウザのlocalStorage）にのみ保存されます。サーバーへの送信は行っておらず、個人情報の収集はしていません。",
  },
  {
    q: "相性診断で低い結果が出ました。この組み合わせはダメですか？",
    a: "相性診断はあくまで傾向の参考です。どんな組み合わせでも、お互いの理解と努力次第で良い関係を築くことができます。低いスコアは克服すべきポイントを知るためのヒントとして活用してください。",
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
            <span style={{ color: "#EDEDED" }}>自分のことは、</span>
            <br />
            <span style={{ color: "rgba(255,255,255,0.55)" }}>自分が一番わからない。</span>
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
            強みを聞かれても出てこない。やりたいことも答えられない。<br />
            それは自己分析が足りないんじゃない。<br />言語化する道具がなかっただけ。
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
              { label: "現在地" },
              { label: "本音" },
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
            { step: "01", icon: "✍️", title: "質問に答える", desc: "現在地・本音\n各5〜15問" },
            { step: "02", icon: "🔍", title: "タイプを確定", desc: "16通りの組み合わせで\nあなたを分類" },
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
      <section className="relative px-4 py-16 max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-cinzel section-label mb-3">VOICES</p>
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
        <div className="flex flex-col gap-4">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl px-6 py-5"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-noto-serif-jp), serif" }}>
                {t.text}
              </p>
              <p className="font-cinzel text-xs tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
                — {t.type}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== AISEI (COMPATIBILITY) ==================== */}
      <section className="relative px-4 py-16 max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-cinzel section-label mb-3">COMPATIBILITY</p>
          <h2
            className="text-2xl sm:text-3xl font-light mb-4"
            style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
          >
            あなたを知ったら、<br />次は「相手」を知る。
          </h2>
          <p
            className="text-sm leading-relaxed max-w-sm mx-auto"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-noto-serif-jp), serif" }}
          >
            建前と本音のギャップは、人それぞれ違う。<br />
            その違いが「相性」を生む。<br />
            <br />
            表面的な好き嫌いじゃなく、<br />
            お互いの立ち回りのギャップから<br />
            本質的な相性を可視化する。
          </p>
          <div className="divider-ornate mt-6">
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>◆</span>
          </div>
        </div>
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs tracking-widest mb-2 font-cinzel" style={{ color: "rgba(255,255,255,0.25)" }}>
            FRIENDS · LOVERS · COWORKERS
          </p>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-noto-serif-jp), serif" }}>
            友人・恋人・職場——あらゆる関係に使える
          </p>
          <Link
            href="/shindan/aisei"
            className="btn-outline-primary inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm"
          >
            <span>相性を診断する</span>
            <span style={{ opacity: 0.5 }}>→</span>
          </Link>
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
