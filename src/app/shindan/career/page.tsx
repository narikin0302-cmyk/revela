"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { parseRevelaCode } from "@/lib/revelaCodes";

// ============================================================
// RPG Job Class データ
// ============================================================

interface RpgClass {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  color: string;
  bgColor: string;
  mbtiTypes: string[];
  tagline: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  bestRole: string;
  skills: string[];
  career: string[];
  element: string;
  rank: string;
  illustration: string;
}

const RPG_ILLUSTRATIONS: Record<string, string> = {
  sage: `
    <defs>
      <radialGradient id="sage-bg" cx="50%" cy="60%" r="70%">
        <stop offset="0%" stop-color="#2d1b69"/>
        <stop offset="100%" stop-color="#0d0b2b"/>
      </radialGradient>
      <radialGradient id="sage-orb" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#e8d5ff"/>
        <stop offset="40%" stop-color="#a855f7"/>
        <stop offset="100%" stop-color="#4c1d95"/>
      </radialGradient>
      <radialGradient id="sage-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#a855f7" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="200" height="260" fill="url(#sage-bg)"/>
    <ellipse cx="100" cy="200" rx="70" ry="30" fill="url(#sage-glow)"/>
    <!-- Stars -->
    <circle cx="20" cy="20" r="1.5" fill="#e8d5ff" opacity="0.9"/>
    <circle cx="50" cy="10" r="1" fill="#e8d5ff" opacity="0.7"/>
    <circle cx="170" cy="15" r="1.5" fill="#e8d5ff" opacity="0.8"/>
    <circle cx="185" cy="40" r="1" fill="#e8d5ff" opacity="0.6"/>
    <circle cx="30" cy="60" r="1" fill="#e8d5ff" opacity="0.5"/>
    <circle cx="160" cy="55" r="1.5" fill="#e8d5ff" opacity="0.7"/>
    <circle cx="10" cy="130" r="1" fill="#e8d5ff" opacity="0.4"/>
    <circle cx="190" cy="110" r="1" fill="#e8d5ff" opacity="0.5"/>
    <!-- Rune circle -->
    <circle cx="100" cy="120" r="75" fill="none" stroke="#a855f7" stroke-width="0.5" opacity="0.4" stroke-dasharray="4 6"/>
    <circle cx="100" cy="120" r="60" fill="none" stroke="#d4af37" stroke-width="0.3" opacity="0.3"/>
    <!-- Rune symbols -->
    <text x="100" y="52" text-anchor="middle" font-size="8" fill="#a855f7" opacity="0.8">✦</text>
    <text x="168" y="125" text-anchor="middle" font-size="8" fill="#a855f7" opacity="0.8">✦</text>
    <text x="32" y="125" text-anchor="middle" font-size="8" fill="#a855f7" opacity="0.8">✦</text>
    <text x="100" y="195" text-anchor="middle" font-size="8" fill="#a855f7" opacity="0.8">✦</text>
    <!-- Cloak -->
    <ellipse cx="100" cy="190" rx="55" ry="25" fill="#1e0a4e" opacity="0.9"/>
    <path d="M55 175 Q100 210 145 175 L140 260 L60 260 Z" fill="#2d1560"/>
    <path d="M60 175 Q100 200 140 175 L135 260 L65 260 Z" fill="#3d1d80"/>
    <!-- Stars on cloak -->
    <circle cx="80" cy="205" r="1.5" fill="#d4af37" opacity="0.9"/>
    <circle cx="100" cy="215" r="1" fill="#d4af37" opacity="0.7"/>
    <circle cx="120" cy="208" r="1.5" fill="#d4af37" opacity="0.8"/>
    <circle cx="90" cy="220" r="1" fill="#d4af37" opacity="0.6"/>
    <circle cx="110" cy="225" r="1" fill="#d4af37" opacity="0.7"/>
    <!-- Robe body -->
    <path d="M75 140 Q65 180 60 260 L140 260 Q135 180 125 140 Z" fill="#4c1d95"/>
    <path d="M80 140 Q72 175 70 260 L130 260 Q128 175 120 140 Z" fill="#5b21b6"/>
    <!-- Belt line -->
    <line x1="72" y1="168" x2="128" y2="168" stroke="#d4af37" stroke-width="1" opacity="0.6"/>
    <!-- Arms -->
    <path d="M75 145 Q50 160 45 185" stroke="#4c1d95" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M125 145 Q150 160 155 185" stroke="#4c1d95" stroke-width="12" stroke-linecap="round" fill="none"/>
    <!-- Orb glow -->
    <circle cx="50" cy="192" r="18" fill="#a855f7" opacity="0.2"/>
    <circle cx="50" cy="192" r="14" fill="url(#sage-orb)"/>
    <circle cx="45" cy="187" r="4" fill="white" opacity="0.5"/>
    <circle cx="50" cy="192" r="14" fill="none" stroke="#e8d5ff" stroke-width="0.5" opacity="0.6"/>
    <!-- Head/face -->
    <ellipse cx="100" cy="108" rx="22" ry="25" fill="#f5e6d3"/>
    <!-- White beard -->
    <path d="M82 120 Q85 145 88 155 Q95 162 100 163 Q105 162 112 155 Q115 145 118 120" fill="#e8e0d8"/>
    <path d="M85 122 Q90 148 100 158 Q110 148 115 122" fill="#f0ebe5"/>
    <!-- Eyes -->
    <ellipse cx="92" cy="108" rx="3.5" ry="4" fill="#1a0a2e"/>
    <ellipse cx="108" cy="108" rx="3.5" ry="4" fill="#1a0a2e"/>
    <circle cx="91" cy="107" r="1" fill="white" opacity="0.8"/>
    <circle cx="107" cy="107" r="1" fill="white" opacity="0.8"/>
    <circle cx="92" cy="108" r="1.5" fill="#7c3aed" opacity="0.9"/>
    <circle cx="108" cy="108" r="1.5" fill="#7c3aed" opacity="0.9"/>
    <!-- Eyebrows -->
    <path d="M88 103 Q92 101 96 103" stroke="#8b7355" stroke-width="1.5" fill="none"/>
    <path d="M104 103 Q108 101 112 103" stroke="#8b7355" stroke-width="1.5" fill="none"/>
    <!-- Nose -->
    <path d="M99 112 Q97 116 100 118 Q103 116 101 112" stroke="#c4a882" stroke-width="0.8" fill="none"/>
    <!-- Hat -->
    <path d="M78 98 Q100 30 122 98 Z" fill="#3d1d80"/>
    <path d="M78 98 Q100 32 122 98" fill="#4c1d95"/>
    <ellipse cx="100" cy="99" rx="28" ry="6" fill="#5b21b6"/>
    <circle cx="100" cy="35" r="4" fill="#d4af37"/>
    <!-- Hat stars -->
    <circle cx="95" cy="55" r="1.5" fill="#d4af37" opacity="0.9"/>
    <circle cx="105" cy="70" r="1" fill="#d4af37" opacity="0.7"/>
    <circle cx="93" cy="75" r="1" fill="#d4af37" opacity="0.8"/>
    <!-- Magical energy lines -->
    <line x1="50" y1="192" x2="30" y2="175" stroke="#a855f7" stroke-width="0.5" opacity="0.6"/>
    <line x1="50" y1="192" x2="35" y2="210" stroke="#a855f7" stroke-width="0.5" opacity="0.6"/>
    <line x1="50" y1="192" x2="55" y2="172" stroke="#d4af37" stroke-width="0.5" opacity="0.6"/>
  `,
  archmage: `
    <defs>
      <radialGradient id="arch-bg" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="100%" stop-color="#0d0b2b"/>
      </radialGradient>
      <radialGradient id="arch-lightning" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fff"/>
        <stop offset="50%" stop-color="#818cf8"/>
        <stop offset="100%" stop-color="#4338ca"/>
      </radialGradient>
    </defs>
    <rect width="200" height="260" fill="url(#arch-bg)"/>
    <!-- Floating books -->
    <rect x="15" y="50" width="28" height="38" rx="2" fill="#2d3561" transform="rotate(-15 29 69)"/>
    <rect x="16" y="50" width="26" height="38" rx="1" fill="#3d4580" transform="rotate(-15 29 69)"/>
    <line x1="18" y1="58" x2="38" y2="56" stroke="#d4af37" stroke-width="0.5" opacity="0.6" transform="rotate(-15 29 69)"/>
    <line x1="18" y1="63" x2="38" y2="61" stroke="#d4af37" stroke-width="0.5" opacity="0.4" transform="rotate(-15 29 69)"/>
    <line x1="18" y1="68" x2="38" y2="66" stroke="#d4af37" stroke-width="0.5" opacity="0.4" transform="rotate(-15 29 69)"/>
    <rect x="155" y="45" width="30" height="40" rx="2" fill="#2d4561" transform="rotate(12 170 65)"/>
    <rect x="156" y="46" width="28" height="38" rx="1" fill="#3d5580" transform="rotate(12 170 65)"/>
    <line x1="160" y1="56" x2="180" y2="58" stroke="#d4af37" stroke-width="0.5" opacity="0.6" transform="rotate(12 170 65)"/>
    <line x1="160" y1="62" x2="180" y2="64" stroke="#d4af37" stroke-width="0.5" opacity="0.4" transform="rotate(12 170 65)"/>
    <!-- Potion bottles -->
    <rect x="22" y="155" width="12" height="20" rx="4" fill="#1e40af" opacity="0.8"/>
    <rect x="24" y="150" width="8" height="8" rx="2" fill="#2d4ed8" opacity="0.8"/>
    <ellipse cx="28" cy="163" rx="4" ry="5" fill="#3b82f6" opacity="0.6"/>
    <rect x="165" y="150" width="14" height="22" rx="4" fill="#7c1d1d" opacity="0.8"/>
    <rect x="168" y="145" width="8" height="8" rx="2" fill="#991b1b" opacity="0.8"/>
    <ellipse cx="172" cy="162" rx="4" ry="6" fill="#ef4444" opacity="0.4"/>
    <!-- Alchemical equations floating -->
    <text x="20" y="120" font-size="7" fill="#818cf8" opacity="0.7">∑Ψ²</text>
    <text x="155" y="115" font-size="7" fill="#818cf8" opacity="0.7">ΔΩ=∞</text>
    <text x="10" y="90" font-size="6" fill="#a78bfa" opacity="0.5">∫φdx</text>
    <text x="162" y="145" font-size="6" fill="#a78bfa" opacity="0.5">μ/λ</text>
    <!-- Robe/body -->
    <path d="M72 140 Q62 185 58 260 L142 260 Q138 185 128 140 Z" fill="#3730a3"/>
    <path d="M78 140 Q70 180 68 260 L132 260 Q130 180 122 140 Z" fill="#4338ca"/>
    <!-- Alchemical symbol on robe -->
    <circle cx="100" cy="185" r="12" fill="none" stroke="#818cf8" stroke-width="0.8" opacity="0.7"/>
    <line x1="100" y1="173" x2="100" y2="197" stroke="#818cf8" stroke-width="0.8" opacity="0.7"/>
    <line x1="88" y1="185" x2="112" y2="185" stroke="#818cf8" stroke-width="0.8" opacity="0.7"/>
    <!-- Arms -->
    <path d="M74 145 Q52 162 42 185" stroke="#4338ca" stroke-width="11" stroke-linecap="round" fill="none"/>
    <path d="M126 145 Q148 162 158 175" stroke="#4338ca" stroke-width="11" stroke-linecap="round" fill="none"/>
    <!-- Lightning hand effect -->
    <path d="M158 175 L165 168 L160 175 L168 170 L162 178 L170 172" stroke="url(#arch-lightning)" stroke-width="1.5" fill="none" opacity="0.9"/>
    <circle cx="162" cy="175" r="8" fill="#818cf8" opacity="0.2"/>
    <circle cx="162" cy="175" r="4" fill="#c7d2fe" opacity="0.4"/>
    <!-- Lightning sparks -->
    <line x1="162" y1="175" x2="175" y2="160" stroke="#e0e7ff" stroke-width="0.8" opacity="0.8"/>
    <line x1="162" y1="175" x2="178" y2="172" stroke="#e0e7ff" stroke-width="0.8" opacity="0.6"/>
    <line x1="162" y1="175" x2="170" y2="188" stroke="#818cf8" stroke-width="0.8" opacity="0.6"/>
    <!-- Head/face - young scholar -->
    <ellipse cx="100" cy="108" rx="21" ry="23" fill="#f5e6d3"/>
    <!-- Hair - dark scholarly -->
    <path d="M80 100 Q82 82 100 80 Q118 82 120 100" fill="#1a1a2e"/>
    <path d="M80 100 Q78 92 82 86" fill="#1a1a2e"/>
    <path d="M120 100 Q122 92 118 86" fill="#1a1a2e"/>
    <!-- Eyes - analytical -->
    <ellipse cx="92" cy="108" rx="3" ry="3.5" fill="#1e1b4b"/>
    <ellipse cx="108" cy="108" rx="3" ry="3.5" fill="#1e1b4b"/>
    <circle cx="91" cy="107" r="1" fill="white" opacity="0.9"/>
    <circle cx="107" cy="107" r="1" fill="white" opacity="0.9"/>
    <circle cx="93" cy="108" r="1.5" fill="#818cf8"/>
    <circle cx="109" cy="108" r="1.5" fill="#818cf8"/>
    <!-- Glasses -->
    <circle cx="92" cy="108" r="7" fill="none" stroke="#d4af37" stroke-width="1"/>
    <circle cx="108" cy="108" r="7" fill="none" stroke="#d4af37" stroke-width="1"/>
    <line x1="99" y1="108" x2="101" y2="108" stroke="#d4af37" stroke-width="1"/>
    <line x1="85" y1="108" x2="82" y2="106" stroke="#d4af37" stroke-width="1"/>
    <line x1="115" y1="108" x2="118" y2="106" stroke="#d4af37" stroke-width="1"/>
    <!-- Mouth slight smirk -->
    <path d="M96 118 Q100 121 104 119" stroke="#c4a882" stroke-width="1" fill="none"/>
    <!-- Collar/scarf -->
    <path d="M80 130 Q100 138 120 130" stroke="#6366f1" stroke-width="3" fill="none"/>
  `,
  prophet: `
    <defs>
      <radialGradient id="proph-bg" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#064e3b"/>
        <stop offset="100%" stop-color="#0d0b2b"/>
      </radialGradient>
      <radialGradient id="proph-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#34d399" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#059669" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="200" height="260" fill="url(#proph-bg)"/>
    <!-- Constellation background -->
    <circle cx="30" cy="30" r="1.5" fill="#6ee7b7" opacity="0.8"/>
    <circle cx="55" cy="20" r="1" fill="#6ee7b7" opacity="0.6"/>
    <circle cx="80" cy="35" r="1.5" fill="#6ee7b7" opacity="0.7"/>
    <circle cx="120" cy="18" r="1" fill="#6ee7b7" opacity="0.8"/>
    <circle cx="150" cy="28" r="1.5" fill="#6ee7b7" opacity="0.6"/>
    <circle cx="175" cy="15" r="1" fill="#6ee7b7" opacity="0.7"/>
    <circle cx="185" cy="45" r="1.5" fill="#6ee7b7" opacity="0.5"/>
    <circle cx="10" cy="80" r="1" fill="#6ee7b7" opacity="0.4"/>
    <circle cx="190" cy="90" r="1" fill="#6ee7b7" opacity="0.5"/>
    <!-- Constellation lines -->
    <line x1="30" y1="30" x2="55" y2="20" stroke="#6ee7b7" stroke-width="0.3" opacity="0.4"/>
    <line x1="55" y1="20" x2="80" y2="35" stroke="#6ee7b7" stroke-width="0.3" opacity="0.4"/>
    <line x1="120" y1="18" x2="150" y2="28" stroke="#6ee7b7" stroke-width="0.3" opacity="0.4"/>
    <line x1="150" y1="28" x2="175" y2="15" stroke="#6ee7b7" stroke-width="0.3" opacity="0.4"/>
    <!-- Cosmic light beams -->
    <line x1="100" y1="0" x2="100" y2="80" stroke="#6ee7b7" stroke-width="0.5" opacity="0.3"/>
    <line x1="60" y1="0" x2="80" y2="100" stroke="#6ee7b7" stroke-width="0.3" opacity="0.2"/>
    <line x1="140" y1="0" x2="120" y2="100" stroke="#6ee7b7" stroke-width="0.3" opacity="0.2"/>
    <!-- Swirling pattern -->
    <circle cx="100" cy="130" r="70" fill="none" stroke="#059669" stroke-width="0.5" opacity="0.3" stroke-dasharray="3 8"/>
    <circle cx="100" cy="130" r="55" fill="none" stroke="#34d399" stroke-width="0.4" opacity="0.25" stroke-dasharray="2 10"/>
    <!-- Levitation glow beneath -->
    <ellipse cx="100" cy="195" rx="45" ry="12" fill="url(#proph-glow)"/>
    <!-- Robe - flowing green -->
    <path d="M70 150 Q55 195 45 260 L155 260 Q145 195 130 150 Z" fill="#065f46"/>
    <path d="M76 150 Q65 190 58 260 L142 260 Q135 190 124 150 Z" fill="#047857"/>
    <!-- Robe hem pattern -->
    <path d="M45 250 Q100 245 155 250" stroke="#34d399" stroke-width="0.5" opacity="0.5"/>
    <!-- Levitating body position - slightly raised -->
    <path d="M75 145 Q62 165 55 180" stroke="#065f46" stroke-width="10" stroke-linecap="round" fill="none"/>
    <path d="M125 145 Q138 165 145 180" stroke="#065f46" stroke-width="10" stroke-linecap="round" fill="none"/>
    <!-- Arms outstretched, receiving -->
    <path d="M55 180 Q45 188 40 195" stroke="#065f46" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M145 180 Q155 188 160 195" stroke="#065f46" stroke-width="8" stroke-linecap="round" fill="none"/>
    <!-- Glowing hands -->
    <circle cx="40" cy="197" r="7" fill="#34d399" opacity="0.3"/>
    <circle cx="40" cy="197" r="4" fill="#6ee7b7" opacity="0.5"/>
    <circle cx="160" cy="197" r="7" fill="#34d399" opacity="0.3"/>
    <circle cx="160" cy="197" r="4" fill="#6ee7b7" opacity="0.5"/>
    <!-- Head/face - serene, closed eyes -->
    <ellipse cx="100" cy="112" rx="21" ry="24" fill="#f0e8d8"/>
    <!-- Hair - long flowing dark -->
    <path d="M80 106 Q78 88 100 85 Q122 88 120 106" fill="#1c1a35"/>
    <path d="M80 106 Q72 120 75 145" fill="#1c1a35"/>
    <path d="M120 106 Q128 120 125 145" fill="#1c1a35"/>
    <!-- Closed eyes - serene -->
    <path d="M87 110 Q92 108 97 110" stroke="#6b4c2a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M103 110 Q108 108 113 110" stroke="#6b4c2a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <!-- Nose -->
    <path d="M99 115 Q97 119 100 120 Q103 119 101 115" stroke="#c4a882" stroke-width="0.8" fill="none"/>
    <!-- Serene smile -->
    <path d="M94 125 Q100 129 106 125" stroke="#c4a882" stroke-width="1" fill="none"/>
    <!-- Glowing mark on forehead -->
    <ellipse cx="100" cy="98" rx="5" ry="4" fill="#34d399" opacity="0.4"/>
    <circle cx="100" cy="98" r="2" fill="#6ee7b7" opacity="0.7"/>
    <!-- Head wrap/veil -->
    <path d="M80 102 Q100 96 120 102 Q118 92 100 90 Q82 92 80 102" fill="#047857" opacity="0.7"/>
    <!-- Swirling aura -->
    <ellipse cx="100" cy="125" rx="50" ry="55" fill="none" stroke="#34d399" stroke-width="0.5" opacity="0.25" stroke-dasharray="5 5"/>
  `,
  bard: `
    <defs>
      <radialGradient id="bard-bg" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#064e3b"/>
        <stop offset="100%" stop-color="#0a1628"/>
      </radialGradient>
      <linearGradient id="bard-lute" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#92400e"/>
        <stop offset="100%" stop-color="#451a03"/>
      </linearGradient>
    </defs>
    <rect width="200" height="260" fill="url(#bard-bg)"/>
    <!-- Musical notes floating -->
    <text x="25" y="45" font-size="14" fill="#10b981" opacity="0.8">♪</text>
    <text x="160" y="35" font-size="18" fill="#34d399" opacity="0.7">♫</text>
    <text x="15" y="110" font-size="12" fill="#6ee7b7" opacity="0.6">♩</text>
    <text x="172" y="95" font-size="16" fill="#10b981" opacity="0.8">♬</text>
    <text x="140" y="55" font-size="10" fill="#6ee7b7" opacity="0.5">♪</text>
    <text x="45" y="70" font-size="12" fill="#34d399" opacity="0.6">♫</text>
    <text x="5" y="160" font-size="14" fill="#10b981" opacity="0.4">♩</text>
    <text x="180" y="155" font-size="10" fill="#34d399" opacity="0.5">♪</text>
    <!-- Body/costume emerald -->
    <path d="M72 142 Q60 190 55 260 L145 260 Q140 190 128 142 Z" fill="#065f46"/>
    <path d="M78 142 Q68 185 65 260 L135 260 Q132 185 122 142 Z" fill="#047857"/>
    <!-- Costume details - diamond pattern -->
    <path d="M85 160 L100 155 L115 160 L100 165 Z" fill="#10b981" opacity="0.4"/>
    <path d="M82 180 L100 175 L118 180 L100 185 Z" fill="#10b981" opacity="0.3"/>
    <!-- Arms -->
    <path d="M74 148 Q58 162 48 178" stroke="#065f46" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M126 148 Q142 160 150 172" stroke="#065f46" stroke-width="12" stroke-linecap="round" fill="none"/>
    <!-- Lute body -->
    <ellipse cx="148" cy="185" rx="20" ry="24" fill="url(#bard-lute)"/>
    <ellipse cx="148" cy="185" rx="16" ry="20" fill="none" stroke="#b45309" stroke-width="0.8" opacity="0.6"/>
    <circle cx="148" cy="185" r="6" fill="none" stroke="#d97706" stroke-width="1" opacity="0.8"/>
    <!-- Lute neck -->
    <rect x="160" y="155" width="6" height="35" rx="3" fill="#78350f" transform="rotate(-25 163 172)"/>
    <!-- Lute strings -->
    <line x1="158" y1="163" x2="145" y2="205" stroke="#d4af37" stroke-width="0.5" opacity="0.7"/>
    <line x1="161" y1="163" x2="148" y2="205" stroke="#d4af37" stroke-width="0.5" opacity="0.7"/>
    <line x1="164" y1="163" x2="151" y2="205" stroke="#d4af37" stroke-width="0.5" opacity="0.7"/>
    <!-- Glowing lute effect -->
    <ellipse cx="148" cy="185" rx="22" ry="26" fill="none" stroke="#34d399" stroke-width="0.5" opacity="0.4"/>
    <!-- Head with flowing hair -->
    <ellipse cx="100" cy="110" rx="22" ry="24" fill="#f5e0c0"/>
    <!-- Flowing hair -->
    <path d="M80 104 Q75 88 100 85 Q125 88 120 104" fill="#7c2d12"/>
    <path d="M80 104 Q68 118 70 145" fill="#7c2d12"/>
    <path d="M80 115 Q65 130 62 155" fill="#92400e"/>
    <path d="M120 104 Q132 118 130 145" fill="#7c2d12"/>
    <path d="M120 115 Q135 130 138 155" fill="#92400e"/>
    <!-- Hat - whimsical -->
    <path d="M82 98 Q100 55 118 98 Z" fill="#065f46"/>
    <path d="M82 98 Q100 57 118 98" fill="#047857"/>
    <ellipse cx="100" cy="99" rx="24" ry="5" fill="#059669"/>
    <circle cx="100" cy="60" r="5" fill="#d4af37"/>
    <path d="M96 60 Q100 50 104 60" stroke="#f0d060" stroke-width="1" fill="none"/>
    <!-- Feather in hat -->
    <path d="M104 62 Q115 45 120 35 Q118 50 112 58" fill="#10b981" opacity="0.8"/>
    <!-- Eyes bright -->
    <ellipse cx="92" cy="112" rx="3.5" ry="4" fill="#1a0a2e"/>
    <ellipse cx="108" cy="112" rx="3.5" ry="4" fill="#1a0a2e"/>
    <circle cx="91" cy="111" r="1.2" fill="white" opacity="0.9"/>
    <circle cx="107" cy="111" r="1.2" fill="white" opacity="0.9"/>
    <circle cx="93" cy="112" r="1.8" fill="#059669"/>
    <circle cx="109" cy="112" r="1.8" fill="#059669"/>
    <!-- Smile -->
    <path d="M93 122 Q100 128 107 122" stroke="#c4a882" stroke-width="1.2" fill="none"/>
    <!-- Playful blush -->
    <ellipse cx="88" cy="119" rx="5" ry="3" fill="#f87171" opacity="0.3"/>
    <ellipse cx="112" cy="119" rx="5" ry="3" fill="#f87171" opacity="0.3"/>
    <!-- Note trail from lute -->
    <path d="M148 165 Q135 145 120 135" stroke="#34d399" stroke-width="0.5" fill="none" opacity="0.4" stroke-dasharray="3 4"/>
  `,
  paladin: `
    <defs>
      <radialGradient id="pal-bg" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stop-color="#1c1917"/>
        <stop offset="100%" stop-color="#0d0b2b"/>
      </radialGradient>
      <radialGradient id="pal-halo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fef3c7" stop-opacity="0.8"/>
        <stop offset="60%" stop-color="#d4af37" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#d4af37" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="pal-sword" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fff"/>
        <stop offset="50%" stop-color="#fef3c7"/>
        <stop offset="100%" stop-color="#d4af37"/>
      </linearGradient>
    </defs>
    <rect width="200" height="260" fill="url(#pal-bg)"/>
    <!-- Halo glow -->
    <circle cx="100" cy="88" r="45" fill="url(#pal-halo)"/>
    <circle cx="100" cy="88" r="35" fill="none" stroke="#d4af37" stroke-width="1" opacity="0.7"/>
    <circle cx="100" cy="88" r="38" fill="none" stroke="#f0d060" stroke-width="0.5" opacity="0.5" stroke-dasharray="4 4"/>
    <!-- Angel wings - partial -->
    <path d="M65 120 Q30 100 18 70 Q35 85 55 100 Q40 75 42 50 Q60 80 68 110" fill="#f0e6d3" opacity="0.5"/>
    <path d="M135 120 Q170 100 182 70 Q165 85 145 100 Q160 75 158 50 Q140 80 132 110" fill="#f0e6d3" opacity="0.5"/>
    <!-- Wing feather lines -->
    <path d="M68 110 Q50 95 42 75" stroke="#d4af37" stroke-width="0.5" opacity="0.4"/>
    <path d="M66 118 Q45 105 38 85" stroke="#d4af37" stroke-width="0.5" opacity="0.3"/>
    <path d="M132 118 Q152 105 160 82" stroke="#d4af37" stroke-width="0.5" opacity="0.3"/>
    <!-- Gold armor plate body -->
    <path d="M72 148 Q62 195 58 260 L142 260 Q138 195 128 148 Z" fill="#78350f"/>
    <path d="M76 148 Q68 190 66 260 L134 260 Q132 190 124 148 Z" fill="#b45309"/>
    <!-- Chest plate -->
    <path d="M76 150 Q100 158 124 150 L120 185 Q100 192 80 185 Z" fill="#d4af37"/>
    <path d="M80 152 Q100 159 120 152 L117 180 Q100 186 83 180 Z" fill="#f0d060"/>
    <!-- Cross on chest -->
    <line x1="100" y1="158" x2="100" y2="180" stroke="#92400e" stroke-width="2"/>
    <line x1="90" y1="168" x2="110" y2="168" stroke="#92400e" stroke-width="2"/>
    <!-- Shoulder pauldrons -->
    <ellipse cx="72" cy="148" rx="14" ry="9" fill="#d4af37" transform="rotate(-10 72 148)"/>
    <ellipse cx="72" cy="148" rx="11" ry="7" fill="#f0d060" transform="rotate(-10 72 148)"/>
    <ellipse cx="128" cy="148" rx="14" ry="9" fill="#d4af37" transform="rotate(10 128 148)"/>
    <ellipse cx="128" cy="148" rx="11" ry="7" fill="#f0d060" transform="rotate(10 128 148)"/>
    <!-- Arms armored -->
    <path d="M72 150 Q55 168 48 192" stroke="#b45309" stroke-width="13" stroke-linecap="round" fill="none"/>
    <path d="M128 150 Q145 165 152 188" stroke="#b45309" stroke-width="13" stroke-linecap="round" fill="none"/>
    <!-- Glowing sword -->
    <rect x="150" y="120" width="5" height="70" rx="2.5" fill="url(#pal-sword)" transform="rotate(20 152 155)"/>
    <rect x="143" y="155" width="19" height="4" rx="2" fill="#d4af37" transform="rotate(20 152 157)"/>
    <circle cx="152" cy="155" r="3" fill="#fef3c7"/>
    <!-- Sword glow -->
    <rect x="150" y="120" width="5" height="70" rx="2.5" fill="#fef3c7" opacity="0.3" filter="blur(2px)" transform="rotate(20 152 155)"/>
    <!-- Head with helmet -->
    <ellipse cx="100" cy="108" rx="21" ry="23" fill="#f5e0c0"/>
    <!-- Helmet -->
    <path d="M80 105 Q80 80 100 78 Q120 80 120 105" fill="#d4af37"/>
    <path d="M82 105 Q82 83 100 81 Q118 83 118 105" fill="#f0d060"/>
    <!-- Helmet visor area open -->
    <path d="M84 105 Q100 100 116 105" stroke="#b45309" stroke-width="1.5" fill="none"/>
    <!-- Eyes - stern, bright -->
    <ellipse cx="93" cy="109" rx="3" ry="3.5" fill="#1a0a2e"/>
    <ellipse cx="107" cy="109" rx="3" ry="3.5" fill="#1a0a2e"/>
    <circle cx="92" cy="108" r="1" fill="white" opacity="0.9"/>
    <circle cx="106" cy="108" r="1" fill="white" opacity="0.9"/>
    <!-- Golden iris -->
    <circle cx="93" cy="109" r="1.5" fill="#d4af37"/>
    <circle cx="107" cy="109" r="1.5" fill="#d4af37"/>
    <!-- Determined expression -->
    <path d="M90 105 Q93 103 96 105" stroke="#92400e" stroke-width="1.2" fill="none"/>
    <path d="M104 105 Q107 103 110 105" stroke="#92400e" stroke-width="1.2" fill="none"/>
    <path d="M95 118 Q100 120 105 118" stroke="#c4a882" stroke-width="1" fill="none"/>
    <!-- Divine light rays from halo -->
    <line x1="100" y1="52" x2="100" y2="42" stroke="#f0d060" stroke-width="0.8" opacity="0.5"/>
    <line x1="118" y1="56" x2="124" y2="48" stroke="#f0d060" stroke-width="0.8" opacity="0.4"/>
    <line x1="82" y1="56" x2="76" y2="48" stroke="#f0d060" stroke-width="0.8" opacity="0.4"/>
    <line x1="130" y1="68" x2="138" y2="62" stroke="#f0d060" stroke-width="0.8" opacity="0.3"/>
    <line x1="70" y1="68" x2="62" y2="62" stroke="#f0d060" stroke-width="0.8" opacity="0.3"/>
  `,
  adventurer: `
    <defs>
      <radialGradient id="adv-bg" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#14532d"/>
        <stop offset="100%" stop-color="#0a1628"/>
      </radialGradient>
    </defs>
    <rect width="200" height="260" fill="url(#adv-bg)"/>
    <!-- Stars/sparkles ahead -->
    <text x="155" y="55" font-size="12" fill="#fef3c7" opacity="0.9">✦</text>
    <text x="170" y="75" font-size="8" fill="#fef3c7" opacity="0.7">✦</text>
    <text x="148" y="80" font-size="6" fill="#34d399" opacity="0.8">★</text>
    <text x="175" y="45" font-size="10" fill="#34d399" opacity="0.6">★</text>
    <text x="12" y="50" font-size="8" fill="#fef3c7" opacity="0.5">✦</text>
    <text x="20" y="75" font-size="6" fill="#34d399" opacity="0.4">★</text>
    <!-- Path/road suggestion -->
    <path d="M100 260 Q120 220 140 180 Q160 140 175 100" stroke="#34d399" stroke-width="0.5" opacity="0.2" stroke-dasharray="4 6" fill="none"/>
    <!-- Large backpack -->
    <rect x="112" y="145" width="34" height="45" rx="6" fill="#4d7c0f"/>
    <rect x="114" y="147" width="30" height="41" rx="5" fill="#65a30d"/>
    <line x1="125" y1="147" x2="125" y2="188" stroke="#3f6212" stroke-width="1.5" opacity="0.6"/>
    <rect x="122" y="162" width="16" height="12" rx="3" fill="#4d7c0f"/>
    <!-- Backpack straps -->
    <path d="M114 148 Q108 155 106 168" stroke="#4d7c0f" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M144 148 Q148 155 148 168" stroke="#4d7c0f" stroke-width="4" stroke-linecap="round" fill="none"/>
    <!-- Cloak body - green -->
    <path d="M70 148 Q58 200 52 260 L148 260 Q142 200 130 148 Z" fill="#15803d"/>
    <path d="M76 148 Q66 195 64 260 L136 260 Q134 195 124 148 Z" fill="#16a34a"/>
    <!-- Tunic beneath -->
    <path d="M80 152 Q100 160 120 152 L118 190 Q100 196 82 190 Z" fill="#b45309"/>
    <!-- Belt with pouches -->
    <rect x="80" y="190" width="40" height="6" rx="3" fill="#78350f"/>
    <rect x="82" y="191" width="10" height="10" rx="2" fill="#92400e"/>
    <rect x="108" y="191" width="10" height="10" rx="2" fill="#92400e"/>
    <!-- Arms - energetic pose -->
    <path d="M76 152 Q62 170 55 188" stroke="#15803d" stroke-width="11" stroke-linecap="round" fill="none"/>
    <path d="M124 152 Q138 168 145 185" stroke="#15803d" stroke-width="11" stroke-linecap="round" fill="none"/>
    <!-- Hand with a map/scroll -->
    <rect x="45" y="182" width="18" height="14" rx="2" fill="#fef3c7" transform="rotate(-10 54 189)"/>
    <line x1="48" y1="186" x2="58" y2="185" stroke="#92400e" stroke-width="0.5" opacity="0.7" transform="rotate(-10 54 189)"/>
    <line x1="48" y1="189" x2="58" y2="188" stroke="#92400e" stroke-width="0.5" opacity="0.7" transform="rotate(-10 54 189)"/>
    <!-- Head - cheerful young face -->
    <ellipse cx="100" cy="108" rx="22" ry="24" fill="#f5e0c0"/>
    <!-- Windswept hair -->
    <path d="M78 102 Q76 82 100 80 Q124 82 124 98" fill="#92400e"/>
    <path d="M78 102 Q70 88 75 78 Q82 72 90 78" fill="#b45309"/>
    <path d="M122 98 Q132 85 128 72 Q120 68 112 76" fill="#92400e"/>
    <!-- Windswept direction -->
    <path d="M80 90 Q70 80 65 68" stroke="#7c2d12" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M85 86 Q76 75 72 62" stroke="#7c2d12" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>
    <!-- Sparkling eyes -->
    <ellipse cx="92" cy="110" rx="4" ry="4.5" fill="#1a0a2e"/>
    <ellipse cx="108" cy="110" rx="4" ry="4.5" fill="#1a0a2e"/>
    <circle cx="90" cy="108" r="1.5" fill="white" opacity="0.9"/>
    <circle cx="106" cy="108" r="1.5" fill="white" opacity="0.9"/>
    <circle cx="94" cy="110" r="2" fill="#34d399"/>
    <circle cx="110" cy="110" r="2" fill="#34d399"/>
    <!-- Star sparkle in eyes -->
    <text x="90" y="112" font-size="4" fill="white" opacity="0.8">✦</text>
    <text x="106" y="112" font-size="4" fill="white" opacity="0.8">✦</text>
    <!-- Big grin -->
    <path d="M90 122 Q100 130 110 122" stroke="#c4a882" stroke-width="1.5" fill="#f5e0c0" opacity="0.5"/>
    <path d="M91 122 Q100 129 109 122" stroke="none" fill="#f0c8a0" opacity="0.3"/>
    <!-- Hood/bandana -->
    <path d="M82 98 Q100 94 118 98 Q116 88 100 86 Q84 88 82 98" fill="#15803d" opacity="0.8"/>
    <!-- Scarf end -->
    <path d="M115 125 Q118 135 120 145" stroke="#dc2626" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.8"/>
  `,
  knight: `
    <defs>
      <radialGradient id="kn-bg" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#1e3a5f"/>
        <stop offset="100%" stop-color="#0d0b2b"/>
      </radialGradient>
      <linearGradient id="kn-armor" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
    </defs>
    <rect width="200" height="260" fill="url(#kn-bg)"/>
    <!-- Background grid/order motif -->
    <line x1="0" y1="50" x2="200" y2="50" stroke="#1d4ed8" stroke-width="0.3" opacity="0.3"/>
    <line x1="0" y1="100" x2="200" y2="100" stroke="#1d4ed8" stroke-width="0.3" opacity="0.2"/>
    <line x1="50" y1="0" x2="50" y2="260" stroke="#1d4ed8" stroke-width="0.3" opacity="0.2"/>
    <line x1="150" y1="0" x2="150" y2="260" stroke="#1d4ed8" stroke-width="0.3" opacity="0.2"/>
    <!-- Cape flowing -->
    <path d="M115 142 Q150 175 155 260 L200 260 L200 200 Q175 165 145 142 Z" fill="#1d4ed8" opacity="0.9"/>
    <path d="M118 142 Q148 172 150 260 L195 260 L195 198 Q172 168 142 142 Z" fill="#1e40af"/>
    <!-- Plate mail body navy blue -->
    <path d="M72 148 Q62 200 60 260 L140 260 Q138 200 128 148 Z" fill="#1e3a5f"/>
    <path d="M76 148 Q68 195 68 260 L132 260 Q132 195 124 148 Z" fill="#1d4ed8" opacity="0.7"/>
    <!-- Chest plate -->
    <path d="M76 150 Q100 160 124 150 L120 192 Q100 200 80 192 Z" fill="url(#kn-armor)"/>
    <path d="M80 153 Q100 161 120 153 L116 188 Q100 195 84 188 Z" fill="#334155"/>
    <!-- Crest on chest shield -->
    <circle cx="100" cy="172" r="10" fill="#1d4ed8" opacity="0.8"/>
    <path d="M100 162 L103 169 L110 169 L104 174 L106 181 L100 177 L94 181 L96 174 L90 169 L97 169 Z" fill="#d4af37" opacity="0.9"/>
    <!-- Shoulder pauldrons -->
    <ellipse cx="72" cy="150" rx="16" ry="10" fill="url(#kn-armor)" transform="rotate(-8 72 150)"/>
    <line x1="62" y1="152" x2="82" y2="148" stroke="#475569" stroke-width="1" opacity="0.6"/>
    <line x1="62" y1="156" x2="82" y2="152" stroke="#475569" stroke-width="1" opacity="0.4"/>
    <ellipse cx="128" cy="150" rx="16" ry="10" fill="url(#kn-armor)" transform="rotate(8 128 150)"/>
    <line x1="118" y1="148" x2="138" y2="152" stroke="#475569" stroke-width="1" opacity="0.6"/>
    <!-- Arms in armor -->
    <path d="M72 152 Q58 170 52 195" stroke="#1e3a5f" stroke-width="14" stroke-linecap="round" fill="none"/>
    <path d="M128 152 Q142 168 148 192" stroke="#1e3a5f" stroke-width="14" stroke-linecap="round" fill="none"/>
    <!-- Shield -->
    <path d="M42 178 Q38 195 50 210 Q62 222 70 218 Q78 215 80 200 Q82 185 72 175 Z" fill="#1d4ed8"/>
    <path d="M44 180 Q41 196 52 209 Q62 219 70 215 Q76 213 78 200 Q80 188 72 178 Z" fill="#2563eb"/>
    <!-- Shield crest -->
    <path d="M61 188 L63 195 L69 195 L64 199 L66 206 L61 202 L56 206 L58 199 L53 195 L59 195 Z" fill="#d4af37" opacity="0.9"/>
    <line x1="42" y1="188" x2="80" y2="188" stroke="#d4af37" stroke-width="0.5" opacity="0.4"/>
    <line x1="61" y1="175" x2="61" y2="218" stroke="#d4af37" stroke-width="0.5" opacity="0.4"/>
    <!-- Head - stern -->
    <ellipse cx="100" cy="108" rx="21" ry="23" fill="#e8d5b8"/>
    <!-- Stern dark hair -->
    <path d="M80 103 Q80 82 100 80 Q120 82 120 103" fill="#1c1a35"/>
    <!-- Helmet frame/sides -->
    <path d="M80 103 Q77 92 80 82" stroke="#334155" stroke-width="3" fill="none"/>
    <path d="M120 103 Q123 92 120 82" stroke="#334155" stroke-width="3" fill="none"/>
    <!-- Eyes - disciplined stern -->
    <ellipse cx="93" cy="108" rx="3.5" ry="3.5" fill="#1a0a2e"/>
    <ellipse cx="107" cy="108" rx="3.5" ry="3.5" fill="#1a0a2e"/>
    <circle cx="92" cy="107" r="1" fill="white" opacity="0.9"/>
    <circle cx="106" cy="107" r="1" fill="white" opacity="0.9"/>
    <!-- Steel blue iris -->
    <circle cx="93" cy="108" r="1.8" fill="#1d4ed8"/>
    <circle cx="107" cy="108" r="1.8" fill="#1d4ed8"/>
    <!-- Stern furrowed brow -->
    <path d="M89 103 Q93 101 97 103" stroke="#6b4c2a" stroke-width="1.5" fill="none"/>
    <path d="M103 103 Q107 101 111 103" stroke="#6b4c2a" stroke-width="1.5" fill="none"/>
    <!-- Firm mouth -->
    <path d="M95 119 L105 119" stroke="#c4a882" stroke-width="1.2" fill="none"/>
    <!-- Chin/jaw strong -->
    <path d="M82 118 Q84 128 100 132 Q116 128 118 118" stroke="#c4a882" stroke-width="1" fill="none"/>
    <!-- Epaulette detail -->
    <line x1="66" y1="142" x2="80" y2="148" stroke="#d4af37" stroke-width="1" opacity="0.5"/>
    <line x1="134" y1="142" x2="120" y2="148" stroke="#d4af37" stroke-width="1" opacity="0.5"/>
  `,
  cleric: `
    <defs>
      <radialGradient id="cl-bg" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#1e3a5f"/>
        <stop offset="100%" stop-color="#0d0b2b"/>
      </radialGradient>
      <radialGradient id="cl-heal" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fef3c7" stop-opacity="0.8"/>
        <stop offset="60%" stop-color="#f59e0b" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="200" height="260" fill="url(#cl-bg)"/>
    <!-- Holy light from hands -->
    <ellipse cx="45" cy="185" rx="30" ry="20" fill="url(#cl-heal)" opacity="0.8"/>
    <ellipse cx="155" cy="185" rx="30" ry="20" fill="url(#cl-heal)" opacity="0.8"/>
    <!-- Healing particles -->
    <circle cx="30" cy="175" r="2" fill="#fef3c7" opacity="0.6"/>
    <circle cx="20" cy="160" r="1.5" fill="#fef3c7" opacity="0.5"/>
    <circle cx="40" cy="158" r="1" fill="#fef3c7" opacity="0.7"/>
    <circle cx="170" cy="175" r="2" fill="#fef3c7" opacity="0.6"/>
    <circle cx="180" cy="162" r="1.5" fill="#fef3c7" opacity="0.5"/>
    <circle cx="162" cy="158" r="1" fill="#fef3c7" opacity="0.7"/>
    <circle cx="50" cy="145" r="1.5" fill="#fef3c7" opacity="0.4"/>
    <circle cx="150" cy="145" r="1.5" fill="#fef3c7" opacity="0.4"/>
    <!-- Cross symbols floating -->
    <text x="18" y="135" font-size="10" fill="#fef3c7" opacity="0.5">✛</text>
    <text x="168" y="130" font-size="10" fill="#fef3c7" opacity="0.5">✛</text>
    <!-- White robe body -->
    <path d="M72 148 Q62 200 58 260 L142 260 Q138 200 128 148 Z" fill="#eff6ff"/>
    <path d="M76 148 Q68 195 66 260 L134 260 Q132 195 124 148 Z" fill="#dbeafe"/>
    <!-- Blue trim -->
    <path d="M76 148 Q100 158 124 148" stroke="#2563eb" stroke-width="2" fill="none"/>
    <path d="M66 260 L68 230 Q100 235 132 230 L134 260" stroke="#2563eb" stroke-width="1.5" fill="none" opacity="0.6"/>
    <!-- Holy symbol on chest -->
    <circle cx="100" cy="175" r="14" fill="none" stroke="#2563eb" stroke-width="1.5" opacity="0.7"/>
    <line x1="100" y1="161" x2="100" y2="189" stroke="#2563eb" stroke-width="2"/>
    <line x1="91" y1="172" x2="109" y2="172" stroke="#2563eb" stroke-width="2"/>
    <!-- Arms raised -->
    <path d="M76 150 Q55 158 42 178" stroke="#eff6ff" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M124 150 Q145 158 158 178" stroke="#eff6ff" stroke-width="12" stroke-linecap="round" fill="none"/>
    <!-- Glowing hands -->
    <circle cx="42" cy="180" r="12" fill="#fef3c7" opacity="0.3"/>
    <circle cx="42" cy="180" r="7" fill="#f59e0b" opacity="0.4"/>
    <circle cx="158" cy="180" r="12" fill="#fef3c7" opacity="0.3"/>
    <circle cx="158" cy="180" r="7" fill="#f59e0b" opacity="0.4"/>
    <!-- Golden light rays up -->
    <line x1="42" y1="180" x2="25" y2="145" stroke="#fef3c7" stroke-width="0.5" opacity="0.5"/>
    <line x1="42" y1="180" x2="38" y2="140" stroke="#fef3c7" stroke-width="0.5" opacity="0.4"/>
    <line x1="158" y1="180" x2="175" y2="145" stroke="#fef3c7" stroke-width="0.5" opacity="0.5"/>
    <line x1="158" y1="180" x2="162" y2="140" stroke="#fef3c7" stroke-width="0.5" opacity="0.4"/>
    <!-- Head/face - gentle -->
    <ellipse cx="100" cy="108" rx="21" ry="23" fill="#f5e0c0"/>
    <!-- Hair soft brown -->
    <path d="M80 103 Q80 82 100 80 Q120 82 120 103" fill="#7c2d12" opacity="0.8"/>
    <path d="M80 103 Q76 90 78 80" fill="#7c2d12" opacity="0.8"/>
    <path d="M120 103 Q124 90 122 80" fill="#7c2d12" opacity="0.8"/>
    <!-- Veil/wimple white -->
    <path d="M80 103 Q100 97 120 103 Q118 88 100 86 Q82 88 80 103" fill="white" opacity="0.9"/>
    <path d="M78 108 Q76 130 78 145" stroke="white" stroke-width="4" fill="none" opacity="0.9"/>
    <path d="M122 108 Q124 130 122 145" stroke="white" stroke-width="4" fill="none" opacity="0.9"/>
    <!-- Blue head band -->
    <path d="M80 103 Q100 99 120 103" stroke="#2563eb" stroke-width="2" fill="none"/>
    <!-- Eyes - gentle warm -->
    <ellipse cx="93" cy="110" rx="3.5" ry="4" fill="#1a0a2e"/>
    <ellipse cx="107" cy="110" rx="3.5" ry="4" fill="#1a0a2e"/>
    <circle cx="92" cy="109" r="1.2" fill="white" opacity="0.9"/>
    <circle cx="106" cy="109" r="1.2" fill="white" opacity="0.9"/>
    <circle cx="93" cy="110" r="1.8" fill="#2563eb" opacity="0.8"/>
    <circle cx="107" cy="110" r="1.8" fill="#2563eb" opacity="0.8"/>
    <!-- Gentle smile -->
    <path d="M94 122 Q100 127 106 122" stroke="#c4a882" stroke-width="1.2" fill="none"/>
    <!-- Soft cheeks -->
    <ellipse cx="88" cy="117" rx="5" ry="3" fill="#f87171" opacity="0.2"/>
    <ellipse cx="112" cy="117" rx="5" ry="3" fill="#f87171" opacity="0.2"/>
    <!-- Holy glow around figure -->
    <ellipse cx="100" cy="140" rx="65" ry="80" fill="none" stroke="#fef3c7" stroke-width="0.5" opacity="0.15"/>
  `,
  assassin: `
    <defs>
      <radialGradient id="ass-bg" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#1c1008"/>
        <stop offset="100%" stop-color="#050308"/>
      </radialGradient>
      <linearGradient id="ass-dagger" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e2e8f0"/>
        <stop offset="100%" stop-color="#64748b"/>
      </linearGradient>
    </defs>
    <rect width="200" height="260" fill="url(#ass-bg)"/>
    <!-- Deep shadow on sides -->
    <rect x="0" y="0" width="60" height="260" fill="black" opacity="0.6"/>
    <rect x="140" y="0" width="60" height="260" fill="black" opacity="0.4"/>
    <!-- Shadow tendrils -->
    <path d="M0 120 Q40 110 60 140 Q40 150 0 145 Z" fill="#1c1008" opacity="0.8"/>
    <path d="M200 100 Q165 115 150 145 Q168 150 200 140 Z" fill="#1c1008" opacity="0.6"/>
    <!-- Glowing eyes in darkness -->
    <ellipse cx="92" cy="108" rx="5" ry="4.5" fill="#92400e" opacity="0.9"/>
    <ellipse cx="108" cy="108" rx="5" ry="4.5" fill="#92400e" opacity="0.9"/>
    <circle cx="92" cy="108" r="2.5" fill="#fbbf24" opacity="0.8"/>
    <circle cx="108" cy="108" r="2.5" fill="#fbbf24" opacity="0.8"/>
    <circle cx="91" cy="107" r="1" fill="white" opacity="0.6"/>
    <circle cx="107" cy="107" r="1" fill="white" opacity="0.6"/>
    <!-- Glow from eyes -->
    <ellipse cx="92" cy="108" rx="10" ry="8" fill="#fbbf24" opacity="0.1"/>
    <ellipse cx="108" cy="108" rx="10" ry="8" fill="#fbbf24" opacity="0.1"/>
    <!-- Dark tactical body suit -->
    <path d="M72 148 Q62 205 60 260 L140 260 Q138 205 128 148 Z" fill="#0f0a04"/>
    <path d="M76 148 Q68 200 66 260 L134 260 Q132 200 124 148 Z" fill="#1c1008"/>
    <!-- Tactical straps -->
    <path d="M80 155 Q100 160 120 155" stroke="#374151" stroke-width="1.5" fill="none" opacity="0.8"/>
    <path d="M78 170 Q100 175 122 170" stroke="#374151" stroke-width="1" fill="none" opacity="0.6"/>
    <line x1="100" y1="155" x2="100" y2="200" stroke="#374151" stroke-width="1" opacity="0.5"/>
    <!-- Pouches/gear -->
    <rect x="80" y="188" width="12" height="10" rx="2" fill="#374151" opacity="0.9"/>
    <rect x="108" y="188" width="12" height="10" rx="2" fill="#374151" opacity="0.9"/>
    <!-- Arms in shadow -->
    <path d="M76 152 Q60 168 52 192" stroke="#0f0a04" stroke-width="13" stroke-linecap="round" fill="none"/>
    <path d="M124 152 Q140 168 148 192" stroke="#0f0a04" stroke-width="13" stroke-linecap="round" fill="none"/>
    <!-- Daggers -->
    <rect x="44" y="178" width="4" height="28" rx="2" fill="url(#ass-dagger)" transform="rotate(-15 46 192)"/>
    <rect x="43" y="200" width="10" height="3" rx="1" fill="#374151" transform="rotate(-15 48 201)"/>
    <circle cx="45" cy="205" r="2" fill="#64748b" transform="rotate(-15 46 192)"/>
    <rect x="152" y="178" width="4" height="28" rx="2" fill="url(#ass-dagger)" transform="rotate(15 154 192)"/>
    <rect x="149" y="200" width="10" height="3" rx="1" fill="#374151" transform="rotate(15 154 201)"/>
    <!-- Dagger glint -->
    <line x1="46" y1="180" x2="48" y2="175" stroke="white" stroke-width="1" opacity="0.5" transform="rotate(-15 46 192)"/>
    <line x1="153" y1="180" x2="155" y2="175" stroke="white" stroke-width="1" opacity="0.5" transform="rotate(15 154 192)"/>
    <!-- Head mostly in shadow with hood -->
    <ellipse cx="100" cy="108" rx="22" ry="24" fill="#1c1008"/>
    <!-- Just lower face visible -->
    <ellipse cx="100" cy="118" rx="16" ry="14" fill="#8b6843"/>
    <!-- Nose hint -->
    <path d="M98 113 Q96 117 99 118 Q102 117 100 113" stroke="#7a5c38" stroke-width="0.8" fill="none"/>
    <!-- Grim expression mouth -->
    <path d="M92 124 L108 124" stroke="#6b4c2a" stroke-width="1.2" fill="none"/>
    <!-- Hood/mask -->
    <path d="M78 96 Q78 68 100 65 Q122 68 122 96 L118 108 Q100 102 82 108 Z" fill="#0f0a04"/>
    <path d="M82 104 Q100 100 118 104 Q116 92 100 90 Q84 92 82 104" fill="#1c1408"/>
    <!-- Hood shadow making face mostly dark -->
    <path d="M78 108 Q76 100 78 88 Q80 80 100 78 Q120 80 122 88 Q124 100 122 108 Q110 95 100 95 Q90 95 78 108 Z" fill="#0f0a04" opacity="0.8"/>
    <!-- Scarf over lower face hint -->
    <path d="M82 118 Q100 122 118 118" stroke="#1c1408" stroke-width="6" fill="none"/>
    <!-- Shadow overlay making figure partially invisible -->
    <rect x="0" y="0" width="70" height="260" fill="black" opacity="0.5"/>
    <path d="M0 0 L70 0 L70 260 L0 260 Z" fill="url(#ass-bg)" opacity="0.4"/>
  `,
  ranger: `
    <defs>
      <radialGradient id="rang-bg" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#365314"/>
        <stop offset="100%" stop-color="#0a1a08"/>
      </radialGradient>
    </defs>
    <rect width="200" height="260" fill="url(#rang-bg)"/>
    <!-- Vines and foliage -->
    <path d="M0 80 Q20 60 15 40 Q25 55 20 75 Q35 55 30 30 Q40 50 35 80" fill="#166534" opacity="0.8"/>
    <path d="M0 120 Q15 100 12 80 Q22 100 18 130" fill="#166534" opacity="0.6"/>
    <path d="M200 90 Q185 70 190 50 Q180 65 185 90 Q172 65 175 40 Q168 60 165 90" fill="#166534" opacity="0.8"/>
    <path d="M200 140 Q188 120 192 100 Q182 118 185 145" fill="#166534" opacity="0.6"/>
    <!-- Flowers -->
    <circle cx="15" cy="75" r="5" fill="#f59e0b" opacity="0.7"/>
    <circle cx="10" cy="68" r="3" fill="#ef4444" opacity="0.6"/>
    <circle cx="185" cy="85" r="5" fill="#f59e0b" opacity="0.7"/>
    <circle cx="190" cy="78" r="3" fill="#f472b6" opacity="0.6"/>
    <circle cx="20" cy="95" r="3" fill="#a3e635" opacity="0.5"/>
    <circle cx="180" cy="105" r="3" fill="#a3e635" opacity="0.5"/>
    <!-- Ground foliage -->
    <path d="M0 220 Q30 210 60 215 Q90 220 100 215 Q110 210 140 215 Q170 218 200 210 L200 260 L0 260 Z" fill="#166534" opacity="0.5"/>
    <!-- Leather earth-tone armor body -->
    <path d="M72 148 Q62 200 58 260 L142 260 Q138 200 128 148 Z" fill="#78350f"/>
    <path d="M76 148 Q68 195 66 260 L134 260 Q132 195 124 148 Z" fill="#92400e"/>
    <!-- Leather details -->
    <path d="M80 155 Q100 162 120 155 L118 180 Q100 186 82 180 Z" fill="#7c2d12"/>
    <path d="M82 158 Q100 164 118 158 L116 178 Q100 183 84 178 Z" fill="#a16207" opacity="0.6"/>
    <!-- Belt with quiver hint -->
    <rect x="80" y="192" width="40" height="6" rx="3" fill="#451a03"/>
    <!-- Arms -->
    <path d="M76 152 Q58 168 50 188" stroke="#92400e" stroke-width="11" stroke-linecap="round" fill="none"/>
    <path d="M124 152 Q142 165 150 180" stroke="#92400e" stroke-width="11" stroke-linecap="round" fill="none"/>
    <!-- Bow -->
    <path d="M148 162 Q162 180 148 200" stroke="#78350f" stroke-width="4" fill="none"/>
    <path d="M148 162 Q136 180 148 200" stroke="#451a03" stroke-width="3" fill="none"/>
    <line x1="148" y1="162" x2="148" y2="200" stroke="#d97706" stroke-width="0.8" opacity="0.8"/>
    <!-- Arrow in bow -->
    <line x1="148" y1="175" x2="165" y2="170" stroke="#92400e" stroke-width="1.5" opacity="0.9"/>
    <path d="M163 169 L167 168 L165 172 Z" fill="#92400e"/>
    <!-- Fox companion -->
    <ellipse cx="35" cy="218" rx="18" ry="12" fill="#c2410c"/>
    <ellipse cx="35" cy="218" rx="14" ry="8" fill="#d97706"/>
    <!-- Fox head -->
    <ellipse cx="52" cy="210" rx="12" ry="10" fill="#c2410c"/>
    <!-- Fox ears -->
    <path d="M46 203 L44 195 L50 202" fill="#c2410c"/>
    <path d="M56 203 L58 195 L52 202" fill="#c2410c"/>
    <!-- Fox face -->
    <path d="M56 212 L62 216 L56 215" fill="#f5e0c0"/>
    <circle cx="48" cy="209" r="2" fill="#1a0a2e"/>
    <circle cx="56" cy="209" r="2" fill="#1a0a2e"/>
    <circle cx="47" cy="208" r="0.8" fill="white"/>
    <circle cx="55" cy="208" r="0.8" fill="white"/>
    <!-- Fox tail -->
    <path d="M17 220 Q5 215 8 225 Q12 235 22 230" fill="#c2410c"/>
    <path d="M17 222 Q8 218 10 226 Q13 232 20 228" fill="#f5e0c0"/>
    <!-- Head earth tone -->
    <ellipse cx="100" cy="108" rx="21" ry="23" fill="#e8d0a8"/>
    <!-- Hair - nature -->
    <path d="M80 102 Q78 82 100 80 Q122 82 122 100" fill="#4a2f1a"/>
    <path d="M80 102 Q72 90 74 78" fill="#4a2f1a"/>
    <path d="M122 100 Q128 88 126 76" fill="#4a2f1a"/>
    <!-- Leaf in hair -->
    <path d="M118 88 Q128 78 132 70 Q125 80 118 88" fill="#166534" opacity="0.8"/>
    <!-- Eyes - nature attuned -->
    <ellipse cx="92" cy="110" rx="3.5" ry="4" fill="#1a0a2e"/>
    <ellipse cx="108" cy="110" rx="3.5" ry="4" fill="#1a0a2e"/>
    <circle cx="91" cy="109" r="1.2" fill="white" opacity="0.9"/>
    <circle cx="107" cy="109" r="1.2" fill="white" opacity="0.9"/>
    <circle cx="92" cy="110" r="1.8" fill="#d97706"/>
    <circle cx="108" cy="110" r="1.8" fill="#d97706"/>
    <!-- Calm expression -->
    <path d="M94 121 Q100 125 106 121" stroke="#a16207" stroke-width="1" fill="none"/>
    <!-- Headband -->
    <path d="M80 102 Q100 97 120 102" stroke="#7c2d12" stroke-width="2" fill="none"/>
  `,
  pirate: `
    <defs>
      <radialGradient id="pir-bg" cx="50%" cy="60%" r="80%">
        <stop offset="0%" stop-color="#0c2340"/>
        <stop offset="100%" stop-color="#050a14"/>
      </radialGradient>
      <linearGradient id="pir-ocean" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0e4d6b"/>
        <stop offset="100%" stop-color="#05141e"/>
      </linearGradient>
    </defs>
    <rect width="200" height="260" fill="url(#pir-bg)"/>
    <!-- Ocean waves at bottom -->
    <path d="M0 215 Q25 208 50 215 Q75 222 100 215 Q125 208 150 215 Q175 222 200 215 L200 260 L0 260 Z" fill="url(#pir-ocean)"/>
    <path d="M0 225 Q30 218 60 225 Q90 232 120 225 Q150 218 180 225 Q195 230 200 228 L200 260 L0 260 Z" fill="#073d54" opacity="0.7"/>
    <!-- Wave crests -->
    <path d="M0 215 Q25 208 50 215" stroke="#38bdf8" stroke-width="1" fill="none" opacity="0.4"/>
    <path d="M100 215 Q125 208 150 215" stroke="#38bdf8" stroke-width="1" fill="none" opacity="0.4"/>
    <!-- Ship bow suggestion -->
    <path d="M80 235 Q100 225 120 235 L125 260 L75 260 Z" fill="#7c2d12" opacity="0.8"/>
    <path d="M82 235 Q100 227 118 235 L123 260 L77 260 Z" fill="#92400e" opacity="0.6"/>
    <!-- Coat - dramatic -->
    <path d="M70 150 Q55 205 45 260 L155 260 Q145 205 130 150 Z" fill="#1c1008"/>
    <path d="M74 150 Q62 200 58 260 L142 260 Q138 200 126 150 Z" fill="#292008"/>
    <!-- Red coat lining visible -->
    <path d="M70 150 Q65 180 55 230 Q65 225 70 200 Q78 170 80 150 Z" fill="#7f1d1d" opacity="0.8"/>
    <path d="M130 150 Q135 170 122 200 Q127 225 145 230 Q135 180 130 150 Z" fill="#7f1d1d" opacity="0.8"/>
    <!-- Gold trim on coat -->
    <line x1="80" y1="150" x2="76" y2="200" stroke="#d4af37" stroke-width="1" opacity="0.7"/>
    <line x1="120" y1="150" x2="124" y2="200" stroke="#d4af37" stroke-width="1" opacity="0.7"/>
    <!-- Chest shirt white -->
    <path d="M80 152 Q100 162 120 152 L118 190 Q100 196 82 190 Z" fill="#f0e6d3"/>
    <!-- Sash/belt -->
    <path d="M78 188 Q100 195 122 188" stroke="#b45309" stroke-width="8" fill="none"/>
    <path d="M78 188 Q100 192 122 188" stroke="#d97706" stroke-width="4" fill="none" opacity="0.6"/>
    <!-- Belt buckle -->
    <rect x="95" y="187" width="10" height="8" rx="2" fill="#d4af37"/>
    <!-- Shoulder pauldrons dramatic -->
    <ellipse cx="70" cy="152" rx="16" ry="9" fill="#1c1008" transform="rotate(-5 70 152)"/>
    <path d="M58 148 Q70 144 80 150" stroke="#d4af37" stroke-width="1" opacity="0.6"/>
    <ellipse cx="130" cy="152" rx="16" ry="9" fill="#1c1008" transform="rotate(5 130 152)"/>
    <path d="M120 150 Q130 144 142 148" stroke="#d4af37" stroke-width="1" opacity="0.6"/>
    <!-- Arms -->
    <path d="M70 154 Q52 170 46 195" stroke="#1c1008" stroke-width="13" stroke-linecap="round" fill="none"/>
    <path d="M130 154 Q148 170 154 195" stroke="#1c1008" stroke-width="13" stroke-linecap="round" fill="none"/>
    <!-- Confident fist pose left -->
    <ellipse cx="46" cy="198" rx="10" ry="8" fill="#c4a882"/>
    <!-- Sword hilt right -->
    <rect x="152" y="188" width="8" height="5" rx="2" fill="#d4af37"/>
    <rect x="154" y="192" width="4" height="20" rx="2" fill="#64748b"/>
    <!-- Head - fierce pirate captain -->
    <ellipse cx="100" cy="108" rx="22" ry="24" fill="#c4a882"/>
    <!-- Tricorn hat -->
    <path d="M72 100 Q100 50 128 100 Z" fill="#0f0a04"/>
    <path d="M72 100 Q100 52 128 100" fill="#1c1408"/>
    <ellipse cx="100" cy="101" rx="32" ry="8" fill="#1c1408"/>
    <!-- Hat gold trim -->
    <path d="M72 100 Q100 94 128 100" stroke="#d4af37" stroke-width="1.5" opacity="0.8"/>
    <ellipse cx="100" cy="101" rx="32" ry="8" fill="none" stroke="#d4af37" stroke-width="1" opacity="0.5"/>
    <!-- Skull on hat -->
    <ellipse cx="100" cy="72" rx="7" ry="7" fill="#f0e6d3" opacity="0.9"/>
    <circle cx="97" cy="70" r="1.5" fill="#0f0a04"/>
    <circle cx="103" cy="70" r="1.5" fill="#0f0a04"/>
    <path d="M96 75 Q100 78 104 75" stroke="#0f0a04" stroke-width="1" fill="none"/>
    <!-- Hair peeking out -->
    <path d="M72 102 Q65 112 68 125" stroke="#4a2f1a" stroke-width="5" fill="none"/>
    <!-- Fierce eyes -->
    <ellipse cx="92" cy="110" rx="4" ry="4.5" fill="#1a0a2e"/>
    <ellipse cx="108" cy="110" rx="4" ry="4.5" fill="#1a0a2e"/>
    <circle cx="90" cy="109" r="1.5" fill="white" opacity="0.9"/>
    <circle cx="106" cy="109" r="1.5" fill="white" opacity="0.9"/>
    <!-- Amber fierce iris -->
    <circle cx="92" cy="110" r="2" fill="#b45309"/>
    <circle cx="108" cy="110" r="2" fill="#b45309"/>
    <!-- Scar over eye -->
    <line x1="88" y1="105" x2="95" y2="116" stroke="#7c2d12" stroke-width="1.2" opacity="0.7"/>
    <!-- Smirk -->
    <path d="M93 122 Q100 128 110 121" stroke="#a16207" stroke-width="1.5" fill="none"/>
    <!-- Eyepatch -->
    <ellipse cx="92" cy="110" rx="6" ry="5" fill="#1c1008" opacity="0.8"/>
    <line x1="86" y1="106" x2="78" y2="104" stroke="#1c1008" stroke-width="2"/>
    <!-- Beard/stubble -->
    <path d="M85 122 Q88 132 100 135 Q112 132 115 122" fill="#3d2406" opacity="0.6"/>
    <!-- Waves crashing effect -->
    <path d="M45 225 Q55 218 65 225" stroke="#7dd3fc" stroke-width="0.8" fill="none" opacity="0.5"/>
    <path d="M135 222 Q148 215 158 222" stroke="#7dd3fc" stroke-width="0.8" fill="none" opacity="0.5"/>
  `,
  dancer: `
    <defs>
      <radialGradient id="dan-bg" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#2d1a00"/>
        <stop offset="100%" stop-color="#0d0b1a"/>
      </radialGradient>
      <radialGradient id="dan-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="dan-dress" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="50%" stop-color="#d4af37"/>
        <stop offset="100%" stop-color="#92400e"/>
      </linearGradient>
    </defs>
    <rect width="200" height="260" fill="url(#dan-bg)"/>
    <!-- Starfield -->
    <circle cx="20" cy="20" r="1.5" fill="#fef3c7" opacity="0.8"/>
    <circle cx="50" cy="10" r="1" fill="#fef3c7" opacity="0.6"/>
    <circle cx="80" cy="25" r="1.5" fill="#fef3c7" opacity="0.7"/>
    <circle cx="150" cy="15" r="1" fill="#fef3c7" opacity="0.8"/>
    <circle cx="175" cy="30" r="1.5" fill="#fef3c7" opacity="0.6"/>
    <circle cx="190" cy="15" r="1" fill="#fef3c7" opacity="0.7"/>
    <circle cx="10" cy="60" r="1" fill="#fef3c7" opacity="0.5"/>
    <circle cx="185" cy="75" r="1.5" fill="#fef3c7" opacity="0.5"/>
    <!-- Light glow around dancer -->
    <ellipse cx="105" cy="145" rx="60" ry="80" fill="url(#dan-glow)"/>
    <!-- Light trail left from spin -->
    <path d="M50 130 Q70 110 90 125 Q75 140 60 155 Q45 165 50 130 Z" fill="#f59e0b" opacity="0.1"/>
    <path d="M40 140 Q60 120 80 135" stroke="#f59e0b" stroke-width="1" fill="none" opacity="0.3" stroke-dasharray="3 5"/>
    <!-- Star light trails -->
    <path d="M155 80 Q145 95 135 110" stroke="#fef3c7" stroke-width="0.5" fill="none" opacity="0.4"/>
    <path d="M168 95 Q155 108 140 118" stroke="#f59e0b" stroke-width="0.5" fill="none" opacity="0.4"/>
    <circle cx="155" cy="80" r="2" fill="#fef3c7" opacity="0.7"/>
    <circle cx="168" cy="95" r="2" fill="#f59e0b" opacity="0.6"/>
    <!-- Dress - shimmering, mid spin, flared -->
    <path d="M78 155 Q50 185 35 260 L165 260 Q150 185 122 155 Z" fill="url(#dan-dress)" opacity="0.9"/>
    <path d="M80 158 Q58 188 45 260 L155 260 Q142 188 120 158 Z" fill="#f59e0b" opacity="0.6"/>
    <!-- Dress shimmer details -->
    <path d="M78 160 Q65 185 55 220" stroke="#fef3c7" stroke-width="0.5" opacity="0.4"/>
    <path d="M90 158 Q80 190 75 230" stroke="#fef3c7" stroke-width="0.5" opacity="0.3"/>
    <path d="M122 158 Q130 190 132 230" stroke="#fef3c7" stroke-width="0.5" opacity="0.4"/>
    <!-- Dress top bodice -->
    <path d="M80 150 Q100 160 120 150 L118 175 Q100 182 82 175 Z" fill="#d4af37"/>
    <path d="M82 152 Q100 161 118 152 L116 172 Q100 178 84 172 Z" fill="#f0d060" opacity="0.7"/>
    <!-- Spin arms extended -->
    <path d="M80 155 Q60 145 40 138" stroke="#f5e0c0" stroke-width="9" stroke-linecap="round" fill="none"/>
    <path d="M120 155 Q145 140 165 128" stroke="#f5e0c0" stroke-width="9" stroke-linecap="round" fill="none"/>
    <!-- Trailing sleeves/scarves -->
    <path d="M40 138 Q25 130 15 118 Q30 128 40 138" fill="#f59e0b" opacity="0.5"/>
    <path d="M165 128 Q182 118 190 105 Q178 118 165 128" fill="#f59e0b" opacity="0.5"/>
    <!-- Head - joyful, spinning hair -->
    <ellipse cx="100" cy="105" rx="21" ry="23" fill="#f5e0c0"/>
    <!-- Hair flying from spin -->
    <path d="M80 100 Q70 85 100 82 Q130 85 124 98" fill="#7c2d12"/>
    <path d="M80 100 Q62 88 58 72 Q72 85 80 100" fill="#7c2d12" opacity="0.9"/>
    <path d="M122 98 Q140 88 148 70 Q138 84 122 98" fill="#7c2d12" opacity="0.8"/>
    <path d="M124 102 Q148 98 162 88 Q145 102 124 102" fill="#92400e" opacity="0.7"/>
    <!-- Hair ornament - golden star -->
    <circle cx="115" cy="88" r="4" fill="#d4af37"/>
    <path d="M115 84 L116 87 L119 87 L117 89 L118 92 L115 90 L112 92 L113 89 L111 87 L114 87 Z" fill="#fef3c7"/>
    <!-- Joyful eyes -->
    <path d="M88 108 Q92 105 96 108" stroke="#1a0a2e" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M104 108 Q108 105 112 108" stroke="#1a0a2e" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Cheeks rosy -->
    <ellipse cx="86" cy="114" rx="6" ry="4" fill="#f87171" opacity="0.4"/>
    <ellipse cx="114" cy="114" rx="6" ry="4" fill="#f87171" opacity="0.4"/>
    <!-- Pure joy smile -->
    <path d="M90 120 Q100 128 110 120" stroke="#c4a882" stroke-width="1.5" fill="#f5e0c0" opacity="0.4"/>
    <path d="M91 120 Q100 127 109 120" stroke="none" fill="#f0b080" opacity="0.3"/>
    <!-- Star sparkles from spin -->
    <text x="22" y="155" font-size="10" fill="#f59e0b" opacity="0.7">✦</text>
    <text x="168" y="148" font-size="8" fill="#fef3c7" opacity="0.8">✦</text>
    <text x="35" y="175" font-size="6" fill="#f59e0b" opacity="0.5">★</text>
    <text x="158" y="170" font-size="6" fill="#fef3c7" opacity="0.6">★</text>
  `,
};

const RPG_CLASSES: RpgClass[] = [
  {
    id: "sage",
    name: "大賢者",
    nameEn: "Grand Sage",
    emoji: "🔮",
    color: "#1e40af",
    bgColor: "rgba(124,58,237,0.12)",
    mbtiTypes: ["INTJ", "ENTJ"],
    tagline: "戦略と洞察で世界を動かす者",
    description:
      "あなたは遠大なビジョンを持ち、複雑な問題を俯瞰して解決する天才です。感情に左右されず、論理と戦略で最適解を導き出します。組織の中では「次の一手」を常に読んでいる存在です。",
    strengths: ["長期的思考", "戦略立案", "意思決定力", "構造化能力"],
    weaknesses: ["他者への共感が薄く見られることも", "完璧主義で動き出しが遅くなることも"],
    bestRole: "プロジェクトリーダー・戦略企画・経営",
    skills: ["ストラテジー★★★★★", "カリスマ★★★★☆", "共感力★★☆☆☆", "実行力★★★★★"],
    career: ["経営コンサルタント", "プロダクトマネージャー", "起業家", "戦略アナリスト"],
    element: "闇",
    rank: "SSR",
    illustration: RPG_ILLUSTRATIONS.sage,
  },
  {
    id: "archmage",
    name: "大魔術師",
    nameEn: "Arch Mage",
    emoji: "⚗️",
    color: "#2563eb",
    bgColor: "rgba(139,92,246,0.12)",
    mbtiTypes: ["INTP", "ENTP"],
    tagline: "知識と革新で世界を書き換える者",
    description:
      "あなたの頭脳は常に「なぜ？」を問い続けています。既存の常識を疑い、新しい理論やアイデアを生み出すことに喜びを感じます。議論好きで、正確さを追求する知的冒険者です。",
    strengths: ["分析力", "革新的思考", "論理的説得力", "多角的視点"],
    weaknesses: ["実行フェーズで飽きることも", "議論のための議論になることも"],
    bestRole: "研究開発・エンジニアリング・コンサルティング",
    skills: ["知識★★★★★", "発明★★★★★", "実行力★★★☆☆", "社交性★★★☆☆"],
    career: ["エンジニア", "研究者", "起業家", "システムアーキテクト"],
    element: "風",
    rank: "SR",
    illustration: RPG_ILLUSTRATIONS.archmage,
  },
  {
    id: "prophet",
    name: "予言者",
    nameEn: "Prophet",
    emoji: "🌌",
    color: "#059669",
    bgColor: "rgba(5,150,105,0.12)",
    mbtiTypes: ["INFJ"],
    tagline: "魂の声で人々を導く者",
    description:
      "あなたは人の心の奥深くを感じ取る稀有な力を持っています。社会や人間の本質を見通し、静かに、しかし確実に人々の変革を後押しします。数少ない「真のビジョナリー」です。",
    strengths: ["洞察力", "共感力", "使命感", "長期ビジョン"],
    weaknesses: ["燃え尽きやすい", "理想と現実のギャップに苦しむことも"],
    bestRole: "カウンセリング・教育・NPO・クリエイティブ",
    skills: ["洞察力★★★★★", "共感力★★★★★", "決断力★★★☆☆", "実務力★★★☆☆"],
    career: ["カウンセラー", "教育者", "UXデザイナー", "作家・クリエイター"],
    element: "水",
    rank: "SSR",
    illustration: RPG_ILLUSTRATIONS.prophet,
  },
  {
    id: "bard",
    name: "吟遊詩人",
    nameEn: "Bard",
    emoji: "🎭",
    color: "#10b981",
    bgColor: "rgba(16,185,129,0.12)",
    mbtiTypes: ["INFP"],
    tagline: "魂の表現で世界に色を与える者",
    description:
      "あなたの内側には、豊かな感情と独自の価値観が宿っています。表面的な成功より、「本当に意味のある仕事」を求め続けます。独創的な視点で、人の心に届くものを生み出します。",
    strengths: ["創造力", "共感力", "誠実さ", "独自の世界観"],
    weaknesses: ["批判に傷つきやすい", "現実的なビジネス面が苦手なことも"],
    bestRole: "クリエイティブ・ライティング・デザイン・福祉",
    skills: ["創造力★★★★★", "共感力★★★★★", "論理力★★★☆☆", "実務力★★☆☆☆"],
    career: ["ライター", "デザイナー", "音楽家", "ソーシャルワーカー"],
    element: "自然",
    rank: "SR",
    illustration: RPG_ILLUSTRATIONS.bard,
  },
  {
    id: "paladin",
    name: "聖騎士",
    nameEn: "Paladin",
    emoji: "⚔️",
    color: "#047857",
    bgColor: "rgba(4,120,87,0.12)",
    mbtiTypes: ["ENFJ"],
    tagline: "人々を鼓舞し、共に高みへ導く者",
    description:
      "あなたは天性のリーダーです。人の可能性を見抜き、それを最大限に引き出すことを喜びとします。チームの調和を保ちながら、明確なビジョンへ向かって皆を牽引します。",
    strengths: ["リーダーシップ", "共感力", "コミュニケーション力", "人材育成"],
    weaknesses: ["他者の反応に敏感になりすぎることも", "自分のニーズを後回しにすることも"],
    bestRole: "マネジメント・HR・教育・営業",
    skills: ["カリスマ★★★★★", "共感力★★★★★", "論理力★★★☆☆", "行動力★★★★☆"],
    career: ["マネージャー", "HR・人事", "コーチ", "営業リーダー"],
    element: "光",
    rank: "SR",
    illustration: RPG_ILLUSTRATIONS.paladin,
  },
  {
    id: "adventurer",
    name: "冒険者",
    nameEn: "Adventurer",
    emoji: "🌟",
    color: "#34d399",
    bgColor: "rgba(52,211,153,0.12)",
    mbtiTypes: ["ENFP"],
    tagline: "情熱と可能性で世界を染める者",
    description:
      "あなたはアイデアの泉。常に新しい可能性を探し、人々を巻き込んで夢を形にしていきます。どんな状況でも熱意と明るさで周囲を元気にする、チームの太陽的存在です。",
    strengths: ["発想力", "情熱", "コミュニケーション", "適応力"],
    weaknesses: ["集中力の持続が課題", "完成まで走り切るのが大変なことも"],
    bestRole: "マーケティング・企画・広報・起業",
    skills: ["発想力★★★★★", "行動力★★★★☆", "論理力★★★☆☆", "持続力★★☆☆☆"],
    career: ["マーケター", "起業家", "クリエイティブディレクター", "SNSクリエイター"],
    element: "火",
    rank: "R",
    illustration: RPG_ILLUSTRATIONS.adventurer,
  },
  {
    id: "knight",
    name: "騎士団長",
    nameEn: "Knight Commander",
    emoji: "🛡️",
    color: "#1d4ed8",
    bgColor: "rgba(29,78,216,0.12)",
    mbtiTypes: ["ISTJ", "ESTJ"],
    tagline: "秩序と誠実で組織を守る柱の者",
    description:
      "あなたは責任感と信頼性の塊です。ルールと手順を大切にし、約束は必ず守ります。チームや組織の「根幹」として、安定した結果を出し続ける存在です。",
    strengths: ["信頼性", "組織力", "実行力", "責任感"],
    weaknesses: ["変化への適応に時間がかかることも", "融通が利かないと見られることも"],
    bestRole: "管理職・財務・法務・公務員",
    skills: ["信頼性★★★★★", "実行力★★★★★", "創造力★★☆☆☆", "適応力★★★☆☆"],
    career: ["プロジェクトマネージャー", "会計士", "行政職", "品質管理"],
    element: "大地",
    rank: "SR",
    illustration: RPG_ILLUSTRATIONS.knight,
  },
  {
    id: "cleric",
    name: "聖職者",
    nameEn: "Cleric",
    emoji: "✨",
    color: "#2563eb",
    bgColor: "rgba(37,99,235,0.12)",
    mbtiTypes: ["ISFJ", "ESFJ"],
    tagline: "献身と調和でチームを守る守護者",
    description:
      "あなたは他者のために動くことを喜びとする、組織の「縁の下の力持ち」です。細やかな気配りと強い責任感で、周囲の人を支え続けます。人の心の痛みに誰よりも敏感です。",
    strengths: ["気配り", "協調性", "実務能力", "共感力"],
    weaknesses: ["自分の意見を言いにくいことも", "変化に対して慎重になりすぎることも"],
    bestRole: "医療・福祉・教育・サポート系",
    skills: ["共感力★★★★★", "気配り★★★★★", "自己主張★★☆☆☆", "創造力★★★☆☆"],
    career: ["看護師・医療職", "教師", "カスタマーサポート", "人事・総務"],
    element: "水",
    rank: "R",
    illustration: RPG_ILLUSTRATIONS.cleric,
  },
  {
    id: "assassin",
    name: "影の刺客",
    nameEn: "Shadow Assassin",
    emoji: "🗡️",
    color: "#92400e",
    bgColor: "rgba(146,64,14,0.12)",
    mbtiTypes: ["ISTP"],
    tagline: "冷静な技術と判断力で問題を解決する者",
    description:
      "あなたは実践的な技術者です。理論より行動、話すより手を動かすことで結果を出します。危機的状況でも冷静で、最短経路で問題を解決する「現場のエース」です。",
    strengths: ["技術力", "冷静な判断", "実行力", "危機対応"],
    weaknesses: ["長期計画が苦手なことも", "感情表現が少なく誤解されることも"],
    bestRole: "エンジニア・技術職・緊急対応",
    skills: ["技術力★★★★★", "危機対応★★★★★", "計画力★★★☆☆", "社交性★★☆☆☆"],
    career: ["エンジニア", "外科医", "パイロット", "システム管理者"],
    element: "風",
    rank: "SR",
    illustration: RPG_ILLUSTRATIONS.assassin,
  },
  {
    id: "ranger",
    name: "森の狩人",
    nameEn: "Forest Ranger",
    emoji: "🌿",
    color: "#d97706",
    bgColor: "rgba(217,119,6,0.12)",
    mbtiTypes: ["ISFP"],
    tagline: "感性と自由で自分らしい道を歩む者",
    description:
      "あなたは感性豊かなアーティストです。美しいもの、本物のものに強く惹かれ、自分のペースで深い仕事をします。静かに、しかし確実に独自の価値を生み出す存在です。",
    strengths: ["美的センス", "柔軟性", "共感力", "独自のスタイル"],
    weaknesses: ["自分を売り込むのが苦手なことも", "締め切りや束縛が苦手なことも"],
    bestRole: "デザイン・アート・クラフト・料理",
    skills: ["感性★★★★★", "創造力★★★★★", "自己PR★★☆☆☆", "計画力★★☆☆☆"],
    career: ["グラフィックデザイナー", "フォトグラファー", "料理人", "アーティスト"],
    element: "自然",
    rank: "R",
    illustration: RPG_ILLUSTRATIONS.ranger,
  },
  {
    id: "pirate",
    name: "海賊王",
    nameEn: "Pirate King",
    emoji: "⚓",
    color: "#b45309",
    bgColor: "rgba(180,83,9,0.12)",
    mbtiTypes: ["ESTP"],
    tagline: "機動力と度胸で荒波を乗り越える者",
    description:
      "あなたは行動の人。考えるより先に動き、現場で結果を出します。リスクを恐れず、スピード感のある意思決定で周囲を引っ張ります。ピンチほど実力が輝く「修羅場のスター」です。",
    strengths: ["行動力", "度胸", "現場対応", "説得力"],
    weaknesses: ["長期計画より今に集中しすぎることも", "規律に縛られると力が出にくいことも"],
    bestRole: "営業・起業・トレーダー・スポーツ",
    skills: ["行動力★★★★★", "度胸★★★★★", "計画力★★☆☆☆", "忍耐力★★★☆☆"],
    career: ["起業家", "トップ営業", "スポーツ選手", "トレーダー"],
    element: "火",
    rank: "SR",
    illustration: RPG_ILLUSTRATIONS.pirate,
  },
  {
    id: "dancer",
    name: "星の踊り子",
    nameEn: "Star Dancer",
    emoji: "💃",
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.12)",
    mbtiTypes: ["ESFP"],
    tagline: "輝く存在感で場を満たす光の使者",
    description:
      "あなたはいるだけで場が明るくなる存在です。人を楽しませること、その瞬間を最高にすることに全力を注ぎます。柔軟で社交的、エンターテインメントの申し子です。",
    strengths: ["明るさ", "社交性", "即興力", "共感力"],
    weaknesses: ["長期的なコミットが苦手なことも", "感情的になりやすいことも"],
    bestRole: "芸能・接客・イベント・マーケティング",
    skills: ["社交性★★★★★", "即興力★★★★★", "計画力★★☆☆☆", "論理力★★★☆☆"],
    career: ["エンターテイナー", "PRプランナー", "ホテリエ", "SNSインフルエンサー"],
    element: "光",
    rank: "R",
    illustration: RPG_ILLUSTRATIONS.dancer,
  },
];

// ============================================================
// Work Style Questions（職場スタイル診断）
// ============================================================

type WorkStyleKey = "structure" | "action" | "vision" | "harmony";

interface WorkQuestion {
  id: number;
  scenario: string;
  optionA: string;
  optionB: string;
  keyA: WorkStyleKey;
  keyB: WorkStyleKey;
}

const WORK_QUESTIONS: WorkQuestion[] = [
  {
    id: 1,
    scenario: "新しいプロジェクトが始まります。あなたは？",
    optionA: "まず全体計画を立て、ゴールを明確にする",
    optionB: "とにかく動き出して、走りながら考える",
    keyA: "structure",
    keyB: "action",
  },
  {
    id: 2,
    scenario: "チームで意見が割れました。あなたは？",
    optionA: "データと論理で最善策を説得する",
    optionB: "全員が納得できる着地点を探す",
    keyA: "structure",
    keyB: "harmony",
  },
  {
    id: 3,
    scenario: "締め切りが迫っています。あなたは？",
    optionA: "優先順位を整理して、確実にこなす",
    optionB: "集中力全開で一気にやり切る",
    keyA: "structure",
    keyB: "action",
  },
  {
    id: 4,
    scenario: "理想の働き方に近いのは？",
    optionA: "大きなビジョンを描いて人々を導く仕事",
    optionB: "誰かの役に立つ、縁の下の力持ちな仕事",
    keyA: "vision",
    keyB: "harmony",
  },
];

// Work question variant bank
const WORK_QUESTION_VARIANTS: Record<number, { scenario: string; optionA: string; optionB: string }[]> = {
  1: [
    { scenario: "チームの方向性が定まらないとき、あなたは？", optionA: "全体像を整理して、道筋を示す", optionB: "まず小さく動いて、反応を見る" },
    { scenario: "アイデアが浮かんだとき、あなたは？", optionA: "実現可能かを検討してから動く", optionB: "とりあえず試してみる" },
  ],
  2: [
    { scenario: "職場で衝突が起きたとき、あなたは？", optionA: "事実と根拠をもとに正しい方を支持する", optionB: "双方の立場を理解して和解を促す" },
    { scenario: "重要な決断をするとき、あなたは？", optionA: "データと論理で最善策を選ぶ", optionB: "関わる人全員が納得できる選択をする" },
  ],
  3: [
    { scenario: "想定外のトラブルが発生したとき、あなたは？", optionA: "冷静に状況を整理して対処する", optionB: "全力で動いて一気に解決する" },
    { scenario: "プレッシャーがかかったとき、あなたは？", optionA: "タスクを分解して着実にこなす", optionB: "スイッチが入って集中力が上がる" },
  ],
  4: [
    { scenario: "将来のキャリアで重視するのは？", optionA: "自分のビジョンを形にする仕事", optionB: "誰かの支えになる・感謝される仕事" },
    { scenario: "チームに貢献するのは？", optionA: "新しいアイデアや戦略を提案すること", optionB: "メンバーのモチベーションを維持すること" },
  ],
};

function getRandomWorkQuestions(): WorkQuestion[] {
  return WORK_QUESTIONS.map((q) => {
    const variants = WORK_QUESTION_VARIANTS[q.id];
    if (!variants || variants.length === 0) return q;
    const all = [{ scenario: q.scenario, optionA: q.optionA, optionB: q.optionB }, ...variants];
    const picked = all[Math.floor(Math.random() * all.length)];
    return { ...q, ...picked };
  });
}

// Work style modifiers
const STYLE_MODIFIERS: Record<WorkStyleKey, { title: string; advice: string }> = {
  structure: {
    title: "秩序型",
    advice: "あなたは仕組みと計画の上で最も力を発揮します。マニュアル整備や工程管理など、型を作る仕事でチームの生産性を底上げできます。",
  },
  action: {
    title: "突破型",
    advice: "あなたはスピードと行動力が武器です。新規開拓や問題解決の最前線、締め切りが厳しい現場ほど輝きます。",
  },
  vision: {
    title: "ビジョン型",
    advice: "あなたは大きな絵を描き、人を動かす力を持ちます。リーダーやスポークスパーソンとして、長期的な方向性を示す役割が向いています。",
  },
  harmony: {
    title: "調和型",
    advice: "あなたはチームの空気を読み、関係を紡ぐ才能があります。多様なメンバーをまとめるファシリテーターや、顧客との信頼構築が得意分野です。",
  },
};

// ============================================================
// Tarot data (simplified for career)
// ============================================================

interface CareerTarot {
  name: string;
  nameEn: string;
  symbol: string;
  careerMessage: string;
  color: string;
}

const CAREER_TAROTS: CareerTarot[] = [
  { name: "皇帝", nameEn: "The Emperor", symbol: "IV", careerMessage: "リーダーシップを発揮するとき。組織のトップを目指す道が開けています。", color: "#e74c3c" },
  { name: "女教皇", nameEn: "The High Priestess", symbol: "II", careerMessage: "直感と内なる知恵があなたの最大の資産。専門性を深めてください。", color: "#3498db" },
  { name: "魔術師", nameEn: "The Magician", symbol: "I", careerMessage: "持っているスキルを全て活かす時。新しい挑戦に踏み出してください。", color: "#e67e22" },
  { name: "太陽", nameEn: "The Sun", symbol: "XIX", careerMessage: "今は輝きの時。自信を持って自己表現し、チャンスをつかんでください。", color: "#f39c12" },
  { name: "星", nameEn: "The Star", symbol: "XVII", careerMessage: "夢と希望が仕事の原動力。長期的なビジョンを持ち続けることが大切です。", color: "#1abc9c" },
  { name: "世界", nameEn: "The World", symbol: "XXI", careerMessage: "一つのステージが完成へ。次のステージへ向けて準備を整えましょう。", color: "#27ae60" },
  { name: "力", nameEn: "Strength", symbol: "VIII", careerMessage: "内なる強さを信じてください。粘り強さがあなたの最大の武器です。", color: "#ff9800" },
];

// ============================================================
// MBTI Types list
// ============================================================

const ALL_MBTI: string[] = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
];

function getRpgClass(mbti: string): RpgClass {
  return RPG_CLASSES.find((c) => c.mbtiTypes.includes(mbti)) ?? RPG_CLASSES[0];
}

function getWorkStyleModifier(scores: Record<WorkStyleKey, number>): WorkStyleKey {
  const keys = Object.keys(scores) as WorkStyleKey[];
  return keys.reduce((a, b) => (scores[a] >= scores[b] ? a : b));
}

// ============================================================
// Sub-components
// ============================================================

function SectionTitle({ en, ja }: { en: string; ja: string }) {
  return (
    <div className="text-center mb-8">
      <p style={{ fontSize: 11, letterSpacing: "0.4em", color: "rgba(255,255,255,0.4)", opacity: 0.7, marginBottom: 8 }}>{en}</p>
      <h2 style={{ fontSize: "clamp(1.1rem, 4vw, 1.4rem)", fontWeight: 300, fontFamily: "var(--font-noto-serif-jp), serif" }}>
        {ja}
      </h2>
      <div style={{ height: 1, width: 64, margin: "16px auto 0", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }} />
    </div>
  );
}

function RankBadge({ rank }: { rank: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    SSR: { bg: "rgba(255,255,255,0.2)", color: "#EDEDED" },
    SR: { bg: "linear-gradient(135deg,#9b59b6,#8e44ad)", color: "#fff" },
    R: { bg: "rgba(255,255,255,0.12)", color: "#f0e6d3" },
  };
  const c = colors[rank] ?? colors.R;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 12px",
        borderRadius: 9999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.15em",
        background: c.bg,
        color: c.color,
      }}
    >
      {rank}
    </span>
  );
}

function ClassIllustration({ classId, color }: { classId: string; color: string }) {
  const illustration = RPG_ILLUSTRATIONS[classId] ?? "";
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 280,
        margin: "0 auto 16px",
        borderRadius: 16,
        overflow: "hidden",
        border: `1px solid ${color}40`,
        boxShadow: `0 0 30px ${color}25`,
        background: "linear-gradient(160deg, #0d0b2b, #1a0640)",
      }}
    >
      <svg
        viewBox="0 0 200 260"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        dangerouslySetInnerHTML={{ __html: illustration }}
      />
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

type Phase = "intro" | "mbti" | "questions" | "tarot" | "analyzing" | "result";

export default function CareerPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [selectedMbti, setSelectedMbti] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [activeWorkQuestions] = useState(() => getRandomWorkQuestions());
  const [workScores, setWorkScores] = useState<Record<WorkStyleKey, number>>({
    structure: 0, action: 0, vision: 0, harmony: 0,
  });
  const [tarotCards, setTarotCards] = useState<CareerTarot[]>([]);
  const [selectedTarot, setSelectedTarot] = useState<CareerTarot | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [analyzeText, setAnalyzeText] = useState(0);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);

  const analyzeTexts = [
    "RPG職業データベースを参照中...",
    "性格タイプと照合中...",
    "タロットの神託を統合中...",
    "あなたの職場ロールを確定中...",
  ];

  // Shuffle tarots on mount
  useEffect(() => {
    const arr = [...CAREER_TAROTS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setTarotCards(arr);
  }, []);

  // Analyzing animation
  useEffect(() => {
    if (phase !== "analyzing") return;
    const textTimer = setInterval(() => setAnalyzeText((p) => Math.min(p + 1, analyzeTexts.length - 1)), 600);
    const progressTimer = setInterval(() => setAnalyzeProgress((p) => Math.min(p + 4, 100)), 80);
    const done = setTimeout(() => setPhase("result"), 2600);
    return () => { clearInterval(textTimer); clearInterval(progressTimer); clearTimeout(done); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");

  // Load saved MBTI from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("revela_user");
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u.mbti) setSelectedMbti(u.mbti);
      }
      const savedCode = localStorage.getItem("revela_mycode");
      if (savedCode) setCodeInput(savedCode);
    } catch { /* ignore */ }
  }, []);

  const handleCodeSkip = () => {
    const parsed = parseRevelaCode(codeInput.trim());
    if (!parsed) {
      setCodeError("形式が正しくありません（例: ENFP-FCRO-うお-月）");
      return;
    }
    setSelectedMbti(parsed.mbti);
    setPhase("questions");
  };

  const handleAnswer = (key: WorkStyleKey) => {
    const newScores = { ...workScores, [key]: workScores[key] + 1 };
    setWorkScores(newScores);
    if (qIndex + 1 < activeWorkQuestions.length) {
      setQIndex(qIndex + 1);
    } else {
      setPhase("tarot");
    }
  };

  const handleTarotPick = (idx: number) => {
    if (flippedCard !== null) return;
    setFlippedCard(idx);
    setTimeout(() => {
      setSelectedTarot(tarotCards[idx]);
      setAnalyzeText(0);
      setAnalyzeProgress(0);
      setTimeout(() => setPhase("analyzing"), 900);
    }, 600);
  };

  const rpgClass = selectedMbti ? getRpgClass(selectedMbti) : null;
  const workStyleKey = getWorkStyleModifier(workScores);
  const workStyle = STYLE_MODIFIERS[workStyleKey];

  // ──────────────────────────────────────────────────────────
  // RENDER PHASES
  // ──────────────────────────────────────────────────────────

  // Analyzing
  if (phase === "analyzing") {
    return (
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "#0a0a0a",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}
      >
        <style>{`
          @keyframes rpgRing { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes rpgRingCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
          @keyframes rpgPulse { 0%,100% { opacity:0.7; transform:scale(1); } 50% { opacity:1; transform:scale(1.1); } }
          @keyframes rpgTextFade { 0% { opacity:0; transform:translateY(6px); } 15% { opacity:1; transform:translateY(0); } 85% { opacity:1; } 100% { opacity:0; } }
        `}</style>
        <div style={{ position: "relative", width: 160, height: 160, marginBottom: 32 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.3)", animation: "rpgRing 6s linear infinite" }} />
          <div style={{ position: "absolute", inset: 20, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.5)", animation: "rpgRingCCW 4s linear infinite" }} />
          <div style={{ position: "absolute", inset: 40, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.7)", boxShadow: "0 0 20px rgba(255,255,255,0.3)", animation: "rpgRing 2s linear infinite" }} />
          <div
            style={{
              position: "absolute", inset: 55,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28,
              animation: "rpgPulse 2s ease-in-out infinite",
            }}
          >
            ⚔️
          </div>
        </div>
        <div style={{ height: 24, marginBottom: 24 }}>
          <p
            key={analyzeText}
            style={{
              fontSize: 12, color: "rgba(255,255,255,0.55)", letterSpacing: "0.12em",
              opacity: 0, animation: "rpgTextFade 0.6s ease forwards",
              fontFamily: "var(--font-noto-serif-jp), serif",
            }}
          >
            {analyzeTexts[analyzeText]}
          </p>
        </div>
        <div style={{ width: 200, height: 2, background: "rgba(255,255,255,0.15)", borderRadius: 9999, overflow: "hidden" }}>
          <div
            style={{
              height: "100%", width: `${analyzeProgress}%`,
              background: "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.9))",
              borderRadius: 9999, transition: "width 0.08s linear",
            }}
          />
        </div>
      </div>
    );
  }

  // Result
  if (phase === "result" && rpgClass && selectedTarot) {
    const handleSaveImage = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw background
      const gradient = ctx.createLinearGradient(0, 0, 0, 800);
      gradient.addColorStop(0, "#0a0a0a");
      gradient.addColorStop(1, "#1a0640");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 800);

      // Draw gold border
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 580, 780);

      // Draw revela logo text
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.font = "bold 18px serif";
      ctx.textAlign = "center";
      ctx.fillText("revela", 300, 50);

      // Draw class emoji (text)
      ctx.font = "80px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(rpgClass.emoji, 300, 200);

      // Draw class name
      ctx.fillStyle = rpgClass.color;
      ctx.font = "bold 48px serif";
      ctx.textAlign = "center";
      ctx.fillText(rpgClass.name, 300, 270);

      // Draw tagline
      ctx.fillStyle = "rgba(240,230,211,0.7)";
      ctx.font = "italic 18px serif";
      ctx.fillText(`\u300C${rpgClass.tagline}\u300D`, 300, 310);

      // Draw MBTI
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "14px sans-serif";
      ctx.fillText("性格タイプ", 300, 360);
      ctx.fillStyle = rpgClass.color;
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(selectedMbti, 300, 400);

      // Draw work style
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "14px sans-serif";
      ctx.fillText("WORK STYLE", 300, 440);
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(workStyle.title, 300, 475);

      // Draw separator line
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 500);
      ctx.lineTo(540, 500);
      ctx.stroke();

      // Draw tarot
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "14px sans-serif";
      ctx.fillText("TAROT", 300, 535);
      ctx.fillStyle = selectedTarot.color;
      ctx.font = "bold 22px serif";
      ctx.fillText(selectedTarot.name, 300, 565);

      // Draw footer
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "13px sans-serif";
      ctx.fillText("revela.jp | RPG\u9069\u8077\u8A3A\u65AD", 300, 620);

      // Trigger download
      const link = document.createElement("a");
      link.download = `revela-rpg-${rpgClass.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    return (
      <div className="relative min-h-screen px-4 py-10 sm:py-14">
        <style>{`
          @keyframes resultReveal { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          .result-card { animation: resultReveal 0.6s ease forwards; opacity: 0; }
        `}</style>

        <div className="max-w-xl mx-auto">
          <div className="result-card text-center mb-8" style={{ animationDelay: "0.1s" }}>
            <p style={{ fontSize: 10, letterSpacing: "0.4em", color: "rgba(255,255,255,0.55)", opacity: 0.6, marginBottom: 8 }}>RPG CAREER READING</p>
            <h1 style={{ fontSize: "clamp(1.3rem, 5vw, 1.8rem)", fontWeight: 300, fontFamily: "var(--font-noto-serif-jp), serif", marginBottom: 4 }}>
              あなたの職場ロール
            </h1>
            <div style={{ height: 1, width: 80, margin: "12px auto 0", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }} />
          </div>

          {/* Class Card */}
          <div
            id="rpg-result-card"
            className="result-card"
            style={{
              animationDelay: "0.3s",
              background: rpgClass.bgColor,
              border: `1px solid ${rpgClass.color}40`,
              borderRadius: 20,
              padding: "28px 24px",
              marginBottom: 20,
              textAlign: "center",
              boxShadow: `0 0 40px ${rpgClass.color}20`,
            }}
          >
            <ClassIllustration classId={rpgClass.id} color={rpgClass.color} />
            <div style={{ fontSize: 56, marginBottom: 8, lineHeight: 1 }}>{rpgClass.emoji}</div>
            <p style={{ fontSize: 11, letterSpacing: "0.3em", opacity: 0.6, marginBottom: 4 }}>{rpgClass.nameEn}</p>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 6vw, 2.2rem)",
                fontWeight: 700,
                fontFamily: "var(--font-noto-serif-jp), serif",
                color: rpgClass.color,
                marginBottom: 6,
                textShadow: `0 0 20px ${rpgClass.color}60`,
              }}
            >
              {rpgClass.name}
            </h2>
            <p style={{ fontSize: 13, opacity: 0.7, fontStyle: "italic", marginBottom: 16 }}>「{rpgClass.tagline}」</p>
            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${rpgClass.color}40, transparent)`, marginBottom: 16 }} />
            <p style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.85, fontFamily: "var(--font-noto-serif-jp), serif" }}>
              {rpgClass.description}
            </p>
          </div>

          {/* MBTI + Style badge row */}
          <div className="result-card" style={{ animationDelay: "0.45s", display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <div
              style={{
                flex: 1, minWidth: 120,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 14, padding: "14px 16px", textAlign: "center",
              }}
            >
              <p style={{ fontSize: 10, opacity: 0.5, letterSpacing: "0.2em", marginBottom: 4 }}>性格タイプ</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: rpgClass.color }}>{selectedMbti}</p>
            </div>
            <div
              style={{
                flex: 2, minWidth: 160,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 14, padding: "14px 16px", textAlign: "center",
              }}
            >
              <p style={{ fontSize: 10, opacity: 0.5, letterSpacing: "0.2em", marginBottom: 4 }}>WORK STYLE</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>{workStyle.title}</p>
            </div>
            <div
              style={{
                flex: 1, minWidth: 100,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 14, padding: "14px 16px", textAlign: "center",
              }}
            >
              <p style={{ fontSize: 10, opacity: 0.5, letterSpacing: "0.2em", marginBottom: 4 }}>ELEMENT</p>
              <p style={{ fontSize: 16, fontWeight: 600 }}>{rpgClass.element}</p>
            </div>
          </div>

          {/* Skills */}
          <div
            className="result-card"
            style={{
              animationDelay: "0.55s",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, padding: "20px 20px", marginBottom: 20,
            }}
          >
            <p style={{ fontSize: 11, letterSpacing: "0.25em", opacity: 0.5, marginBottom: 14 }}>SKILL STATS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {rpgClass.skills.map((s) => (
                <p key={s} style={{ fontSize: 13, fontFamily: "monospace", color: "rgba(255,255,255,0.55)" }}>{s}</p>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="result-card" style={{ animationDelay: "0.65s", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div
              style={{
                background: "rgba(52,211,153,0.06)",
                border: "1px solid rgba(52,211,153,0.2)",
                borderRadius: 14, padding: "16px",
              }}
            >
              <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "#34d399", marginBottom: 10 }}>STRENGTHS</p>
              {rpgClass.strengths.map((s) => (
                <p key={s} style={{ fontSize: 12, opacity: 0.85, marginBottom: 4 }}>✦ {s}</p>
              ))}
            </div>
            <div
              style={{
                background: "rgba(248,113,113,0.06)",
                border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: 14, padding: "16px",
              }}
            >
              <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "#f87171", marginBottom: 10 }}>GROWTH</p>
              {rpgClass.weaknesses.map((w) => (
                <p key={w} style={{ fontSize: 12, opacity: 0.85, marginBottom: 4 }}>△ {w}</p>
              ))}
            </div>
          </div>

          {/* Work Style Advice */}
          <div
            className="result-card"
            style={{
              animationDelay: "0.75s",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 16, padding: "20px", marginBottom: 20,
            }}
          >
            <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "rgba(255,255,255,0.55)", opacity: 0.7, marginBottom: 10 }}>
              WORK STYLE — {workStyle.title}
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.8, fontFamily: "var(--font-noto-serif-jp), serif", opacity: 0.9 }}>
              {workStyle.advice}
            </p>
          </div>

          {/* Tarot Message */}
          <div
            className="result-card"
            style={{
              animationDelay: "0.85s",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16, padding: "20px", marginBottom: 20,
            }}
          >
            <p style={{ fontSize: 10, letterSpacing: "0.25em", opacity: 0.5, marginBottom: 10 }}>TAROT MESSAGE</p>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 52, height: 80, borderRadius: 8, flexShrink: 0,
                  background: `linear-gradient(135deg, ${selectedTarot.color}40, rgba(13,11,43,0.8))`,
                  border: `1px solid ${selectedTarot.color}60`,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 2,
                }}
              >
                <span style={{ fontSize: 10, opacity: 0.6, fontFamily: "serif" }}>{selectedTarot.symbol}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: selectedTarot.color, textAlign: "center", lineHeight: 1.2 }}>
                  {selectedTarot.name}
                </span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.8, opacity: 0.9, fontFamily: "var(--font-noto-serif-jp), serif" }}>
                {selectedTarot.careerMessage}
              </p>
            </div>
          </div>

          {/* Career paths */}
          <div
            className="result-card"
            style={{
              animationDelay: "0.95s",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, padding: "20px", marginBottom: 28,
            }}
          >
            <p style={{ fontSize: 10, letterSpacing: "0.25em", opacity: 0.5, marginBottom: 14 }}>向いている職業</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {rpgClass.career.map((c) => (
                <span
                  key={c}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 9999,
                    fontSize: 12,
                    background: `${rpgClass.color}15`,
                    border: `1px solid ${rpgClass.color}40`,
                    color: rpgClass.color,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="result-card" style={{ animationDelay: "1.05s", display: "flex", flexDirection: "column", gap: 12 }}>
            <Link
              href="/me"
              style={{
                display: "block", textAlign: "center",
                padding: "14px",
                borderRadius: 14,
                fontSize: 14, fontWeight: 500, letterSpacing: "0.08em",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#EDEDED",
                textDecoration: "none",
              }}
            >
              ✦ 自己分析プロフィールを見る
            </Link>
            <button
              onClick={handleSaveImage}
              style={{
                padding: "12px",
                borderRadius: 14,
                fontSize: 13,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "rgba(255,255,255,0.55)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              🖼️ 画像として保存
            </button>
            <button
              onClick={() => {
                setPhase("intro");
                setSelectedMbti("");
                setQIndex(0);
                setWorkScores({ structure: 0, action: 0, vision: 0, harmony: 0 } as Record<WorkStyleKey, number>);
                setSelectedTarot(null);
                setFlippedCard(null);
                setAnalyzeText(0);
                setAnalyzeProgress(0);
              }}
              style={{
                padding: "12px",
                borderRadius: 14,
                fontSize: 13,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
              }}
            >
              もう一度診断する
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────
  // FLOW PHASES
  // ──────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen px-4 py-10 sm:py-14">
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeInUp 0.5s ease forwards; }
        @keyframes cardHoverGlow { 0%,100% { box-shadow: 0 4px 12px rgba(0,0,0,0.4); } 50% { box-shadow: 0 4px 24px rgba(255,255,255,0.3); } }
        .tarot-hover { animation: cardHoverGlow 2s ease-in-out infinite; }
      `}</style>

      <div className="max-w-lg mx-auto">

        {/* ── INTRO ── */}
        {phase === "intro" && (
          <div className="fade-up text-center">
            <div style={{ fontSize: 52, marginBottom: 16 }}>⚔️</div>
            <p style={{ fontSize: 10, letterSpacing: "0.4em", color: "rgba(255,255,255,0.55)", opacity: 0.6, marginBottom: 12 }}>RPG CAREER READING</p>
            <h1 style={{ fontSize: "clamp(1.4rem, 5vw, 2rem)", fontWeight: 300, fontFamily: "var(--font-noto-serif-jp), serif", marginBottom: 12 }}>
              職場キャラ診断
            </h1>
            <p style={{ fontSize: 13, lineHeight: 1.9, opacity: 0.7, marginBottom: 32, fontFamily: "var(--font-noto-serif-jp), serif" }}>
              あなたのMBTIと働き方の癖から、<br />
              職場でのキャラクタータイプを診断します。<br />
              <span style={{ color: "rgba(255,255,255,0.55)" }}>あなたは魔術師？騎士？それとも予言者？</span>
            </p>
            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 16, padding: "16px 20px", marginBottom: 32,
                fontSize: 12, opacity: 0.7, lineHeight: 1.8, textAlign: "left",
              }}
            >
              <p style={{ marginBottom: 4 }}>📋 MBTI選択（スキップ可）</p>
              <p style={{ marginBottom: 4 }}>🎯 職場スタイル質問 × 4問</p>
              <p>🃏 タロットカードを1枚引く</p>
            </div>
            <button
              onClick={() => setPhase("mbti")}
              style={{
                width: "100%", padding: "16px",
                borderRadius: 14, fontSize: 15, fontWeight: 700,
                letterSpacing: "0.1em",
                background: "rgba(255,255,255,0.12)",
                color: "#EDEDED", cursor: "pointer", border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              診断スタート ✦
            </button>

            {/* Code skip */}
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 11, opacity: 0.4, marginBottom: 8, letterSpacing: "0.1em" }}>— コードでMBTIをスキップ —</p>
              {selectedMbti && (
                <button
                  onClick={() => setPhase("questions")}
                  style={{
                    width: "100%", padding: "12px",
                    borderRadius: 12, fontSize: 13, fontWeight: 600,
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    color: "rgba(255,255,255,0.55)", cursor: "pointer", marginBottom: 8,
                  }}
                >
                  ⚡ MBTI: {selectedMbti} でそのまま診断する
                </button>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  placeholder="例: ENFP-FCRO-うお-月"
                  value={codeInput}
                  onChange={(e) => { setCodeInput(e.target.value); setCodeError(""); }}
                  style={{
                    flex: 1, padding: "10px 12px",
                    borderRadius: 10, fontSize: 12,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "#f0e6d3", outline: "none",
                  }}
                />
                <button
                  onClick={handleCodeSkip}
                  style={{
                    padding: "10px 14px", borderRadius: 10, fontSize: 12,
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "rgba(255,255,255,0.55)", cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  スキップ →
                </button>
              </div>
              {codeError && <p style={{ fontSize: 11, color: "#f87171", marginTop: 6 }}>{codeError}</p>}
            </div>
          </div>
        )}

        {/* ── MBTI ── */}
        {phase === "mbti" && (
          <div className="fade-up">
            <SectionTitle en="STEP 01" ja="性格タイプを選んでください" />
            <p style={{ fontSize: 12, opacity: 0.5, textAlign: "center", marginBottom: 20 }}>
              わからない場合はスキップできます
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24 }}>
              {ALL_MBTI.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedMbti(type)}
                  style={{
                    padding: "10px 4px",
                    borderRadius: 10,
                    fontSize: 13, fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: selectedMbti === type ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
                    border: selectedMbti === type ? "none" : "1px solid rgba(255,255,255,0.2)",
                    color: selectedMbti === type ? "#EDEDED" : "rgba(255,255,255,0.55)",
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => { setSelectedMbti("INFP"); setPhase("questions"); }}
                style={{
                  flex: 1, padding: "12px",
                  borderRadius: 12, fontSize: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)", cursor: "pointer",
                }}
              >
                スキップ
              </button>
              <button
                onClick={() => { if (selectedMbti) setPhase("questions"); }}
                disabled={!selectedMbti}
                style={{
                  flex: 2, padding: "14px",
                  borderRadius: 12, fontSize: 14, fontWeight: 600,
                  background: selectedMbti ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.1)",
                  color: selectedMbti ? "#EDEDED" : "rgba(255,255,255,0.3)",
                  border: "none", cursor: selectedMbti ? "pointer" : "default",
                  transition: "all 0.2s ease",
                }}
              >
                次へ →
              </button>
            </div>
          </div>
        )}

        {/* ── WORK QUESTIONS ── */}
        {phase === "questions" && (
          <div key={qIndex} className="fade-up">
            <SectionTitle en={`STEP 02 · ${qIndex + 1}/${activeWorkQuestions.length}`} ja="職場スタイル診断" />
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 20, padding: "24px",
                marginBottom: 20,
              }}
            >
              <p
                style={{
                  fontSize: "clamp(0.95rem, 3.5vw, 1.05rem)",
                  lineHeight: 1.8,
                  fontFamily: "var(--font-noto-serif-jp), serif",
                  marginBottom: 0,
                }}
              >
                {activeWorkQuestions[qIndex].scenario}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: activeWorkQuestions[qIndex].optionA, key: activeWorkQuestions[qIndex].keyA },
                { label: activeWorkQuestions[qIndex].optionB, key: activeWorkQuestions[qIndex].keyB },
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.key)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: 14,
                    fontSize: 14,
                    lineHeight: 1.6,
                    textAlign: "left",
                    cursor: "pointer",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#f0e6d3",
                    transition: "all 0.2s ease",
                    fontFamily: "var(--font-noto-serif-jp), serif",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.55)", marginRight: 8, fontWeight: 700 }}>{i === 0 ? "A" : "B"}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── TAROT ── */}
        {phase === "tarot" && (
          <div className="fade-up text-center">
            <SectionTitle en="STEP 03" ja="カードを一枚引いてください" />
            <p style={{ fontSize: 12, opacity: 0.5, marginBottom: 32 }}>
              あなたのキャリアに贈るメッセージを選んでください
            </p>

            {/* Card fan */}
            <div
              style={{
                position: "relative",
                height: 180,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                marginBottom: 24,
              }}
            >
              {tarotCards.map((card, idx) => {
                const fanX = (idx - Math.floor(tarotCards.length / 2)) * 22;
                const fanRotate = (idx - Math.floor(tarotCards.length / 2)) * 6;
                const isFlipped = flippedCard === idx;
                const isOther = flippedCard !== null && flippedCard !== idx;
                const isHovered = hoveredCard === idx && flippedCard === null;

                let transform = `translateX(${fanX}px) rotate(${fanRotate}deg)`;
                if (isHovered) transform = `translateX(${fanX}px) rotate(${fanRotate * 0.3}deg) translateY(-18px)`;
                if (isFlipped) transform = `translateX(0) rotate(0deg) translateY(-24px)`;

                return (
                  <div
                    key={idx}
                    onClick={() => handleTarotPick(idx)}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      width: 64,
                      height: 100,
                      borderRadius: 8,
                      cursor: flippedCard === null ? "pointer" : "default",
                      transform,
                      transition: "transform 0.4s ease, opacity 0.4s ease",
                      opacity: isOther ? 0.2 : 1,
                      zIndex: isFlipped ? 10 : isHovered ? 5 : idx,
                      overflow: "hidden",
                      boxShadow: isHovered
                        ? "0 0 16px rgba(255,255,255,0.6)"
                        : isFlipped
                        ? "0 0 30px rgba(255,255,255,0.8)"
                        : "0 4px 12px rgba(0,0,0,0.5)",
                    }}
                  >
                    {isFlipped ? (
                      // Card front
                      <div
                        style={{
                          width: "100%", height: "100%",
                          background: `linear-gradient(135deg, ${card.color}30, rgba(13,11,43,0.9))`,
                          border: `1px solid ${card.color}60`,
                          display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "center", gap: 4,
                        }}
                      >
                        <span style={{ fontSize: 9, opacity: 0.5, fontFamily: "serif" }}>{card.symbol}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: card.color, textAlign: "center", lineHeight: 1.2, padding: "0 4px" }}>
                          {card.name}
                        </span>
                      </div>
                    ) : (
                      // Card back
                      <div
                        style={{
                          width: "100%", height: "100%",
                          background: "linear-gradient(135deg, #1a0a3d, #0d0b2b)",
                          border: "1px solid rgba(255,255,255,0.3)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <svg viewBox="0 0 64 100" style={{ width: "80%", height: "80%" }}>
                          <rect x="4" y="4" width="56" height="92" rx="4" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                          <circle cx="32" cy="50" r="16" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
                          <polygon points="32,36 35,46 45,46 37,52 40,62 32,56 24,62 27,52 19,46 29,46" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
                          <circle cx="32" cy="50" r="4" fill="rgba(255,255,255,0.2)" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
