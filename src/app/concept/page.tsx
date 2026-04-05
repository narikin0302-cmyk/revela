import type { Metadata } from "next";
import Link from "next/link";
import { RPG_CLASSES } from "@/data/rpgClasses";
import { CLASS_ROLES } from "@/data/rpgSynergy";

export const metadata: Metadata = {
  title: "診断した、その先へ | revela",
  description: "自己分析の結果が出た。その先、どこで戦えばいいかは誰も教えてくれない。revelaが見ているのは、今の自分と本音のギャップ。",
  openGraph: {
    title: "診断した、その先へ | revela",
    description: "自己分析の結果が出た。その先、どこで戦えばいいかは誰も教えてくれない。",
    type: "website",
    locale: "ja_JP",
    siteName: "revela",
  },
};

const steps = [
  {
    number: "01",
    title: "強みを一点に絞る",
    body: "「あれも得意、これも面白い」で広げると、どれも浅くなる。自分のクラスを知ることで、どこに集中すべきかが見えてくる。",
    color: "#a78bfa",
  },
  {
    number: "02",
    title: "自分が活きる場所を選ぶ",
    body: "自己分析を「弱みを見つけること」で終わらせない。現在地と本音のギャップを知れば、自分が最大化できる環境を逆算できる。",
    color: "#34d399",
  },
  {
    number: "03",
    title: "準備の上で動く",
    body: "建前（今の自分）と本音（本当の欲求）の両方を知っているから、どんな場面でも自分らしく動ける。",
    color: "#f0d060",
  },
];

export default function ConceptPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* 背景 orb */}
      <div
        className="orb w-96 h-96 opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #a78bfa, transparent)", top: "5%", left: "-10%" }}
      />
      <div
        className="orb w-64 h-64 opacity-8 pointer-events-none"
        style={{ background: "radial-gradient(circle, #34d399, transparent)", top: "60%", right: "-5%" }}
      />

      <div className="relative max-w-2xl mx-auto px-4 py-20">

        {/* ── ① RPG導入 ── */}
        <section className="mb-16">
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p
              className="text-sm sm:text-base leading-loose mb-8"
              style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-noto-serif-jp), serif" }}
            >
              RPGでは、クラスに合ったポジションがある。<br />
              魔法使いが前線に立っても、すぐ倒れる。<br />
              戦士が後衛で回復しようとしても、追いつかない。<br />
              間違ったポジションでは、どれだけ頑張っても強くなれない。
            </p>
            <p
              className="text-xl sm:text-2xl font-light mb-8"
              style={{ color: "#EDEDED", fontFamily: "var(--font-noto-serif-jp), serif" }}
            >
              現実も、同じだ。
            </p>
            <p
              className="text-sm sm:text-base leading-loose"
              style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-noto-serif-jp), serif" }}
            >
              「どの役割に徹すればいいか」誰も教えてくれない。<br />
              頑張っているのに手応えがない。<br />
              それは、間違ったポジションで戦っているからかもしれない。
            </p>
          </div>
        </section>

        {/* ── ② 問いかけ ── */}
        <section className="text-center mb-24">
          <span
            className="font-cinzel inline-block text-xs tracking-[0.45em] mb-8 px-5 py-1.5 rounded-full"
            style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            CONCEPT
          </span>
          <h1
            className="text-4xl sm:text-5xl font-light leading-tight mb-8"
            style={{ fontFamily: "var(--font-noto-serif-jp), serif", letterSpacing: "0.04em" }}
          >
            <span style={{ color: "#EDEDED" }}>診断した、</span>
            <br />
            <span style={{ color: "rgba(255,255,255,0.45)" }}>その先へ。</span>
          </h1>
          <p
            className="text-sm sm:text-base leading-relaxed max-w-sm mx-auto"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-noto-serif-jp), serif" }}
          >
            自己分析をして、結果が出た。<br />
            その先、どうすればいいか分かりましたか？
          </p>
        </section>

        {/* ── ② 多くのツールが教えてくれること ── */}
        <section className="mb-16">
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="font-cinzel text-xs tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.25)" }}>
              MOST TOOLS TELL YOU
            </p>
            <p
              className="text-xl sm:text-2xl font-light leading-relaxed"
              style={{ fontFamily: "var(--font-noto-serif-jp), serif", color: "rgba(255,255,255,0.5)" }}
            >
              「あなたは<span style={{ color: "rgba(255,255,255,0.75)" }}>こういう人</span>です。」
            </p>
            <div
              className="mt-6 pt-6 text-sm leading-relaxed"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}
            >
              なるほど、と思う。でも次に何をすればいいか、分からない。<br />
              診断結果は特性を教えてくれる。<br />
              「その特性を、どこで・どう使えばいいか」は教えてくれない。
            </div>
          </div>
        </section>

        {/* ── ②-b 動けない理由 ── */}
        <section className="mb-16">
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="font-cinzel text-xs tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.25)" }}>
              WHY YOU CAN'T MOVE
            </p>
            <p
              className="text-lg sm:text-xl font-light leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-noto-serif-jp), serif", color: "rgba(255,255,255,0.65)" }}
            >
              お金を払って診断した。<br />
              ギャップもわかった。<br />
              <span style={{ color: "#EDEDED" }}>それでも動けなかった。</span>
            </p>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-noto-serif-jp), serif" }}>
              それは意志が弱いんじゃない。「次の一手」が見えていなかっただけだ。
            </p>
            <div className="space-y-3">
              {[
                "ギャップはわかった。でも次に何をすればいいかわからない",
                "転職・異動のリスクが見えない",
                "自分だけの問題なのか、環境の問題なのか判断できない",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  <span style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>—</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ②-c revelaのポジション ── */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <p className="font-cinzel section-label mb-3">WHERE REVELA FITS</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            {[
              { step: "①", label: "自分を知る", sub: "診断ツール全般", color: "rgba(255,255,255,0.2)", active: false },
              { step: "②", label: "どこへ行くか", sub: "revela", color: "#a78bfa", active: true },
              { step: "③", label: "実際に動く", sub: "転職・異動・キャリア相談", color: "rgba(255,255,255,0.2)", active: false },
            ].map((item) => (
              <div
                key={item.step}
                className="flex-1 rounded-2xl p-5 text-center"
                style={{
                  background: item.active ? "rgba(167,139,250,0.08)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${item.active ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.07)"}`,
                }}
              >
                <p className="font-cinzel text-xs mb-2" style={{ color: item.active ? "#a78bfa" : "rgba(255,255,255,0.2)" }}>{item.step}</p>
                <p className="font-bold mb-1" style={{ color: item.active ? "#EDEDED" : "rgba(255,255,255,0.35)" }}>{item.label}</p>
                <p className="text-xs" style={{ color: item.active ? "#a78bfa" : "rgba(255,255,255,0.2)" }}>{item.sub}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-5 space-y-2">
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-noto-serif-jp), serif" }}
            >
              多くの診断ツールは①で止まる。revelaは②まで連れていく。
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-noto-serif-jp), serif" }}
            >
              ③まで動けるかは、あなた次第。<br />
              でも、地図を持って歩くのと、持たずに歩くのは違う。<br />
              <span style={{ color: "rgba(255,255,255,0.75)" }}>revelaは、あなたの地図になる。</span>
            </p>
          </div>
        </section>

        {/* ── ③ revelaが教えること ── */}
        <section className="mb-16">
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: "linear-gradient(135deg, rgba(167,139,250,0.08), rgba(52,211,153,0.05))",
              border: "1px solid rgba(167,139,250,0.25)",
            }}
          >
            <p className="font-cinzel text-xs tracking-widest mb-5" style={{ color: "#a78bfa" }}>
              REVELA TELLS YOU
            </p>
            <p
              className="text-xl sm:text-2xl font-light leading-relaxed"
              style={{ fontFamily: "var(--font-noto-serif-jp), serif", color: "#EDEDED" }}
            >
              「あなたは<span style={{ color: "#a78bfa" }}>どこで戦えば</span>強いか。」
            </p>
            <div
              className="mt-6 pt-6 text-sm leading-relaxed"
              style={{ borderTop: "1px solid rgba(167,139,250,0.15)", color: "rgba(255,255,255,0.5)" }}
            >
              今の自分（現在地）と本音のギャップを測定する。<br />
              そのギャップが、あなたのRPGクラスを決める。<br />
              クラスを知ることは、<span style={{ color: "rgba(255,255,255,0.8)" }}>戦い方を知ること</span>だ。
            </div>
          </div>
        </section>

        {/* ── ④ 仕組み ── */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <p className="font-cinzel section-label mb-3">HOW IT WORKS</p>
            <h2
              className="text-2xl sm:text-3xl font-light"
              style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
            >
              ギャップが、クラスを決める。
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0">
            {[
              { label: "現在地", desc: "社会に見せている自分", color: "rgba(255,255,255,0.6)" },
              { label: "×", desc: "", color: "rgba(255,255,255,0.2)", isOp: true },
              { label: "本音", desc: "奥底にある欲求", color: "#e8a0bf" },
              { label: "→", desc: "", color: "rgba(255,255,255,0.2)", isOp: true },
              { label: "RPGクラス", desc: "あなたの戦い方", color: "#a78bfa" },
            ].map((item, i) => (
              item.isOp ? (
                <span key={i} className="text-xl sm:mx-3" style={{ color: item.color }}>{item.label}</span>
              ) : (
                <div key={i} className="text-center px-4 py-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${item.color}33` }}>
                  <p className="text-sm font-bold mb-1" style={{ color: item.color }}>{item.label}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{item.desc}</p>
                </div>
              )
            ))}
          </div>
        </section>

        {/* ── ⑤ 3つの変換 ── */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <p className="font-cinzel section-label mb-3">3 CONVERSIONS</p>
            <h2
              className="text-2xl sm:text-3xl font-light"
              style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
            >
              知る、から、活かすへ。
            </h2>
            <p className="text-sm mt-3 max-w-xs mx-auto" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-noto-serif-jp), serif" }}>
              同じ強みを持っていても、結果が違う。<br />差は特性ではなく、特性の使い方にある。
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl p-5 sm:p-6"
                style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${step.color}22` }}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="font-cinzel text-2xl font-bold flex-shrink-0"
                    style={{ color: `${step.color}55` }}
                  >
                    {step.number}
                  </span>
                  <div>
                    <p className="font-bold mb-2" style={{ color: step.color }}>{step.title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-noto-serif-jp), serif" }}>
                      {step.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ⑥ クラス別ブログ ── */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <p className="font-cinzel section-label mb-3">YOUR CLASS</p>
            <h2
              className="text-2xl sm:text-3xl font-light mb-3"
              style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
            >
              あなたのクラスを選んで読む
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-noto-serif-jp), serif" }}>
              クラスごとの「絞る・選ぶ・動く」を詳しく解説しています。
            </p>
          </div>

          {(["LEADER", "BRAIN", "SUPPORT", "TRICKSTER"] as const).map((role) => {
            const roleLabel: Record<string, { label: string; color: string }> = {
              LEADER:    { label: "前衛", color: "#f87171" },
              BRAIN:     { label: "頭脳", color: "#818cf8" },
              SUPPORT:   { label: "後衛", color: "#34d399" },
              TRICKSTER: { label: "自由", color: "#c084fc" },
            };
            const info = roleLabel[role];
            const classes = RPG_CLASSES.filter((c) => CLASS_ROLES[c.name] === role);
            return (
              <div key={role} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-0.5 h-4 rounded-full" style={{ background: info.color }} />
                  <span className="text-xs font-bold tracking-widest" style={{ color: info.color }}>{info.label}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {classes.map((cls) => (
                    <Link
                      key={cls.id}
                      href={`/blog/${cls.id}-guide`}
                      className="flex flex-col items-center gap-1.5 px-3 py-4 rounded-xl text-center transition-all duration-200 hover:scale-105"
                      style={{
                        background: `${cls.color}0d`,
                        border: `1px solid ${cls.color}33`,
                      }}
                    >
                      <span className="text-2xl">{cls.emoji}</span>
                      <p className="text-xs font-bold" style={{ color: cls.color }}>{cls.name}</p>
                      <p className="text-xs opacity-40 leading-tight">{cls.tagline.slice(0, 16)}…</p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* ── ⑦ CTA ── */}
        <section className="text-center py-16">
          <div
            className="absolute inset-x-0 h-px opacity-10"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }}
          />
          <p className="font-cinzel section-label mb-5">START HERE</p>
          <h2
            className="text-3xl sm:text-4xl font-light mb-3"
            style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
          >
            あなたのクラスを、
          </h2>
          <h2
            className="text-3xl sm:text-4xl font-light mb-10"
            style={{ fontFamily: "var(--font-noto-serif-jp), serif", color: "rgba(255,255,255,0.4)" }}
          >
            今すぐ知る。
          </h2>
          <Link
            href="/shindan"
            className="btn-outline-primary inline-flex items-center gap-3 px-10 py-4 rounded-full text-sm sm:text-base"
          >
            <span>診断をはじめる</span>
            <span style={{ opacity: 0.5 }}>→</span>
          </Link>
          <p className="mt-4 text-xs tracking-wider" style={{ color: "rgba(255,255,255,0.18)" }}>
            無料 · 登録不要 · 約5分
          </p>
        </section>

      </div>
    </div>
  );
}
