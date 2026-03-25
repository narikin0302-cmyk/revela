"use client";

import { useState } from "react";

interface Plan {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  features: string[];
  highlight: boolean;
}

const PLANS: Plan[] = [
  {
    id: "light",
    name: "ライト鑑定",
    price: "¥1,500",
    priceNum: 1500,
    highlight: false,
    features: [
      "MBTI詳細レポート（PDF）",
      "ラブタイプ詳細レポート（PDF）",
      "相性タイプ解説",
      "3営業日以内にメールで納品",
    ],
  },
  {
    id: "standard",
    name: "スタンダード鑑定",
    price: "¥3,000",
    priceNum: 3000,
    highlight: true,
    features: [
      "ライト鑑定の全内容",
      "タロット3枚引き（詳細解説付き）",
      "MBTI相性診断レポート",
      "2営業日以内にメールで納品",
      "1回の質問返答（メール）",
    ],
  },
  {
    id: "premium",
    name: "プレミアム鑑定",
    price: "¥5,000",
    priceNum: 5000,
    highlight: false,
    features: [
      "スタンダード鑑定の全内容",
      "星座×タロット総合鑑定",
      "個別メッセージ（音声 or テキスト）",
      "1ヶ月フォロー（週1回の気づき配信）",
      "翌営業日以内にメールで納品",
      "3回の質問返答（メール）",
    ],
  },
];

interface FormData {
  name: string;
  email: string;
  birthdate: string;
  plan: string;
  message: string;
}

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    birthdate: "",
    plan: "",
    message: "",
  });

  const openModal = (planId: string) => {
    setSelectedPlan(planId);
    setForm((prev) => ({ ...prev, plan: planId }));
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitted(false);
    setSelectedPlan(null);
  };

  const planData = PLANS.find((p) => p.id === selectedPlan);

  return (
    <div className="relative min-h-screen px-4 py-12 max-w-4xl mx-auto">
      {/* Decorative orbs */}
      <div
        className="orb w-96 h-96 opacity-15"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3), transparent)", top: "-5%", right: "-15%" }}
      />
      <div
        className="orb w-80 h-80 opacity-10"
        style={{ background: "radial-gradient(circle, #e8a0bf, transparent)", bottom: "10%", left: "-10%" }}
      />

      {/* Hero */}
      <section className="text-center mb-16 pt-4">
        <div
          className="inline-block px-4 py-1.5 rounded-full text-xs tracking-[0.4em] mb-6"
          style={{ color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.06)" }}
        >
          PREMIUM READINGS
        </div>
        <h1
          className="text-3xl sm:text-5xl font-light mb-6 leading-tight"
          style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AIでは届かない、
          </span>
          <br />
          本物の鑑定
        </h1>
        <p className="text-sm sm:text-base opacity-60 max-w-md mx-auto leading-relaxed mb-8">
          数千のデータではなく、あなた一人のために。
          <br />
          占い師 revela が魂を込めて読み解く、本物の鑑定書です。
        </p>
        <div className="divider-gold w-20 mx-auto" />
      </section>

      {/* Trust signals */}
      <div className="grid grid-cols-3 gap-4 mb-14 max-w-2xl mx-auto">
        {[
          { icon: "✦", label: "監修・占い師", value: "revela" },
          { icon: "⏰", label: "対応時間", value: "毎日 10:00〜22:00" },
          { icon: "📩", label: "受付", value: "24時間受付中" },
        ].map((item) => (
          <div key={item.label} className="card-glow rounded-xl p-4 text-center">
            <div className="text-xl mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>{item.icon}</div>
            <p className="text-xs opacity-40 mb-1">{item.label}</p>
            <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Pricing plans */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.4em] mb-3" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.7 }}>
            PRICING
          </p>
          <h2
            className="text-2xl sm:text-3xl font-light"
            style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
          >
            鑑定プラン
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 flex flex-col ${plan.highlight ? "animate-glow-pulse" : ""}`}
              style={{
                background: plan.highlight
                  ? "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(232,160,191,0.08))"
                  : "rgba(255,255,255,0.04)",
                border: plan.highlight
                  ? "1px solid rgba(255,255,255,0.5)"
                  : "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {plan.highlight && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wider"
                  style={{ background: "rgba(255,255,255,0.15)", color: "#EDEDED" }}
                >
                  おすすめ
                </div>
              )}
              <div className="mb-4">
                <p
                  className="text-sm tracking-wider mb-2 font-medium"
                  style={{ color: "#EDEDED", opacity: 0.9 }}
                >
                  {plan.name}
                </p>
                <p
                  className="text-4xl font-light"
                  style={{ color: "#EDEDED" }}
                >
                  {plan.price}
                </p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs opacity-70">
                    <span style={{ color: "rgba(255,255,255,0.55)", flexShrink: 0, marginTop: "2px" }}>✦</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openModal(plan.id)}
                className="w-full py-3 rounded-full text-sm tracking-widest btn-outline-primary"
              >
                申し込む
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ-style trust notes */}
      <section className="max-w-2xl mx-auto space-y-4 mb-16">
        <h3
          className="text-center text-lg font-light mb-6"
          style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
        >
          安心してご依頼ください
        </h3>
        {[
          {
            q: "個人情報は安全ですか？",
            a: "ご入力いただいた情報は鑑定目的のみに使用し、第三者への提供は一切行いません。",
          },
          {
            q: "どのような形で受け取れますか？",
            a: "ご登録のメールアドレスにPDF形式または直接テキストでお届けします。",
          },
          {
            q: "支払い方法は？",
            a: "銀行振込・クレジットカード（Stripe）に対応しています。お申し込み後にご案内いたします。",
          },
        ].map((item) => (
          <div
            key={item.q}
            className="rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <p className="text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>Q. {item.q}</p>
            <p className="text-sm opacity-60">{item.a}</p>
          </div>
        ))}
      </section>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(10px)" }}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            style={{
              background: "#111",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-xl opacity-40 hover:opacity-100 transition-opacity"
            >
              ×
            </button>

            {submitted ? (
              <div className="text-center py-8 animate-fade-in">
                <div
                  className="text-5xl mb-6"
                  style={{ filter: "drop-shadow(0 0 20px rgba(255,255,255,0.6))" }}
                >
                  ✦
                </div>
                <h3
                  className="text-xl font-light mb-4"
                  style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
                >
                  お申し込みありがとうございます
                </h3>
                <p className="text-sm opacity-60 mb-6 leading-relaxed">
                  ご登録のメールアドレスに確認メールをお送りしました。
                  <br />
                  鑑定の準備ができましたら、改めてご連絡いたします。
                </p>
                <div
                  className="rounded-xl p-4 mb-6 text-sm text-left"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  <p className="text-xs opacity-50 mb-2">選択されたプラン</p>
                  <p style={{ color: "rgba(255,255,255,0.55)" }}>{planData?.name} — {planData?.price}</p>
                </div>
                <button onClick={closeModal} className="btn-outline-primary px-8 py-3 rounded-full text-sm tracking-widest">
                  閉じる
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-xs tracking-[0.3em] mb-2" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.7 }}>
                    APPLY
                  </p>
                  <h3
                    className="text-xl font-light"
                    style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
                  >
                    鑑定お申し込みフォーム
                  </h3>
                  {planData && (
                    <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {planData.name} — {planData.price}
                    </p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { key: "name", label: "お名前", type: "text", placeholder: "山田 花子" },
                    { key: "email", label: "メールアドレス", type: "email", placeholder: "your@email.com" },
                    { key: "birthdate", label: "生年月日", type: "date", placeholder: "" },
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs tracking-widest mb-1.5 opacity-60">{label}</label>
                      <input
                        type={type}
                        required
                        placeholder={placeholder}
                        value={form[key as keyof FormData]}
                        onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.3)",
                          color: "#EDEDED",
                          colorScheme: "dark",
                        }}
                      />
                    </div>
                  ))}

                  {/* Plan selector */}
                  <div>
                    <label className="block text-xs tracking-widest mb-1.5 opacity-60">プラン</label>
                    <select
                      value={form.plan}
                      onChange={(e) => setForm((prev) => ({ ...prev, plan: e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "#EDEDED",
                        colorScheme: "dark",
                      }}
                    >
                      {PLANS.map((p) => (
                        <option key={p.id} value={p.id} style={{ background: "#0a0a0a" }}>
                          {p.name} — {p.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs tracking-widest mb-1.5 opacity-60">ご要望・お悩み（任意）</label>
                    <textarea
                      rows={3}
                      placeholder="特に知りたいこと、お悩みなどをご自由にお書きください"
                      value={form.message}
                      onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "#EDEDED",
                      }}
                    />
                  </div>

                  <button type="submit" className="btn-outline-primary w-full py-3 rounded-full text-sm tracking-widest">
                    申し込む
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
