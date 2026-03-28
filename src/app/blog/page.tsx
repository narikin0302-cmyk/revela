"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import type { NotionArticle } from "@/lib/notion";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
}

const TAG_COLORS: Record<string, string> = {
  "MBTI基礎": "#7c3aed", "MBTI解説": "#8b5cf6", "MBTI相性": "#059669",
  "MBTI活用": "#047857", "16タイプ": "#6d28d9",
  INTJ: "#7c3aed", INTP: "#8b5cf6", ENTJ: "#6d28d9", ENTP: "#a78bfa",
  INFJ: "#059669", INFP: "#10b981", ENFJ: "#047857", ENFP: "#34d399",
  ISTJ: "#1d4ed8", ISFJ: "#2563eb", ESTJ: "#1e40af", ESFJ: "#0891b2",
  ISTP: "#92400e", ISFP: "#d97706", ESTP: "#b45309", ESFP: "#f59e0b",
  "仕事・キャリア": "#1d4ed8", "恋愛": "#db2777", "人間関係": "#0891b2",
  "自己分析": "#92400e", "性格分析": "#a78bfa", "ラブタイプ": "#ec4899",
  "職業RPG": "#7c3aed", "LEADERロール": "#6d28d9", "SUPPORTロール": "#2563eb",
  "BRAINロール": "#7c3aed", "TRICKSTERロール": "#a78bfa", "チーム分析": "#047857",
};

const MBTI_TO_RPG_ROLE: Record<string, string> = {
  ENTJ: "LEADERロール", ESTJ: "LEADERロール", ENFJ: "LEADERロール", ESTP: "LEADERロール",
  ISFJ: "SUPPORTロール", ESFJ: "SUPPORTロール", ISTJ: "SUPPORTロール", INFP: "SUPPORTロール",
  INTJ: "BRAINロール", INTP: "BRAINロール", ISTP: "BRAINロール", INFJ: "BRAINロール",
  ENTP: "TRICKSTERロール", ENFP: "TRICKSTERロール", ISFP: "TRICKSTERロール", ESFP: "TRICKSTERロール",
};

const ALL_MBTI = [
  "INTJ","INTP","ENTJ","ENTP","INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ","ISTP","ISFP","ESTP","ESFP",
];

const CATEGORY_TAGS = [
  "MBTI解説","MBTI相性","MBTI活用","仕事・キャリア","恋愛","ラブタイプ",
  "職業RPG","LEADERロール","SUPPORTロール","BRAINロール","TRICKSTERロール","16タイプ",
];

interface UserProfile {
  mbti: string | null;
  loveType: string | null;
  rpgRole: string | null;
}

function loadUserProfile(): UserProfile {
  try {
    const mbti = localStorage.getItem("revela_mbti");
    const historyRaw = localStorage.getItem("revela_history");
    let loveType: string | null = null;
    if (historyRaw) {
      const history = JSON.parse(historyRaw) as { loveType?: string }[];
      loveType = history.find((h) => h.loveType)?.loveType ?? null;
    }
    const rpgRole = mbti ? (MBTI_TO_RPG_ROLE[mbti] ?? null) : null;
    return { mbti, loveType, rpgRole };
  } catch {
    return { mbti: null, loveType: null, rpgRole: null };
  }
}

function TagChip({ tag, active, onToggle, small }: {
  tag: string; active?: boolean; onToggle: () => void; small?: boolean;
}) {
  const color = TAG_COLORS[tag] ?? "#6b7280";
  return (
    <button
      onClick={onToggle}
      style={{
        padding: small ? "2px 10px" : "5px 14px",
        borderRadius: 9999,
        fontSize: small ? 11 : 12,
        background: active ? `${color}33` : `${color}11`,
        border: `1px solid ${active ? color : `${color}44`}`,
        color: active ? color : `${color}aa`,
        letterSpacing: "0.03em",
        cursor: "pointer",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
      }}
    >
      {tag}
      {active && <span style={{ marginLeft: 6, opacity: 0.7 }}>×</span>}
    </button>
  );
}

export default function BlogPage() {
  const [articles, setArticles] = useState<NotionArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ mbti: null, loveType: null, rpgRole: null });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => { setArticles(data); setLoading(false); })
      .catch(() => setLoading(false));
    setProfile(loadUserProfile());
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggleFilter(tag: string) {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((f) => f !== tag) : [...prev, tag]
    );
  }

  const filtered = articles.filter((article) => {
    const matchSearch =
      search === "" ||
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilters.length === 0 ||
      activeFilters.some((f) => article.tags.includes(f));
    return matchSearch && matchFilter;
  });

  // Your profile quick tags
  const profileTags: { label: string; tag: string; sub: string }[] = [];
  if (profile.mbti) {
    profileTags.push({ label: profile.mbti, tag: profile.mbti, sub: "MBTI" });
    profileTags.push({ label: "恋愛", tag: "恋愛", sub: "ラブ" });
  }
  if (profile.rpgRole) {
    profileTags.push({ label: profile.rpgRole, tag: profile.rpgRole, sub: "RPG" });
  }

  // All tags available for + dropdown (exclude already active)
  const availableMbti = ALL_MBTI.filter((t) => !activeFilters.includes(t));
  const availableCategories = CATEGORY_TAGS.filter((t) => !activeFilters.includes(t));

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "#EDEDED", fontFamily: "var(--font-noto-sans-jp), sans-serif" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 16px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{
            fontFamily: "var(--font-noto-serif-jp), serif",
            fontSize: "clamp(24px, 5vw, 36px)",
            fontWeight: 700,
            letterSpacing: "0.05em",
            marginBottom: 12,
            color: "#EDEDED",
          }}>
            MBTIブログ
          </h1>
          <p style={{ fontSize: 14, color: "rgba(237,237,237,0.55)", lineHeight: 1.7 }}>
            自己分析に役立つMBTI解説・相性・キャリアの記事
          </p>
        </div>

        {/* Search bar */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <span style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            fontSize: 15, color: "rgba(237,237,237,0.3)",
          }}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="タイトル・内容で検索..."
            style={{
              width: "100%",
              padding: "12px 16px 12px 40px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              color: "#EDEDED",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              letterSpacing: "0.03em",
            }}
            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.25)"; }}
            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
          />
        </div>

        {/* Your profile quick tabs */}
        {profileTags.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 11, color: "rgba(237,237,237,0.3)", letterSpacing: "0.15em", marginBottom: 8 }}>
              ✦ あなた向け
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {profileTags.map(({ label, tag, sub }) => (
                <button
                  key={tag}
                  onClick={() => toggleFilter(tag)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 9999,
                    fontSize: 12,
                    background: activeFilters.includes(tag) ? `${TAG_COLORS[tag] ?? "#6b7280"}33` : "rgba(255,255,255,0.05)",
                    border: `1px solid ${activeFilters.includes(tag) ? (TAG_COLORS[tag] ?? "#6b7280") : "rgba(255,255,255,0.12)"}`,
                    color: activeFilters.includes(tag) ? (TAG_COLORS[tag] ?? "#EDEDED") : "rgba(237,237,237,0.6)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    letterSpacing: "0.05em",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 10, opacity: 0.5 }}>{sub}</span>
                  {label}
                  {activeFilters.includes(tag) && <span style={{ opacity: 0.6 }}>×</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active filters + add button */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 24 }}>
          {activeFilters
            .filter((f) => !profileTags.some((p) => p.tag === f))
            .map((tag) => (
              <TagChip key={tag} tag={tag} active onToggle={() => toggleFilter(tag)} />
            ))}

          {/* + button */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setShowDropdown((v) => !v)}
              style={{
                padding: "5px 14px",
                borderRadius: 9999,
                fontSize: 12,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(237,237,237,0.5)",
                cursor: "pointer",
                letterSpacing: "0.05em",
                transition: "all 0.15s ease",
              }}
            >
              ＋ タグを追加
            </button>

            {showDropdown && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                zIndex: 100,
                background: "rgba(12,12,12,0.97)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14,
                padding: "16px",
                width: 280,
                boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
                backdropFilter: "blur(20px)",
              }}>
                <p style={{ fontSize: 10, color: "rgba(237,237,237,0.3)", letterSpacing: "0.15em", marginBottom: 10 }}>
                  MBTIタイプ
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {availableMbti.map((tag) => (
                    <TagChip key={tag} tag={tag} onToggle={() => { toggleFilter(tag); setShowDropdown(false); }} small />
                  ))}
                </div>
                <p style={{ fontSize: 10, color: "rgba(237,237,237,0.3)", letterSpacing: "0.15em", marginBottom: 10 }}>
                  カテゴリ
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {availableCategories.map((tag) => (
                    <TagChip key={tag} tag={tag} onToggle={() => { toggleFilter(tag); setShowDropdown(false); }} small />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear all */}
          {activeFilters.length > 0 && (
            <button
              onClick={() => setActiveFilters([])}
              style={{
                fontSize: 11,
                color: "rgba(237,237,237,0.3)",
                background: "none",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.05em",
                padding: "5px 8px",
              }}
            >
              クリア
            </button>
          )}
        </div>

        {/* Results count */}
        {!loading && (activeFilters.length > 0 || search) && (
          <p style={{ fontSize: 12, color: "rgba(237,237,237,0.3)", marginBottom: 16, letterSpacing: "0.05em" }}>
            {filtered.length} 件
          </p>
        )}

        {/* Article list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 13, color: "rgba(237,237,237,0.3)", letterSpacing: "0.1em" }}>読み込み中...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 13, color: "rgba(237,237,237,0.3)" }}>
              {articles.length === 0 ? "記事がまだありません" : "該当する記事が見つかりませんでした"}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {filtered.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: "none" }}>
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
                  <div style={{ fontSize: 12, color: "rgba(237,237,237,0.35)", marginBottom: 10, letterSpacing: "0.05em" }}>
                    {formatDate(article.date)}
                  </div>
                  <h2 style={{
                    fontFamily: "var(--font-noto-serif-jp), serif",
                    fontSize: "clamp(16px, 3vw, 20px)",
                    fontWeight: 700,
                    color: "#EDEDED",
                    marginBottom: 10,
                    lineHeight: 1.5,
                    letterSpacing: "0.02em",
                  }}>
                    {article.title}
                  </h2>
                  <p style={{ fontSize: 13, color: "rgba(237,237,237,0.55)", lineHeight: 1.7, marginBottom: 14 }}>
                    {article.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {article.tags.map((tag) => {
                      const color = TAG_COLORS[tag] ?? "#6b7280";
                      const isActive = activeFilters.includes(tag);
                      return (
                        <span key={tag} style={{
                          padding: "3px 10px",
                          borderRadius: 9999,
                          fontSize: 11,
                          background: isActive ? `${color}33` : `${color}22`,
                          border: `1px solid ${isActive ? color : `${color}44`}`,
                          color: color,
                          letterSpacing: "0.03em",
                        }}>
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
