// Admin analytics placeholder page (no auth — add auth before production)

export default function AdminPage() {
  const stats = {
    totalDiagnoses: 1247,
    todayDiagnoses: 23,
    topMBTI: [
      { type: "INFJ", count: 187, label: "提唱者" },
      { type: "ENFP", count: 156, label: "広報運動家" },
      { type: "INFP", count: 143, label: "仲介者" },
    ],
    topTarot: [
      { name: "星", count: 134 },
      { name: "太陽", count: 121 },
      { name: "月", count: 118 },
    ],
    topChara: [
      { code: "FCRO", nickname: "ロマンスマジシャン", count: 98 },
      { code: "FAPE", nickname: "最後の恋人", count: 91 },
      { code: "LAPO", nickname: "パーフェクトカメレオン", count: 87 },
    ],
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: "11px",
    letterSpacing: "0.3em",
    color: "#d4af37",
    opacity: 0.7,
    marginBottom: "12px",
    textTransform: "uppercase" as const,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "48px 16px",
        maxWidth: "800px",
        margin: "0 auto",
        color: "#f5eee8",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.4em", color: "#d4af37", opacity: 0.7, marginBottom: "8px" }}>
          ADMIN DASHBOARD
        </p>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 300,
            fontFamily: "var(--font-noto-serif-jp), serif",
            marginBottom: "8px",
          }}
        >
          アナリティクス
        </h1>
        <div
          style={{
            height: "1px",
            width: "80px",
            background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            margin: "16px auto 0",
          }}
        />
      </div>

      {/* Top stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <p style={headingStyle}>総診断数</p>
          <p
            style={{
              fontSize: "36px",
              fontWeight: 300,
              background: "linear-gradient(135deg, #d4af37, #f0d060)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {stats.totalDiagnoses.toLocaleString()}
          </p>
          <p style={{ fontSize: "11px", opacity: 0.4, marginTop: "4px" }}>回</p>
        </div>
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <p style={headingStyle}>今日の診断</p>
          <p
            style={{
              fontSize: "36px",
              fontWeight: 300,
              background: "linear-gradient(135deg, #e8a0bf, #f0d060)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {stats.todayDiagnoses}
          </p>
          <p style={{ fontSize: "11px", opacity: 0.4, marginTop: "4px" }}>回</p>
        </div>
      </div>

      {/* Top MBTI */}
      <div style={cardStyle}>
        <p style={headingStyle}>人気MBTI TOP3</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {stats.topMBTI.map((item, i) => (
            <div key={item.type} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "11px", opacity: 0.4, width: "16px" }}>{i + 1}</span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: "#d4af37",
                  fontSize: "13px",
                  width: "48px",
                }}
              >
                {item.type}
              </span>
              <span style={{ fontSize: "11px", opacity: 0.6, flex: 1 }}>{item.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    height: "4px",
                    width: `${(item.count / stats.topMBTI[0].count) * 80}px`,
                    background: "linear-gradient(90deg, #b8941f, #d4af37)",
                    borderRadius: "9999px",
                  }}
                />
                <span style={{ fontSize: "11px", opacity: 0.5, width: "32px", textAlign: "right" }}>
                  {item.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Tarot */}
      <div style={cardStyle}>
        <p style={headingStyle}>人気タロットカード TOP3</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {stats.topTarot.map((item, i) => (
            <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "11px", opacity: 0.4, width: "16px" }}>{i + 1}</span>
              <span style={{ fontWeight: 600, color: "#c084fc", fontSize: "13px", flex: 1 }}>
                {item.name}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    height: "4px",
                    width: `${(item.count / stats.topTarot[0].count) * 80}px`,
                    background: "linear-gradient(90deg, #7c3aed, #c084fc)",
                    borderRadius: "9999px",
                  }}
                />
                <span style={{ fontSize: "11px", opacity: 0.5, width: "32px", textAlign: "right" }}>
                  {item.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Chara */}
      <div style={cardStyle}>
        <p style={headingStyle}>人気キャラクターコード TOP3</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {stats.topChara.map((item, i) => (
            <div key={item.code} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "11px", opacity: 0.4, width: "16px" }}>{i + 1}</span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: "#e8a0bf",
                  fontSize: "12px",
                  width: "44px",
                }}
              >
                {item.code}
              </span>
              <span style={{ fontSize: "11px", opacity: 0.6, flex: 1 }}>{item.nickname}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    height: "4px",
                    width: `${(item.count / stats.topChara[0].count) * 80}px`,
                    background: "linear-gradient(90deg, #c97da8, #e8a0bf)",
                    borderRadius: "9999px",
                  }}
                />
                <span style={{ fontSize: "11px", opacity: 0.5, width: "32px", textAlign: "right" }}>
                  {item.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <div
        style={{
          background: "rgba(248,113,113,0.06)",
          border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: "12px",
          padding: "16px",
          marginTop: "24px",
        }}
      >
        <p style={{ fontSize: "11px", color: "#f87171", opacity: 0.8, letterSpacing: "0.1em", marginBottom: "6px" }}>
          ⚠ 開発メモ
        </p>
        <p style={{ fontSize: "12px", opacity: 0.6, lineHeight: 1.6 }}>
          本番環境では認証を追加予定。現在のデータはプレースホルダーです。
          実装時は localStorage / Supabase のデータを集計する API ルートに接続してください。
        </p>
      </div>
    </div>
  );
}
