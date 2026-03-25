export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: "#0a0a0a" }}>
      {/* Spinning ring */}
      <div className="relative mb-8">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          style={{ animation: "spin 2s linear infinite" }}
        >
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="url(#loadGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="60 210"
          />
          <defs>
            <linearGradient id="loadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Logo in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-lg tracking-[0.3em] font-light"
            style={{
              color: "rgba(255,255,255,0.7)",
              fontFamily: "var(--font-noto-serif-jp), serif",
            }}
          >
            rev
          </span>
        </div>
      </div>

      {/* revela text */}
      <p
        className="text-xl tracking-[0.5em] font-light mb-2"
        style={{
          color: "rgba(255,255,255,0.7)",
          fontFamily: "var(--font-noto-serif-jp), serif",
        }}
      >
        revela
      </p>
      <p className="text-xs tracking-[0.3em] opacity-30">分析中…</p>
    </div>
  );
}
