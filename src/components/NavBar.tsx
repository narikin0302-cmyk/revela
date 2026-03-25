"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoginModal from "@/components/LoginModal";

interface RevelaUser {
  name: string;
  zodiac: string;
  loginAt: string;
}

const ZODIAC_EMOJIS: Record<string, string> = {
  "牡羊座": "♈", "牡牛座": "♉", "双子座": "♊", "蟹座": "♋",
  "獅子座": "♌", "乙女座": "♍", "天秤座": "♎", "蠍座": "♏",
  "射手座": "♐", "山羊座": "♑", "水瓶座": "♒", "魚座": "♓",
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getTodayStarRating(zodiac: string): number {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let hash = 0;
  const combined = dateStr + zodiac;
  for (let i = 0; i < combined.length; i++) {
    hash = combined.charCodeAt(i) + ((hash << 5) - hash);
  }
  const score = seededRandom(Math.abs(hash));
  return Math.ceil(score * 5); // 1-5 stars
}

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
  highlight?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "ツール",
    children: [
      { label: "星座", href: "/uranai/seiza" },
      { label: "タロット", href: "/uranai/tarot" },
    ],
  },
  {
    label: "診断",
    children: [
      { label: "総合診断", href: "/shindan" },
      { label: "相性診断", href: "/shindan/aisei" },
      { label: "── 一覧 ──", href: "" },
      { label: "MBTI 16タイプ一覧", href: "/chara?tab=mbti" },
      { label: "キャラクターコード一覧", href: "/chara?tab=chara" },
      { label: "星座一覧", href: "/chara?tab=seiza" },
      { label: "タロット一覧", href: "/chara?tab=tarot" },
      { label: "職業RPGクラス一覧", href: "/chara?tab=rpg" },
    ],
  },
  {
    label: "マイページ",
    href: "/me",
  },
  {
    label: "履歴",
    href: "/history",
  },
];

function DropdownMenu({
  items,
  onClose,
}: {
  items: { label: string; href: string }[];
  onClose: () => void;
}) {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 py-2 rounded-2xl min-w-[180px] z-50"
      style={{
        background: "rgba(12,12,12,0.97)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
      }}
    >
      {items.map((item) =>
        item.href === "" ? (
          <div
            key={item.label}
            className="px-5 py-1.5 text-xs"
            style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}
          >
            {item.label}
          </div>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="block px-5 py-2.5 text-sm hover:bg-white/5 transition-colors"
            style={{ color: "rgba(255,255,255,0.65)", letterSpacing: "0.05em" }}
          >
            {item.label}
          </Link>
        )
      )}
    </div>
  );
}

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<RevelaUser | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [welcomeToast, setWelcomeToast] = useState("");
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("revela_user");
      if (stored) setUser(JSON.parse(stored) as RevelaUser);
    } catch {
      // ignore
    }
  }, []);

  const handleLogin = useCallback((newUser: RevelaUser) => {
    setUser(newUser);
    setShowLoginModal(false);
    setWelcomeToast(`おかえりなさい、${newUser.name}さん ✦`);
    setTimeout(() => setWelcomeToast(""), 3000);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("revela_user");
    setUser(null);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const isActive = (item: NavItem): boolean => {
    if (item.href) return pathname === item.href || pathname.startsWith(item.href + "/");
    if (item.children) return item.children.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));
    return false;
  };

  return (
    <>
      <header
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:px-6"
        style={{
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="logo-container">
            <div>
              <span className="logo-text">revela</span>
              <span className="logo-sub">self analysis</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all duration-200"
                    style={{
                      color: isActive(item) ? "#EDEDED" : "rgba(255,255,255,0.5)",
                      background: isActive(item) ? "rgba(255,255,255,0.07)" : "transparent",
                      letterSpacing: "0.08em",
                    }}
                    onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                  >
                    {item.label}
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      style={{
                        transition: "transform 0.2s",
                        transform: openDropdown === item.label ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={item.href!}
                    className="flex items-center px-4 py-2 rounded-full text-sm transition-all duration-200"
                    style={{
                      color: item.highlight ? "#EDEDED" : isActive(item) ? "#EDEDED" : "rgba(255,255,255,0.5)",
                      background: item.highlight
                        ? "rgba(255,255,255,0.08)"
                        : isActive(item)
                        ? "rgba(255,255,255,0.07)"
                        : "transparent",
                      border: item.highlight ? "1px solid rgba(255,255,255,0.2)" : "none",
                      letterSpacing: "0.08em",
                      fontWeight: item.highlight ? 500 : undefined,
                    }}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown */}
                {item.children && openDropdown === item.label && (
                  <div onMouseLeave={() => setOpenDropdown(null)}>
                    <DropdownMenu items={item.children} onClose={() => setOpenDropdown(null)} />
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Login / User area — desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex flex-col items-end gap-0.5">
                <Link
                  href="/me"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.05em",
                  }}
                >
                  <span>{ZODIAC_EMOJIS[user.zodiac] ?? "✦"}</span>
                  <span>{user.name}さん</span>
                </Link>
                <div className="flex items-center gap-2 px-1">
                  <button
                    onClick={handleLogout}
                    className="text-xs opacity-30 hover:opacity-60 transition-opacity"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    ログアウト
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="btn-outline-gold px-4 py-1.5 rounded-full text-xs tracking-widest"
              >
                ログイン
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="メニュー"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block w-5 h-px transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  transform:
                    mobileOpen
                      ? i === 0
                        ? "rotate(45deg) translate(4px, 4px)"
                        : i === 1
                        ? "scaleX(0)"
                        : "rotate(-45deg) translate(4px, -4px)"
                      : "none",
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-16"
          style={{ background: "rgba(10,10,10,0.98)", backdropFilter: "blur(20px)" }}
        >
          <nav className="flex-1 px-6 pt-8 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="mb-6">
                {item.children ? (
                  <>
                    <p
                      className="text-xs tracking-[0.3em] mb-3"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {item.label.toUpperCase()}
                    </p>
                    <div className="space-y-2 pl-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block py-2.5 text-lg font-light transition-colors"
                          style={{
                            color: pathname === child.href ? "#EDEDED" : "rgba(255,255,255,0.55)",
                            fontFamily: "var(--font-noto-serif-jp), serif",
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className="block py-3 text-xl font-light transition-colors"
                    style={{
                      color: item.highlight ? "#EDEDED" : pathname === item.href ? "#EDEDED" : "rgba(255,255,255,0.55)",
                      fontFamily: "var(--font-noto-serif-jp), serif",
                      fontWeight: item.highlight ? 500 : undefined,
                      borderBottom: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {item.label}
                    {item.highlight && " ✦"}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Login / User — mobile */}
          <div className="px-6 pb-2 border-t border-white/5 pt-4">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/me"
                  className="flex items-center gap-2 py-2 text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  <span>{ZODIAC_EMOJIS[user.zodiac] ?? "✦"}</span>
                  <span>{user.name}さんのマイページ</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs opacity-40 hover:opacity-70 transition-opacity"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileOpen(false); setShowLoginModal(true); }}
                className="btn-outline-gold w-full py-3 rounded-full text-sm tracking-widest"
              >
                ログイン
              </button>
            )}
          </div>

          {/* Footer in mobile menu */}
          <div className="px-6 py-4">
            <p className="text-xs opacity-25 tracking-widest text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
              © 2026 revela
            </p>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}

      {/* Welcome toast */}
      {welcomeToast && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 400,
            background: "rgba(255,255,255,0.1)",
            color: "#EDEDED",
            padding: "10px 24px",
            borderRadius: 9999,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.08em",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            animation: "fadeIn 0.3s ease",
            whiteSpace: "nowrap",
          }}
        >
          {welcomeToast}
        </div>
      )}
    </>
  );
}
