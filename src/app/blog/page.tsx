"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NotionArticle } from "@/lib/notion";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
}

const TAG_COLORS: Record<string, string> = {
  "MBTI基礎": "#7c3aed",
  "MBTI解説": "#8b5cf6",
  "MBTI相性": "#059669",
  "MBTI活用": "#047857",
  "16タイプ": "#6d28d9",
  INTJ: "#7c3aed",
  ENFP: "#34d399",
  INFJ: "#059669",
  "仕事・キャリア": "#1d4ed8",
  恋愛: "#db2777",
  人間関係: "#0891b2",
  自己分析: "#92400e",
  性格分析: "#a78bfa",
};

export default function BlogPage() {
  const [articles, setArticles] = useState<NotionArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1
            style={{
              fontFamily: "var(--font-noto-serif-jp), serif",
              fontSize: "clamp(24px, 5vw, 36px)",
              fontWeight: 700,
              letterSpacing: "0.05em",
              marginBottom: 12,
              color: "#EDEDED",
            }}
          >
            MBTIブログ
          </h1>
          <p style={{ fontSize: 14, color: "rgba(237,237,237,0.55)", lineHeight: 1.7 }}>
            自己分析に役立つMBTI解説・相性・キャリアの記事
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 13, color: "rgba(237,237,237,0.3)", letterSpacing: "0.1em" }}>
              読み込み中...
            </p>
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 13, color: "rgba(237,237,237,0.3)" }}>記事がまだありません</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                style={{ textDecoration: "none" }}
              >
                <article
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    padding: "24px",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(237,237,237,0.35)",
                      marginBottom: 10,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {formatDate(article.date)}
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-noto-serif-jp), serif",
                      fontSize: "clamp(16px, 3vw, 20px)",
                      fontWeight: 700,
                      color: "#EDEDED",
                      marginBottom: 10,
                      lineHeight: 1.5,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {article.title}
                  </h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: "rgba(237,237,237,0.55)",
                      lineHeight: 1.7,
                      marginBottom: 14,
                    }}
                  >
                    {article.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {article.tags.map((tag) => {
                      const color = TAG_COLORS[tag] ?? "#6b7280";
                      return (
                        <span
                          key={tag}
                          style={{
                            padding: "3px 10px",
                            borderRadius: 9999,
                            fontSize: 11,
                            background: `${color}22`,
                            border: `1px solid ${color}44`,
                            color: color,
                            letterSpacing: "0.03em",
                          }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
