"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RPG_CLASSES } from "@/data/rpgClasses";
import { CLASS_ROLES } from "@/data/rpgSynergy";

const ROLE_LABELS: Record<string, string> = {
  LEADER: "前衛",
  SUPPORT: "後衛",
  BRAIN: "頭脳",
  TRICKSTER: "自由",
};

export default function JoinPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function join() {
    if (!name.trim()) { setError("名前を入力してください"); return; }
    if (!selectedClass) { setError("クラスを選択してください"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/party/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), rpg_class: selectedClass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/party/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <p className="font-cinzel text-xs tracking-[0.4em] mb-2" style={{ color: "rgba(212,175,55,0.6)" }}>
          JOIN PARTY · {id}
        </p>
        <h1
          className="font-cinzel text-2xl font-bold mb-2"
          style={{
            background: "linear-gradient(135deg, #d4af37 0%, #f0d060 50%, #d4af37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          パーティーに参加
        </h1>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          名前とクラスを入力してください
        </p>
      </div>

      <div className="w-full max-w-sm space-y-6">
        {/* 名前入力 */}
        <div>
          <p className="text-xs tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
            YOUR NAME
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：たなか"
            maxLength={20}
            className="w-full bg-transparent py-3 border-b outline-none text-sm"
            style={{ color: "#EDEDED", borderColor: "rgba(255,255,255,0.2)" }}
          />
        </div>

        {/* クラス選択 */}
        <div>
          <p className="text-xs tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
            YOUR CLASS
          </p>

          {/* まだ知らない人向けリンク */}
          <a
            href="/chara"
            className="flex items-center gap-2 text-xs mb-4 opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "#d4af37" }}
          >
            <span>✦</span>
            <span>自分のクラスがわからない方はこちらで診断</span>
          </a>

          <div className="space-y-4">
            {([
              { key: "LEADER",    label: "前衛",  color: "#f87171" },
              { key: "SUPPORT",   label: "後衛",  color: "#34d399" },
              { key: "BRAIN",     label: "頭脳",  color: "#818cf8" },
              { key: "TRICKSTER", label: "自由",  color: "#c084fc" },
            ] as const).map((group) => {
              const classes = RPG_CLASSES.filter((cls) => CLASS_ROLES[cls.name] === group.key);
              return (
                <div key={group.key}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-0.5 h-4 rounded-full" style={{ background: group.color }} />
                    <span className="text-xs font-bold tracking-widest" style={{ color: group.color }}>{group.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {classes.map((cls) => {
                      const isSelected = selectedClass === cls.name;
                      return (
                        <button
                          key={cls.id}
                          onClick={() => setSelectedClass(cls.name)}
                          className="flex items-center gap-2 px-3 py-3 rounded-xl text-left transition-all duration-200"
                          style={{
                            background: isSelected ? `${cls.color}22` : "rgba(255,255,255,0.04)",
                            border: `1px solid ${isSelected ? cls.color : "rgba(255,255,255,0.08)"}`,
                          }}
                        >
                          <span className="text-lg">{cls.emoji}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate" style={{ color: isSelected ? cls.color : "#EDEDED" }}>
                              {cls.name}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 選択中のクラス表示 */}
        {selectedClass && (() => {
          const cls = RPG_CLASSES.find((c) => c.name === selectedClass);
          if (!cls) return null;
          return (
            <div
              className="rounded-xl p-4"
              style={{ background: `${cls.color}11`, border: `1px solid ${cls.color}44` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{cls.emoji}</span>
                <div>
                  <p className="font-bold text-sm" style={{ color: cls.color }}>{cls.name}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{cls.tagline}</p>
                </div>
              </div>
            </div>
          );
        })()}

        {error && (
          <p className="text-center text-xs" style={{ color: "#f87171" }}>{error}</p>
        )}

        <button
          onClick={join}
          disabled={loading}
          className="btn-outline-primary w-full py-4 rounded-full text-sm disabled:opacity-50"
        >
          <span>{loading ? "参加中..." : "⚔️　パーティーに参加する"}</span>
        </button>
      </div>
    </div>
  );
}
