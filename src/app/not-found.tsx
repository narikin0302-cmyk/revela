import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — ページが見つかりません | revela",
};

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative animate-fade-in">
        <p
          className="text-xs tracking-[0.5em] mb-8 opacity-30"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          404
        </p>

        <div className="mb-10">
          <div
            className="relative mx-auto rounded-2xl flex items-center justify-center"
            style={{
              width: "120px",
              height: "180px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.12)",
              animation: "spinCard 6s linear infinite",
            }}
          >
            <style>{`
              @keyframes spinCard {
                0% { transform: rotateY(0deg); }
                100% { transform: rotateY(360deg); }
              }
            `}</style>
            <svg viewBox="0 0 100 100" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="5" fill="rgba(255,255,255,0.15)" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                <g key={angle} transform={`rotate(${angle}, 50, 50)`}>
                  <line x1="50" y1="15" x2="50" y2="25" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                  <line x1="50" y1="35" x2="50" y2="45" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
                  <circle cx="50" cy="15" r="1.2" fill="rgba(255,255,255,0.25)" />
                </g>
              ))}
            </svg>
          </div>
        </div>

        <h1
          className="text-2xl sm:text-3xl font-light mb-4"
          style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
        >
          ページが見つかりません
        </h1>
        <p className="text-sm opacity-50 max-w-xs mx-auto leading-relaxed mb-10">
          お探しのページは存在しないか、移動した可能性があります。
        </p>

        <Link
          href="/"
          className="btn-outline-primary inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm tracking-widest"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
