import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedArticles, getArticleBySlug, getArticleContent } from "@/lib/notion";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.title} | 性格タイプブログ | revela`,
    description: article.description,
    keywords: article.tags.join(", "),
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      locale: "ja_JP",
    },
  };
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
}

const TAG_COLORS: Record<string, string> = {
  "性格タイプ基礎": "#7c3aed",
  "性格タイプ解説": "#8b5cf6",
  "性格タイプ相性": "#059669",
  "性格タイプ活用": "#047857",
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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const content = await getArticleContent(article.id);

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
        {/* Back link */}
        <div style={{ marginBottom: 32 }}>
          <Link
            href="/blog"
            style={{
              fontSize: 13,
              color: "rgba(237,237,237,0.45)",
              textDecoration: "none",
              letterSpacing: "0.05em",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← ブログ一覧に戻る
          </Link>
        </div>

        {/* Article header */}
        <header style={{ marginBottom: 40 }}>
          <div
            style={{
              fontSize: 12,
              color: "rgba(237,237,237,0.35)",
              marginBottom: 14,
              letterSpacing: "0.05em",
            }}
          >
            {formatDate(article.date)}
          </div>

          <h1
            style={{
              fontFamily: "var(--font-noto-serif-jp), serif",
              fontSize: "clamp(22px, 5vw, 32px)",
              fontWeight: 700,
              lineHeight: 1.5,
              letterSpacing: "0.03em",
              marginBottom: 20,
              color: "#EDEDED",
            }}
          >
            {article.title}
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "rgba(237,237,237,0.55)",
              lineHeight: 1.8,
              marginBottom: 20,
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
        </header>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            marginBottom: 40,
          }}
        />

        {/* Article content */}
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          style={{
            lineHeight: 1.9,
            fontSize: 15,
            color: "rgba(237,237,237,0.85)",
          }}
          className="blog-article-content"
        />

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            margin: "48px 0",
          }}
        />

        {/* CTA */}
        <div
          style={{
            padding: "32px 24px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "rgba(237,237,237,0.3)",
              marginBottom: 16,
            }}
          >
            REVELA
          </p>
          <p
            style={{
              fontFamily: "var(--font-noto-serif-jp), serif",
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 8,
              color: "#EDEDED",
            }}
          >
            あなたのチームの陣形を確認しよう
          </p>
          <p
            style={{
              fontSize: 13,
              color: "rgba(237,237,237,0.45)",
              lineHeight: 1.8,
              marginBottom: 24,
            }}
          >
            まずは自分の性格タイプと行動スタイルを診断。<br />
            仲間を誘ってパーティーを組めば、チームの陣形がわかる。
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <Link
              href="/party"
              style={{
                display: "inline-block",
                padding: "13px 40px",
                borderRadius: 9999,
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textDecoration: "none",
                width: "100%",
                maxWidth: 320,
                boxSizing: "border-box",
              }}
            >
              ⚔️ パーティーを結成する
            </Link>
            <Link
              href="/shindan"
              style={{
                display: "inline-block",
                padding: "12px 40px",
                borderRadius: 9999,
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(237,237,237,0.7)",
                fontSize: 13,
                letterSpacing: "0.08em",
                textDecoration: "none",
                width: "100%",
                maxWidth: 320,
                boxSizing: "border-box",
              }}
            >
              ✦ まずは診断してみる（無料）
            </Link>
          </div>
        </div>

        {/* Back link bottom */}
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <Link
            href="/blog"
            style={{
              fontSize: 13,
              color: "rgba(237,237,237,0.4)",
              textDecoration: "none",
              letterSpacing: "0.05em",
            }}
          >
            ← ブログ一覧に戻る
          </Link>
        </div>
      </div>

      <style>{`
        .blog-article-content h2 {
          font-family: var(--font-noto-serif-jp), serif;
          font-size: clamp(18px, 3.5vw, 22px);
          font-weight: 700;
          color: #EDEDED;
          margin: 2.5em 0 0.8em;
          letter-spacing: 0.03em;
          padding-bottom: 0.4em;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .blog-article-content h3 {
          font-family: var(--font-noto-serif-jp), serif;
          font-size: clamp(15px, 3vw, 18px);
          font-weight: 600;
          color: rgba(237,237,237,0.9);
          margin: 2em 0 0.6em;
          letter-spacing: 0.02em;
        }
        .blog-article-content p {
          margin: 0 0 1.4em;
          color: rgba(237,237,237,0.75);
        }
        .blog-article-content ul,
        .blog-article-content ol {
          margin: 0 0 1.4em 1.5em;
          color: rgba(237,237,237,0.75);
        }
        .blog-article-content li {
          margin-bottom: 0.5em;
          line-height: 1.8;
        }
        .blog-article-content strong {
          color: rgba(237,237,237,0.95);
          font-weight: 600;
        }
        .blog-article-content blockquote {
          border-left: 3px solid rgba(124,58,237,0.6);
          padding-left: 1em;
          margin: 1.5em 0;
          color: rgba(237,237,237,0.6);
          font-style: italic;
        }
        .blog-article-content pre {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 1em;
          overflow-x: auto;
          margin: 1.5em 0;
        }
        .blog-article-content hr {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.08);
          margin: 2em 0;
        }
      `}</style>
    </div>
  );
}
