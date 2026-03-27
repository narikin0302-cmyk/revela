"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase, type PartyMember } from "@/lib/supabase";
import { RPG_CLASSES } from "@/data/rpgClasses";

function getClassEmoji(className: string): string {
  return RPG_CLASSES.find((c) => c.name === className)?.emoji ?? "⚔️";
}

function getClassColor(className: string): string {
  return RPG_CLASSES.find((c) => c.name === className)?.color ?? "#EDEDED";
}

export default function PartyRoomPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [members, setMembers] = useState<PartyMember[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [roomStatus, setRoomStatus] = useState<"waiting" | "started">("waiting");

  const joinUrl = typeof window !== "undefined" ? `${window.location.origin}/party/${id}/join` : "";

  const fetchMembers = useCallback(async () => {
    const res = await fetch(`/api/party/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    setMembers(data.members ?? []);
    setRoomStatus(data.room?.status ?? "waiting");
    if (data.room?.status === "started") {
      router.push(`/party/${id}/result`);
    }
  }, [id, router]);

  useEffect(() => {
    const hostToken = localStorage.getItem(`party_host_${id}`);
    setIsHost(!!hostToken);
    setLoading(false);
    fetchMembers();

    // Supabase Realtime subscriptions
    const memberChannel = supabase
      .channel(`party_members_${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "party_members", filter: `room_id=eq.${id}` },
        () => fetchMembers()
      )
      .subscribe();

    const roomChannel = supabase
      .channel(`party_room_${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "party_rooms", filter: `id=eq.${id}` },
        (payload) => {
          if (payload.new.status === "started") {
            router.push(`/party/${id}/result`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(memberChannel);
      supabase.removeChannel(roomChannel);
    };
  }, [id, fetchMembers, router]);

  async function startAnalysis() {
    const hostToken = localStorage.getItem(`party_host_${id}`);
    if (!hostToken) return;
    setStarting(true);
    await fetch(`/api/party/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ host_token: hostToken }),
    });
    router.push(`/party/${id}/result`);
  }

  function copyLink() {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return null;
  if (roomStatus === "started") return null;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <p className="font-cinzel text-xs tracking-[0.4em] mb-2" style={{ color: "rgba(212,175,55,0.6)" }}>
          WAITING ROOM
        </p>
        <h1 className="font-cinzel text-2xl font-bold mb-1" style={{ color: "#EDEDED" }}>
          {id}
        </h1>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          メンバーが集まるまで待機中...
        </p>
      </div>

      {/* 招待リンク */}
      <div
        className="w-full max-w-sm rounded-xl p-4 mb-8"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <p className="text-xs tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
          招待リンク
        </p>
        <div className="flex gap-2 items-center">
          <p className="flex-1 text-xs truncate font-mono" style={{ color: "rgba(255,255,255,0.6)" }}>
            {joinUrl}
          </p>
          <button
            onClick={copyLink}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              background: copied ? "rgba(52,211,153,0.2)" : "rgba(212,175,55,0.15)",
              color: copied ? "#34d399" : "#d4af37",
              border: `1px solid ${copied ? "rgba(52,211,153,0.3)" : "rgba(212,175,55,0.3)"}`,
            }}
          >
            {copied ? "✓ コピー済" : "コピー"}
          </button>
        </div>
      </div>

      {/* メンバーリスト */}
      <div className="w-full max-w-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
            MEMBERS
          </p>
          <span
            className="font-cinzel text-xs font-bold"
            style={{ color: "rgba(212,175,55,0.8)" }}
          >
            {members.length} / 99
          </span>
        </div>

        {members.length === 0 ? (
          <div
            className="rounded-xl py-10 text-center"
            style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
          >
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>
              仲間を待っています...
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="text-xl">{getClassEmoji(m.rpg_class)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#EDEDED" }}>
                    {m.name}
                  </p>
                  <p className="text-xs" style={{ color: getClassColor(m.rpg_class) }}>
                    {m.rpg_class}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 解析開始ボタン（ホストのみ） */}
      {isHost && (
        <div className="w-full max-w-sm">
          <button
            onClick={startAnalysis}
            disabled={members.length < 2 || starting}
            className="btn-outline-primary w-full py-4 rounded-full text-sm disabled:opacity-30"
          >
            <span>{starting ? "解析中..." : `⚔️　${members.length}人でシナジーを解析する`}</span>
          </button>
          {members.length < 2 && (
            <p className="text-center text-xs mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>
              2人以上集まったら解析できます
            </p>
          )}
        </div>
      )}

      {!isHost && (
        <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
          ホストが解析を開始するまでお待ちください
        </p>
      )}
    </div>
  );
}
