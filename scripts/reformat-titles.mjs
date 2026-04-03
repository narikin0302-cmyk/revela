/**
 * 記事タイトルフォーマット変換スクリプト
 *
 * 変換後フォーマット:
 *   建て前記事: ＜建て前＞[タイプ名]の[コンテンツ]
 *   本音記事:   ＜本音＞[欲求フレーズ]の[コンテンツ]
 *
 * 対応するタイトルパターン:
 *   - ESFP（エンターテイナー）の○○
 *   - ESFPの○○
 *   - 感覚×適応【その場を明るくする人】の○○
 *   - 積極×オープン【自分のやり方を貫きたい】の○○
 *
 * Usage:
 *   --dry-run  : スキャンのみ
 *   --execute  : 実際に変更
 */

import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DB_ID = process.env.NOTION_BLOG_DB_ID;
const isDryRun = !process.argv.includes("--execute");

// ── 建て前タイプ マッピング ────────────────────────────────────
const MBTI_MAP = {
  INTJ: "遠くを見据えて動く人",
  INTP: "本質を追いかける人",
  ENTJ: "場を仕切って動かす人",
  ENTP: "常識を疑い続ける人",
  INFJ: "人の未来を見通す人",
  INFP: "理想を手放さない人",
  ENFJ: "人の可能性を引き出す人",
  ENFP: "熱量で周りを巻き込む人",
  ISTJ: "地道にやり遂げる人",
  ISFJ: "陰で誰かを支える人",
  ESTJ: "仕組みで場を動かす人",
  ESFJ: "場の空気を整える人",
  ISTP: "黙々と極める人",
  ISFP: "感性のままに動く人",
  ESTP: "考える前に動く人",
  ESFP: "その場を明るくする人",
};

// 建て前グループ名（現在のグループ×名前フォーマットから抽出用）
const MBTI_GROUPS = ["直感×論理", "直感×感情", "感覚×秩序", "感覚×適応"];

// 本音グループ名
const LOVE_GROUPS = ["積極×オープン", "積極×内向", "受動×オープン", "受動×内向"];

// MBTIアーキタイプ名（タイトル内の（）除去用）
const MBTI_ARCHETYPES = [
  "建築家", "論理学者", "指揮官", "討論者",
  "提唱者", "仲介者", "主人公", "広報運動家", "運動家",
  "管理者", "擁護者", "幹部", "領事",
  "巨匠", "冒険家", "起業家", "エンターテイナー",
];

function reformatTitle(title) {
  // パターン1: 建て前グループ【タイプ名】の○○
  // 例: "感覚×適応【その場を明るくする人】の特徴..."
  for (const group of MBTI_GROUPS) {
    const re = new RegExp(`^${group.replace("×", "×")}【([^】]+)】の(.+)$`);
    const m = title.match(re);
    if (m) {
      return `＜建前＞${m[1]}の${m[2]}`;
    }
  }

  // パターン2: 本音グループ【欲求フレーズ】の○○
  // 例: "積極×オープン【自分のやり方を貫きたい】の..."
  for (const group of LOVE_GROUPS) {
    const re = new RegExp(`^${group}【([^】]+)】の(.+)$`);
    const m = title.match(re);
    if (m) {
      return `＜本音＞${m[1]}の${m[2]}`;
    }
  }

  // パターン3: MBTI（アーキタイプ）の○○ または MBTIの○○
  for (const [mbti, name] of Object.entries(MBTI_MAP)) {
    // "ESFP（エンターテイナー）の" パターン
    for (const arch of MBTI_ARCHETYPES) {
      const prefix = `${mbti}（${arch}）の`;
      if (title.startsWith(prefix)) {
        return `＜建前＞${name}の${title.slice(prefix.length)}`;
      }
    }
    // "ESFPの" パターン
    const prefix = `${mbti}の`;
    if (title.startsWith(prefix)) {
      return `＜建前＞${name}の${title.slice(prefix.length)}`;
    }
  }

  return null; // 変換不要
}

async function processPage(page) {
  const titleProp = page.properties["Title"] ?? page.properties["Name"];
  if (!titleProp || titleProp.type !== "title") return { changed: false };

  const title = titleProp.title.map((t) => t.plain_text).join("");
  const newTitle = reformatTitle(title);

  if (!newTitle || newTitle === title) return { title, changed: false };

  console.log(`\n📄 "${title}"`);
  console.log(`   → "${newTitle}"`);

  if (!isDryRun) {
    await notion.pages.update({
      page_id: page.id,
      properties: {
        Title: { title: [{ type: "text", text: { content: newTitle } }] },
      },
    });
    console.log(`   ✅`);
  }

  return { title, changed: true };
}

async function main() {
  console.log(isDryRun ? "🔍 DRY RUN" : "✏️  EXECUTE");
  const res = await notion.databases.query({ database_id: DB_ID, page_size: 100 });
  const pages = res.results.filter((p) => p.object === "page");
  console.log(`合計 ${pages.length} 件\n`);

  let changed = 0;
  for (const page of pages) {
    const r = await processPage(page);
    if (r.changed) changed++;
  }

  console.log(`\n${isDryRun ? "変更が必要:" : "変更済み:"} ${changed} / ${pages.length} 件`);
  if (isDryRun && changed > 0) {
    console.log("実行: node scripts/reformat-titles.mjs --execute");
  }
}

main().catch(console.error);
