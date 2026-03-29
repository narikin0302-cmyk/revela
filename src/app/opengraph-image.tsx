import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "revela | 深層の本質を、言語化する。";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle corner accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "rgba(255,255,255,0.08)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 300,
            letterSpacing: "0.15em",
            color: "#EDEDED",
            marginBottom: 16,
            display: "flex",
          }}
        >
          revela
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.3em",
            marginBottom: 48,
            display: "flex",
          }}
        >
          SELF ANALYSIS
        </div>

        {/* Divider */}
        <div
          style={{
            width: 200,
            height: 1,
            background: "rgba(255,255,255,0.15)",
            marginBottom: 48,
          }}
        />

        {/* Icons row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 56,
          }}
        >
          {["🧠", "⭐", "🔮", "♡"].map((icon, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 40 }}>{icon}</span>
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.2em",
                }}
              >
                {["性格タイプ", "星座", "タロット", "行動スタイル"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
