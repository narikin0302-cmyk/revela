"use client";

import { useState } from "react";
import Link from "next/link";

const MBTI_COLORS: Record<string, string> = {
  INTJ: "#7c3aed",
  INTP: "#8b5cf6",
  ENTJ: "#6d28d9",
  ENTP: "#a78bfa",
  INFJ: "#059669",
  INFP: "#10b981",
  ENFJ: "#047857",
  ENFP: "#34d399",
  ISTJ: "#1d4ed8",
  ISFJ: "#2563eb",
  ESTJ: "#1e40af",
  ESFJ: "#3b82f6",
  ISTP: "#92400e",
  ISFP: "#d97706",
  ESTP: "#b45309",
  ESFP: "#f59e0b",
};

const GROUP_TYPES: Record<string, string[]> = {
  戦略型: ["INTJ", "INTP", "ENTJ", "ENTP"],
  共鳴型: ["INFJ", "INFP", "ENFJ", "ENFP"],
  堅実型: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
  感応型: ["ISTP", "ISFP", "ESTP", "ESFP"],
};

const GROUP_COLORS: Record<string, string> = {
  戦略型: "#7c3aed",
  共鳴型: "#059669",
  堅実型: "#1d4ed8",
  感応型: "#92400e",
};

const FAMOUS_DATA: Record<string, string[]> = {
  INTJ: ["イーロン・マスク", "マーク・ザッカーバーグ", "クリストファー・ノーラン"],
  INTP: ["アルベルト・アインシュタイン", "ビル・ゲイツ", "ラリー・ペイジ"],
  ENTJ: ["スティーブ・ジョブズ", "オプラ・ウィンフリー", "ゴードン・ラムゼイ"],
  ENTP: ["トーマス・エジソン", "ベンジャミン・フランクリン", "コナン・オブライエン"],
  INFJ: ["マーティン・ルーサー・キング", "テイラー・スウィフト", "宮崎駿"],
  INFP: ["ジョニー・デップ", "オードリー・ヘプバーン", "J.R.R. トールキン"],
  ENFJ: ["バラク・オバマ", "オプラ・ウィンフリー", "坂本龍馬"],
  ENFP: ["ロビン・ウィリアムズ", "ウィル・スミス", "アン・フランク"],
  ISTJ: ["ジェフ・ベゾス", "ナタリー・ポートマン", "ジョージ・ワシントン"],
  ISFJ: ["ビヨンセ", "マザー・テレサ", "ケイト・ミドルトン"],
  ESTJ: ["ミシェル・オバマ", "ヒラリー・クリントン", "フランク・シナトラ"],
  ESFJ: ["テイラー・スウィフト（初期）", "セレーナ・ゴメス", "ビル・クリントン"],
  ISTP: ["クリント・イーストウッド", "マイケル・ジョーダン", "ブルース・リー"],
  ISFP: ["マイケル・ジャクソン", "マリリン・モンロー", "ブリトニー・スピアーズ"],
  ESTP: ["マドンナ", "エディ・マーフィ", "ドナルド・トランプ"],
  ESFP: ["マリリン・モンロー", "エルトン・ジョン", "ジェイミー・フォックス"],
};

function getGroupForType(type: string): string {
  for (const [group, types] of Object.entries(GROUP_TYPES)) {
    if (types.includes(type)) return group;
  }
  return "";
}

export default function FamousPage() {
  const [activeFilter, setActiveFilter] = useState<string>("全員");

  const filters = ["全員", "戦略型", "共鳴型", "堅実型", "感応型"];

  const visibleTypes = Object.keys(FAMOUS_DATA).filter((type) => {
    if (activeFilter === "全員") return true;
    return getGroupForType(type) === activeFilter;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        color: "#EDEDED",
        fontFamily: "var(--font-noto-sans-jp), sans-serif",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 16px 80px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: "var(--font-noto-serif-jp), serif",
              fontSize: "clamp(22px, 5vw, 32px)",
              fontWeight: 700,
              letterSpacing: "0.05em",
              marginBottom: 12,
              color: "#EDEDED",
            }}
          >
            有名人・芸能人のMBTI一覧
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(237,237,237,0.6)",
              lineHeight: 1.7,
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            世界の著名人に一般的に言われているMBTIタイプをまとめました。
            あなたと同じタイプの有名人を探してみましょう。
          </p>
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          {filters.map((f) => {
            const isActive = activeFilter === f;
            const color = f === "全員" ? "#a0a0b0" : GROUP_COLORS[f];
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 9999,
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 400,
                  border: `1px solid ${isActive ? color : "rgba(255,255,255,0.15)"}`,
                  background: isActive ? `${color}22` : "transparent",
                  color: isActive ? color : "rgba(237,237,237,0.55)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.05em",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Type cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {visibleTypes.map((type) => {
            const color = MBTI_COLORS[type];
            const people = FAMOUS_DATA[type];
            return (
              <div
                key={type}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid rgba(255,255,255,0.08)`,
                  borderLeft: `3px solid ${color}`,
                  borderRadius: 12,
                  padding: "20px 24px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-cinzel), serif",
                      fontSize: 18,
                      fontWeight: 700,
                      color: color,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {type}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: color,
                      background: `${color}22`,
                      border: `1px solid ${color}44`,
                      borderRadius: 4,
                      padding: "2px 8px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {getGroupForType(type)}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {people.map((person) => (
                    <span
                      key={person}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 9999,
                        fontSize: 13,
                        background: `${color}18`,
                        border: `1px solid ${color}44`,
                        color: "rgba(237,237,237,0.85)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {person}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p
          style={{
            marginTop: 40,
            fontSize: 12,
            color: "rgba(237,237,237,0.35)",
            textAlign: "center",
            lineHeight: 1.7,
          }}
        >
          ※ これらは一般的に言われているタイプであり、公式に確認されたものではありません。
        </p>

        {/* CTA */}
        <div
          style={{
            marginTop: 40,
            padding: "32px 24px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-noto-serif-jp), serif",
              fontSize: 16,
              marginBottom: 8,
              color: "#EDEDED",
            }}
          >
            あなたのMBTIタイプは何ですか？
          </p>
          <p
            style={{
              fontSize: 13,
              color: "rgba(237,237,237,0.5)",
              marginBottom: 20,
            }}
          >
            無料診断で自分のタイプを発見しよう
          </p>
          <Link
            href="/shindan"
            style={{
              display: "inline-block",
              padding: "12px 40px",
              borderRadius: 9999,
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}
          >
            ✦ 診断をはじめる
          </Link>
        </div>
      </div>
    </div>
  );
}
