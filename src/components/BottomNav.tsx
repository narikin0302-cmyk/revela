"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavItem {
  label: string;
  href: string;
  icon: string;
}

const NAV_ITEMS: BottomNavItem[] = [
  { label: "総合診断", href: "/shindan", icon: "📊" },
  { label: "相性診断", href: "/shindan/aisei", icon: "💞" },
  { label: "ホーム", href: "/", icon: "🏠" },
  { label: "マイページ", href: "/me", icon: "◈" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
      style={{
        height: "60px",
        background: "rgba(10,10,10,0.96)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center justify-around h-full px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-200"
              style={{
                color: active ? "#EDEDED" : "rgba(255,255,255,0.3)",
                textDecoration: "none",
              }}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span
                className="text-center"
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.04em",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {item.label}
              </span>
              {active && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "24px",
                    height: "2px",
                    background: "rgba(255,255,255,0.4)",
                    borderRadius: "9999px",
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
