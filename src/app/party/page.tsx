"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PartyPage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function createRoom() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/party", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // ホストトークンをlocalStorageに保存
      localStorage.setItem(`party_host_${data.id}`, data.host_token);
      router.push(`/party/${data.id}/join`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
      setLoading(false);
    }
  }

  function joinRoom() {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) {
      setError("ルームコードを入力してください");
      return;
    }
    router.push(`/party/${code}/join`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* タイトル */}
      <div className="text-center mb-12">
        <p
          className="font-cinzel text-xs tracking-[0.4em] mb-4"
          style={{ color: "rgba(212,175,55,0.7)" }}
        >
          PARTY FORMATION
        </p>
        <h1
          className="font-cinzel text-3xl sm:text-4xl font-bold mb-4"
          style={{
            background: "linear-gradient(135deg, #d4af37 0%, #f0d060 50%, #d4af37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          パーティー結成
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
          仲間を招待して、チームのシナジーを解析しよう
          <br />
          最大99人まで参加可能
        </p>
      </div>

      {/* カード */}
      <div className="w-full max-w-sm space-y-4">
        {/* 部屋を作る */}
        <button
          onClick={createRoom}
          disabled={loading}
          className="btn-outline-primary w-full py-4 rounded-full text-sm disabled:opacity-50"
        >
          <span>{loading ? "作成中..." : "⚔️　部屋を作る（ホスト）"}</span>
        </button>

        {/* 区切り */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
          <span className="text-xs tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
            OR
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* 部屋に参加 */}
        <div
          className="rounded-xl p-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p className="text-xs tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
            ルームコードで参加
          </p>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && joinRoom()}
            placeholder="例: BRAVE7"
            maxLength={6}
            className="w-full bg-transparent text-center text-xl tracking-[0.4em] font-cinzel font-bold py-3 border-b outline-none mb-4"
            style={{
              color: "#EDEDED",
              borderColor: "rgba(255,255,255,0.2)",
            }}
          />
          <button
            onClick={joinRoom}
            className="btn-outline-primary w-full py-3 rounded-full text-sm"
          >
            <span>🛡️　参加する（ゲスト）</span>
          </button>
        </div>

        {error && (
          <p className="text-center text-xs" style={{ color: "#f87171" }}>
            {error}
          </p>
        )}
      </div>

      {/* 説明 */}
      <div className="mt-12 max-w-sm w-full space-y-3">
        {[
          { step: "01", text: "ホストが部屋を作り、URLをシェア" },
          { step: "02", text: "メンバーが自分のRPGクラスを入力" },
          { step: "03", text: "パーティーのシナジーを一斉解析" },
        ].map(({ step, text }) => (
          <div key={step} className="flex items-center gap-4">
            <span
              className="font-cinzel text-xs font-bold shrink-0"
              style={{ color: "rgba(212,175,55,0.5)" }}
            >
              {step}
            </span>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
