"use client";

import { useState, useEffect, useRef } from "react";

interface RevelaUser {
  name: string;
  zodiac: string;
  loginAt: string;
}

const ZODIAC_LIST = [
  { value: "牡羊座", emoji: "♈" },
  { value: "牡牛座", emoji: "♉" },
  { value: "双子座", emoji: "♊" },
  { value: "蟹座",   emoji: "♋" },
  { value: "獅子座", emoji: "♌" },
  { value: "乙女座", emoji: "♍" },
  { value: "天秤座", emoji: "♎" },
  { value: "蠍座",   emoji: "♏" },
  { value: "射手座", emoji: "♐" },
  { value: "山羊座", emoji: "♑" },
  { value: "水瓶座", emoji: "♒" },
  { value: "魚座",   emoji: "♓" },
];

function getZodiacFromBirthdate(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "牡羊座";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "牡牛座";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return "双子座";
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return "蟹座";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "獅子座";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "乙女座";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return "天秤座";
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return "蠍座";
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return "射手座";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "山羊座";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "水瓶座";
  return "魚座";
}

// suppress unused warning
void ZODIAC_LIST;

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: RevelaUser) => void;
}

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("ニックネームを入力してください");
      return;
    }
    if (!birthdate) {
      setError("生年月日を入力してください");
      return;
    }

    const parts = birthdate.split("-");
    if (parts.length !== 3) {
      setError("正しい日付形式で入力してください");
      return;
    }
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const zodiac = getZodiacFromBirthdate(month, day);

    const user: RevelaUser = {
      name: name.trim(),
      zodiac,
      loginAt: new Date().toISOString(),
    };

    localStorage.setItem("revela_user", JSON.stringify(user));
    onLogin(user);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    padding: "12px 16px",
    color: "#EDEDED",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s ease",
    fontFamily: "var(--font-noto-serif-jp), serif",
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.25s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#111",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "24px",
          padding: "32px 28px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          animation: "fadeInUp 0.3s ease",
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <p className="font-cinzel text-xs tracking-[0.4em] mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>REVELA</p>
          <h2
            className="text-xl font-light"
            style={{ fontFamily: "var(--font-noto-serif-jp), serif", color: "#EDEDED" }}
          >
            ログイン
          </h2>
          <div
            className="h-px w-16 mx-auto mt-3"
            style={{ background: "rgba(255,255,255,0.1)" }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-5">
            <div>
              <label
                className="block text-xs tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                ニックネーム
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="あなたの名前"
                style={inputStyle}
                maxLength={20}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.4)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.15)";
                }}
              />
            </div>

            <div>
              <label
                className="block text-xs tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                生年月日 <span className="opacity-50 ml-1">（星座の算出に使用）</span>
              </label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                style={{ ...inputStyle, colorScheme: "dark" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.4)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.15)";
                }}
              />
            </div>
          </div>

          {error && (
            <p
              className="text-xs mb-4 px-3 py-2 rounded-lg"
              style={{
                color: "#ff8080",
                background: "rgba(220,60,60,0.1)",
                border: "1px solid rgba(220,60,60,0.3)",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-outline-primary w-full py-3.5 rounded-full text-sm tracking-widest"
          >
            <span>ログイン</span>
          </button>
        </form>

        <button
          onClick={onClose}
          className="w-full mt-3 text-xs tracking-wider"
          style={{ color: "rgba(255,255,255,0.3)", opacity: 0.6 }}
        >
          キャンセル
        </button>

        <p
          className="text-xs text-center mt-5 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          データはブラウザのみに保存されます
        </p>
      </div>
    </div>
  );
}
