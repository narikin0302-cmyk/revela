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
  "性格タイプ基礎": "#7c3aed", "性格タイプ解説": "#8b5cf6", "性格タイプ相性": "#059669",
  "性格タイプ活用": "#047857", "16タイプ": "#6d28d9",
  INTJ: "#7c3aed", INTP: "#8b5cf6", ENTJ: "#6d28d9", ENTP: "#a78bfa",
  INFJ: "#059669", INFP: "#10b981", ENFJ: "#047857", ENFP: "#34d399",
  ISTJ: "#1d4ed8", ISFJ: "#2563eb", ESTJ: "#1e40af", ESFJ: "#0891b2",
  ISTP: "#92400e", ISFP: "#d97706", ESTP: "#b45309", ESFP: "#f59e0b",
  "仕事・キャリア": "#1d4ed8", "恋愛": "#db2777", "人間関係": "#0891b2",
  "自己分析": "#92400e", "性格分析": "#a78bfa", "行動スタイル": "#ec4899",
  "職業RPG": "#7c3aed", "LEADERロール": "#6d28d9", "SUPPORTロール": "#2563eb",
  "BRAINロール": "#7c3aed", "TRICKSTERロール": "#a78bfa", "チーム分析": "#047857",
  "上司": "#dc2626", "職場": "#b45309", "PTA": "#059669", "育児・学校": "#0891b2",
  "姑": "#db2777", "家族": "#ec4899", "ママ友": "#10b981", "コミュニケーション": "#6d28d9",
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
  "性格タイプ解説","性格タイプ相性","性格タイプ活用","仕事・キャリア","恋愛","行動スタイル",
  "職業RPG","LEADERロール","SUPPORTロール","BRAINロール","TRICKSTERロール","16タイプ",
  "人間関係","上司","職場","PTA","育児・学校","姑","家族","ママ友","コミュニケーション",
];

// MBTIタイプ個別タグは除外（＋ボタン側に表示）
const EXCLUDED_FROM_QUICK = new Set([
  "INTJ","INTP","ENTJ","ENTP","INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ","ISTP","ISFP","ESTP","ESFP",
]);

const TREE_SECTIONS = [
  { key: "性格タイプ",   label: "性格タイプ解説",   emoji: "🧠", desc: "16タイプの特徴・強み・弱み・向いている仕事" },
  { key: "行動スタイル", label: "行動スタイル",   emoji: "💘", desc: "性格タイプ別の恋愛傾向・相性" },
  { key: "職業RPG", label: "職業RPGクラス",   emoji: "⚔️", desc: "4ロールとクラスの詳細解説" },
  { key: "職場環境", label: "職場環境",        emoji: "🏢", desc: "業種別・チーム陣形の分析" },
  { key: "人間関係", label: "人間関係攻略",   emoji: "🤝", desc: "上司・姑・PTA・ママ友…ニッチな人間関係をRPGロールで解剖" },
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

function ArticleCard({ article, activeFilters }: { article: NotionArticle; activeFilters: string[] }) {
  return (
    <Link href={`/blog/${article.slug}`} style={{ textDecoration: "none" }}>
      <article
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: "18px 20px",
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
        <div style={{ fontSize: 11, color: "rgba(237,237,237,0.3)", marginBottom: 6, letterSpacing: "0.05em" }}>
          {formatDate(article.date)}
        </div>
        <h3 style={{
          fontFamily: "var(--font-noto-serif-jp), serif",
          fontSize: "clamp(14px, 2.5vw, 17px)",
          fontWeight: 700,
          color: "#EDEDED",
          marginBottom: 6,
          lineHeight: 1.5,
          letterSpacing: "0.02em",
        }}>
          {article.title}
        </h3>
        <p style={{ fontSize: 12, color: "rgba(237,237,237,0.5)", lineHeight: 1.7, marginBottom: 10 }}>
          {article.description}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {article.tags.map((tag) => {
            const color = TAG_COLORS[tag] ?? "#6b7280";
            const isActive = activeFilters.includes(tag);
            return (
              <span key={tag} style={{
                padding: "2px 8px",
                borderRadius: 9999,
                fontSize: 10,
                background: isActive ? `${color}33` : `${color}18`,
                border: `1px solid ${isActive ? color : `${color}33`}`,
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
  );
}

function TreeSection({
  section, articles, activeFilters, defaultOpen,
}: {
  section: typeof TREE_SECTIONS[0];
  articles: NotionArticle[];
  activeFilters: string[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const filtered = activeFilters.length > 0
    ? articles.filter((a) => activeFilters.some((f) => a.tags.includes(f)))
    : articles;

  return (
    <div style={{ marginBottom: 8 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          background: open ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: open ? "12px 12px 0 0" : 12,
          cursor: "pointer",
          transition: "all 0.2s ease",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>{section.emoji}</span>
          <div>
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#EDEDED",
              letterSpacing: "0.05em",
              fontFamily: "var(--font-noto-serif-jp), serif",
            }}>
              {section.label}
            </div>
            <div style={{ fontSize: 11, color: "rgba(237,237,237,0.35)", marginTop: 2 }}>
              {section.desc}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 11,
            color: "rgba(237,237,237,0.35)",
            background: "rgba(255,255,255,0.06)",
            padding: "2px 8px",
            borderRadius: 9999,
          }}>
            {filtered.length}本
          </span>
          <span style={{
            fontSize: 12,
            color: "rgba(237,237,237,0.4)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            display: "inline-block",
          }}>▼</span>
        </div>
      </button>

      {open && (
        <div style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderTop: "none",
          borderRadius: "0 0 12px 12px",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          background: "rgba(255,255,255,0.01)",
        }}>
          {filtered.length === 0 ? (
            <p style={{ fontSize: 12, color: "rgba(237,237,237,0.25)", textAlign: "center", padding: "20px 0" }}>
              該当する記事がありません
            </p>
          ) : (
            filtered.map((a) => (
              <ArticleCard key={a.slug} article={a} activeFilters={activeFilters} />
            ))
          )}
        </div>
      )}
    </div>
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

  // カテゴリ・検索フィルタリング
  function getArticlesByCategory(cat: string): NotionArticle[] {
    return articles.filter((a) => {
      const matchCat = a.category.includes(cat);
      const matchSearch =
        search === "" ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  const introArticles = articles.filter((a) => {
    const matchCat = a.category.includes("イントロ");
    const matchSearch =
      search === "" ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilters.length === 0 ||
      activeFilters.some((f) => a.tags.includes(f));
    return matchCat && matchSearch && matchFilter;
  });

  // Profile quick tabs
  const profileTags: { label: string; tag: string; sub: string }[] = [];
  if (profile.mbti) {
    profileTags.push({ label: profile.mbti, tag: profile.mbti, sub: "性格タイプ" });
    profileTags.push({ label: "恋愛", tag: "恋愛", sub: "本音" });
  }
  if (profile.rpgRole) {
    profileTags.push({ label: profile.rpgRole, tag: profile.rpgRole, sub: "RPG" });
  }

  const availableMbti = ALL_MBTI.filter((t) => !activeFilters.includes(t));
  const availableCategories = CATEGORY_TAGS.filter((t) => !activeFilters.includes(t));

  // 記事タグから動的にクイックタブを生成（MBTIタイプ個別は除外）
  const quickTags = Array.from(
    articles.flatMap((a) => a.tags).reduce((acc, tag) => {
      if (!EXCLUDED_FROM_QUICK.has(tag)) acc.set(tag, (acc.get(tag) ?? 0) + 1);
      return acc;
    }, new Map<string, number>())
  )
    .sort((a, b) => b[1] - a[1]) // 使用頻度順
    .map(([tag]) => tag);

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
            性格タイプブログ
          </h1>
          <p style={{ fontSize: 14, color: "rgba(237,237,237,0.55)", lineHeight: 1.7 }}>
            自己分析に役立つ性格タイプ解説・相性・キャリアの記事
          </p>
        </div>

        {/* Search bar */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "rgba(237,237,237,0.3)" }}>🔍</span>
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

        {/* Quick category tabs（記事タグから自動生成） */}
        {quickTags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {quickTags.map((tag) => {
              const color = TAG_COLORS[tag] ?? "#6b7280";
              const active = activeFilters.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleFilter(tag)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 9999,
                    fontSize: 12,
                    background: active ? `${color}33` : `${color}11`,
                    border: `1px solid ${active ? color : `${color}44`}`,
                    color: active ? color : `${color}bb`,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    letterSpacing: "0.04em",
                  }}
                >
                  {tag}
                  {active && <span style={{ marginLeft: 5, opacity: 0.6 }}>×</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Your profile quick tabs */}
        {profileTags.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 11, color: "rgba(237,237,237,0.3)", letterSpacing: "0.15em", marginBottom: 8 }}>✦ あなた向け</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {profileTags.map(({ label, tag, sub }) => (
                <button
                  key={tag}
                  onClick={() => toggleFilter(tag)}
                  style={{
                    padding: "5px 14px",
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

        {/* Active filters + add */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 32 }}>
          {activeFilters.filter((f) => !profileTags.some((p) => p.tag === f)).map((tag) => {
            const color = TAG_COLORS[tag] ?? "#6b7280";
            return (
              <button key={tag} onClick={() => toggleFilter(tag)} style={{
                padding: "4px 12px", borderRadius: 9999, fontSize: 12,
                background: `${color}33`, border: `1px solid ${color}`,
                color: color, cursor: "pointer", letterSpacing: "0.03em",
              }}>
                {tag} <span style={{ marginLeft: 4, opacity: 0.7 }}>×</span>
              </button>
            );
          })}

          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setShowDropdown((v) => !v)}
              style={{
                padding: "4px 12px", borderRadius: 9999, fontSize: 12,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(237,237,237,0.5)", cursor: "pointer", letterSpacing: "0.05em",
              }}
            >
              ＋ タグを追加
            </button>
            {showDropdown && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 100,
                background: "rgba(12,12,12,0.97)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14, padding: "16px", width: 280,
                boxShadow: "0 8px 30px rgba(0,0,0,0.6)", backdropFilter: "blur(20px)",
              }}>
                <p style={{ fontSize: 10, color: "rgba(237,237,237,0.3)", letterSpacing: "0.15em", marginBottom: 10 }}>性格タイプ</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {availableMbti.map((tag) => {
                    const color = TAG_COLORS[tag] ?? "#6b7280";
                    return (
                      <button key={tag} onClick={() => { toggleFilter(tag); setShowDropdown(false); }} style={{
                        padding: "2px 10px", borderRadius: 9999, fontSize: 11,
                        background: `${color}11`, border: `1px solid ${color}44`,
                        color: `${color}aa`, cursor: "pointer",
                      }}>{tag}</button>
                    );
                  })}
                </div>
                <p style={{ fontSize: 10, color: "rgba(237,237,237,0.3)", letterSpacing: "0.15em", marginBottom: 10 }}>カテゴリ</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {availableCategories.map((tag) => {
                    const color = TAG_COLORS[tag] ?? "#6b7280";
                    return (
                      <button key={tag} onClick={() => { toggleFilter(tag); setShowDropdown(false); }} style={{
                        padding: "2px 10px", borderRadius: 9999, fontSize: 11,
                        background: `${color}11`, border: `1px solid ${color}44`,
                        color: `${color}aa`, cursor: "pointer",
                      }}>{tag}</button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {activeFilters.length > 0 && (
            <button onClick={() => setActiveFilters([])} style={{
              fontSize: 11, color: "rgba(237,237,237,0.3)",
              background: "none", border: "none", cursor: "pointer", padding: "4px 8px",
            }}>クリア</button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 13, color: "rgba(237,237,237,0.3)", letterSpacing: "0.1em" }}>読み込み中...</p>
          </div>
        ) : (
          <>
            {/* イントロ（一番上・常時表示） */}
            {introArticles.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 16 }}>✦</span>
                  <span style={{
                    fontSize: 12,
                    letterSpacing: "0.2em",
                    color: "rgba(237,237,237,0.4)",
                    fontFamily: "var(--font-noto-serif-jp), serif",
                  }}>
                    INTRODUCTION
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {introArticles.map((a) => (
                    <ArticleCard key={a.slug} article={a} activeFilters={activeFilters} />
                  ))}
                </div>
              </div>
            )}

            {/* 区切り線 */}
            {introArticles.length > 0 && (
              <div style={{
                width: "100%", height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                marginBottom: 24,
              }} />
            )}

            {/* ツリーセクション */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {TREE_SECTIONS.map((section) => (
                <TreeSection
                  key={section.key}
                  section={section}
                  articles={getArticlesByCategory(section.key)}
                  activeFilters={activeFilters}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
