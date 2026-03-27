"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { RPG_CLASSES } from "@/data/rpgClasses";
import { CLASS_ROLES, analyzePartySynergy, type RoleType } from "@/data/rpgSynergy";
import type { PartyMember } from "@/lib/supabase";

function getGroupScale(count: number) {
  if (count <= 3)  return { name: "小隊",      nameEn: "Trio",  icon: "⚔️" };
  if (count <= 8)  return { name: "パーティー", nameEn: "Party", icon: "🛡️" };
  if (count <= 24) return { name: "討伐隊",     nameEn: "Raid",  icon: "⚔️" };
  return             { name: "巨大ギルド",   nameEn: "Guild", icon: "🏰" };
}

type RoleCounts = Record<RoleType, number>;

function countRoles(members: PartyMember[]): RoleCounts {
  const counts: RoleCounts = { LEADER: 0, SUPPORT: 0, BRAIN: 0, TRICKSTER: 0 };
  for (const m of members) {
    const role = CLASS_ROLES[m.rpg_class];
    if (role) counts[role]++;
  }
  return counts;
}

const ROLE_INFO: Record<RoleType, { label: string; color: string }> = {
  LEADER:    { label: "前衛 (LEADER)",    color: "#f87171" },
  SUPPORT:   { label: "後衛 (SUPPORT)",   color: "#34d399" },
  BRAIN:     { label: "頭脳 (BRAIN)",     color: "#818cf8" },
  TRICKSTER: { label: "自由 (TRICKSTER)", color: "#c084fc" },
};

function getClassEmoji(c: string) {
  return RPG_CLASSES.find((r) => r.name === c)?.emoji ?? "⚔️";
}
function getClassColor(c: string) {
  return RPG_CLASSES.find((r) => r.name === c)?.color ?? "#EDEDED";
}

export default function PartyResultPage() {
  const { id } = useParams<{ id: string }>();
  const [members, setMembers] = useState<PartyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/party/${id}`)
      .then((r) => r.json())
      .then((d) => { setMembers(d.members ?? []); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-cinzel text-xs tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
          ANALYZING...
        </p>
      </div>
    );
  }

  const total   = members.length;
  const counts  = countRoles(members);
  const scale   = getGroupScale(total);
  const synergy = analyzePartySynergy(members.map((m) => m.rpg_class));

  const shareText = `【${scale.name}シナジー解析】\n${total}人のパーティーは「${synergy.name}」\n「${synergy.title}」\n\n#revela #パーティー診断`;

  function share() {
    if (navigator.share) {
      navigator.share({ text: shareText, url: window.location.href });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 max-w-lg mx-auto">

      {/* ── グループスケール ── */}
      <div className="text-center mb-10">
        <p className="font-cinzel text-xs tracking-[0.4em] mb-2" style={{ color: "rgba(212,175,55,0.6)" }}>
          {scale.nameEn.toUpperCase()} · {total} MEMBERS
        </p>
        <div className="text-4xl mb-3">{scale.icon}</div>
        <h1
          className="font-cinzel text-3xl font-bold mb-1"
          style={{
            background: "linear-gradient(135deg, #d4af37 0%, #f0d060 50%, #d4af37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {scale.name}
        </h1>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          {total}人のシナジー解析結果
        </p>
      </div>

      {/* ── メイン判定 ── */}
      <div
        className="w-full rounded-2xl p-6 mb-6"
        style={{ background: `${synergy.color}0d`, border: `1px solid ${synergy.color}44` }}
      >
        <div className="flex items-center gap-3 mb-5">
          <span
            className="font-cinzel text-xl font-bold px-3 py-1 rounded-lg shrink-0"
            style={{ background: `${synergy.color}22`, color: synergy.color }}
          >
            {synergy.rank}
          </span>
          <div>
            <p className="font-bold text-base" style={{ color: synergy.color }}>{synergy.name}</p>
            <p className="text-xs font-cinzel" style={{ color: "rgba(255,255,255,0.35)" }}>{synergy.nameEn}</p>
          </div>
        </div>

        <p
          className="text-lg font-bold leading-snug mb-4"
          style={{ color: "#EDEDED", fontFamily: "var(--font-noto-serif-jp), serif" }}
        >
          「{synergy.title}」
        </p>

        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
          {synergy.description}
        </p>
      </div>

      {/* ── パーティーバランスゲージ ── */}
      <div
        className="w-full rounded-2xl p-5 mb-6"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <p className="text-xs tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
          PARTY BALANCE
        </p>
        <div className="space-y-3">
          {(["LEADER", "SUPPORT", "BRAIN", "TRICKSTER"] as RoleType[]).map((role) => {
            const info = ROLE_INFO[role];
            const count = counts[role];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={role}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: info.color }}>{info.label}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>{count}人 {pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: info.color, transition: "width 1s ease" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 強み / 弱点 / アドバイス ── */}
      <div className="w-full space-y-3 mb-6">
        {/* 強み */}
        <div
          className="rounded-xl p-5"
          style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)" }}
        >
          <p className="text-xs tracking-widest mb-2" style={{ color: "#34d399" }}>
            ✦ 強み / Advantage
          </p>
          <p className="text-sm font-bold mb-2" style={{ color: "#EDEDED" }}>
            「{synergy.advantage.label}」
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            {synergy.advantage.text}
          </p>
        </div>

        {/* 弱点 */}
        <div
          className="rounded-xl p-5"
          style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)" }}
        >
          <p className="text-xs tracking-widest mb-2" style={{ color: "#f87171" }}>
            ⚠ 弱点 / Fatal Flaw
          </p>
          <p className="text-sm font-bold mb-2" style={{ color: "#EDEDED" }}>
            「{synergy.fatalFlaw.label}」
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            {synergy.fatalFlaw.text}
          </p>
        </div>

        {/* アドバイス */}
        <div
          className="rounded-xl p-5"
          style={{ background: `${synergy.color}08`, border: `1px solid ${synergy.color}33` }}
        >
          <p className="text-xs tracking-widest mb-2" style={{ color: synergy.color }}>
            ⚔ アドバイス / Next Strategy
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            {synergy.nextStrategy.text}
          </p>
        </div>
      </div>

      {/* ── メンバー一覧 ── */}
      <div className="w-full mb-8">
        <p className="text-xs tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
          MEMBERS
        </p>
        <div className="grid grid-cols-2 gap-2">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-lg">{getClassEmoji(m.rpg_class)}</span>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: "#EDEDED" }}>{m.name}</p>
                <p className="text-xs truncate" style={{ color: getClassColor(m.rpg_class) }}>{m.rpg_class}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── シェア ── */}
      <div className="w-full space-y-3">
        <button
          onClick={share}
          className="btn-outline-primary w-full py-4 rounded-full text-sm"
        >
          <span>📣　結果をシェアする</span>
        </button>
        <a
          href="/party"
          className="btn-outline-primary block w-full py-3 rounded-full text-center text-sm"
        >
          新しいパーティーを結成する
        </a>
      </div>
    </div>
  );
}
