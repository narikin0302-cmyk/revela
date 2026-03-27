"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-4xl mb-4">🔮</div>
      <h2
        className="text-xl font-light mb-3"
        style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
      >
        星の巡りが乱れています...
      </h2>
      <p className="opacity-60 text-sm mt-2 mb-6">予期しないエラーが発生しました</p>
      <button
        onClick={reset}
        className="btn-outline-primary px-6 py-3 rounded-full text-sm"
      >
        もう一度試す
      </button>
    </div>
  );
}
