/**
 * 本音タイプ名のリネームスクリプト
 * 旧コード (LCRO等) / 新AELV (ALRF等) → 積極×オープン【自分のやり方を貫きたい】 形式
 *
 * Usage:
 *   --dry-run  : スキャンのみ
 *   --execute  : 実際に変更
 */

import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DB_ID = process.env.NOTION_BLOG_DB_ID;
const isDryRun = !process.argv.includes("--execute");

// ── 本音タイプ マッピング (AELV → {group, 欲求フレーズ}) ──────
// 4文字目 F=オープン、P=内向
const LOVE_MAP = {
  // 積極×オープン (A + F ending)
  ALRF: { group: "積極×オープン", nick: "自分のやり方を貫きたい" },
  ALVF: { group: "積極×オープン", nick: "可能性を自由に広げたい" },
  AERF: { group: "積極×オープン", nick: "誰かの英雄でありたい" },
  AEVF: { group: "積極×オープン", nick: "世界を動かす存在でありたい" },
  // 積極×内向 (A + P ending)
  ALRP: { group: "積極×内向", nick: "確かな手応えを積み上げたい" },
  ALVP: { group: "積極×内向", nick: "大きな構想を形にしたい" },
  AERP: { group: "積極×内向", nick: "大切な人を全力で守りたい" },
  AEVP: { group: "積極×内向", nick: "信じる道を全力で進みたい" },
  // 受動×オープン (S + F ending)
  SLRF: { group: "受動×オープン", nick: "陰から全てを見通したい" },
  SLVF: { group: "受動×オープン", nick: "自分だけの世界を自由に表現したい" },
  SERF: { group: "受動×オープン", nick: "ありのままの自分でいたい" },
  SEVF: { group: "受動×オープン", nick: "自分らしく輝きたい" },
  // 受動×内向 (S + P ending)
  SLRP: { group: "受動×内向", nick: "静かに真理を極めたい" },
  SLVP: { group: "受動×内向", nick: "誰よりも深く物事を理解したい" },
  SERP: { group: "受動×内向", nick: "誰かの心の支えでありたい" },
  SEVP: { group: "受動×内向", nick: "全てを包み込む存在でありたい" },
};

// 旧レガシーコード → AELV
const LEGACY_MAP = {
  LCRO: "ALRF", LCRE: "ALRP", LCPO: "ALVF", LCPE: "ALVP",
  LARO: "AERF", LARE: "AERP", LAPO: "AEVF", LAPE: "AEVP",
  FCRO: "SLRF", FCRE: "SLRP", FCPO: "SLVF", FCPE: "SLVP",
  FARO: "SERF", FARE: "SERP", FAPO: "SEVF", FAPE: "SEVP",
};

// 旧グループ名 → 新グループ名
const OLD_GROUP_MAP = {
  "前衛タイプ": "積極×オープングループ",
  "自由タイプ": "積極×内向グループ",
  "後衛タイプ": "受動×オープングループ",
  "頭脳タイプ": "受動×内向グループ",
};

function revelName(code) {
  const m = LOVE_MAP[code];
  if (!m) return null;
  return `${m.group}【${m.nick}】`;
}

function applyReplacements(text) {
  let result = text;

  // 1. 旧レガシーコード → revela名
  for (const [legacy, aelv] of Object.entries(LEGACY_MAP)) {
    const revela = revelName(aelv);
    if (revela) result = result.split(legacy).join(revela);
  }

  // 2. 新AELVコード → revela名
  for (const [code, info] of Object.entries(LOVE_MAP)) {
    const revela = `${info.group}【${info.nick}】`;
    result = result.split(code).join(revela);
  }

  // 3. 旧グループ名
  for (const [old, newName] of Object.entries(OLD_GROUP_MAP)) {
    result = result.split(old).join(newName);
  }

  return result;
}

function needsReplacement(text) {
  for (const code of Object.keys(LEGACY_MAP)) {
    if (text.includes(code)) return true;
  }
  for (const code of Object.keys(LOVE_MAP)) {
    if (text.includes(code)) return true;
  }
  for (const old of Object.keys(OLD_GROUP_MAP)) {
    if (text.includes(old)) return true;
  }
  return false;
}

function transformRichText(richText) {
  return richText.map((item) => {
    if (item.type === "text" && needsReplacement(item.plain_text)) {
      return {
        ...item,
        text: { ...item.text, content: applyReplacements(item.text.content) },
      };
    }
    return item;
  });
}

function buildUpdatePayload(block) {
  const type = block.type;
  const content = block[type];
  if (!content || !Array.isArray(content.rich_text)) return null;
  const richText = content.rich_text;
  const newRichText = transformRichText(richText);
  const changed = JSON.stringify(richText) !== JSON.stringify(newRichText);
  if (!changed) return null;
  return {
    blockId: block.id,
    type,
    payload: { [type]: { rich_text: newRichText } },
    before: richText.map((r) => r.plain_text).join(""),
    after: newRichText.map((r) => r.text?.content ?? r.plain_text).join(""),
  };
}

async function processPage(page) {
  const titleProp = page.properties["Title"] ?? page.properties["Name"];
  const title = titleProp?.type === "title"
    ? titleProp.title.map((t) => t.plain_text).join("") : "(no title)";
  const descProp = page.properties["description"];
  const description = descProp?.type === "rich_text"
    ? descProp.rich_text.map((t) => t.plain_text).join("") : "";
  const tagsProp = page.properties["tags"];
  const tags = tagsProp?.type === "multi_select"
    ? tagsProp.multi_select.map((t) => t.name) : [];

  const titleNeedsChange = needsReplacement(title);
  const descNeedsChange = needsReplacement(description);
  const tagsNeedChange = tags.some(needsReplacement);

  const blocksRes = await notion.blocks.children.list({ block_id: page.id, page_size: 100 });
  const blocks = blocksRes.results.filter((b) => b.object === "block");
  const blockUpdates = [];
  for (const block of blocks) {
    const upd = buildUpdatePayload(block);
    if (upd) blockUpdates.push(upd);
  }

  const hasChanges = titleNeedsChange || descNeedsChange || tagsNeedChange || blockUpdates.length > 0;
  if (!hasChanges) return { title, changed: false };

  console.log(`\n📄 ${title}`);
  if (titleNeedsChange) console.log(`   タイトル: "${title}" → "${applyReplacements(title)}"`);
  if (descNeedsChange) console.log(`   説明: "${description.slice(0, 60)}..." → "${applyReplacements(description).slice(0, 60)}..."`);
  if (tagsNeedChange) console.log(`   タグ: [${tags.join(", ")}] → [${tags.map(applyReplacements).join(", ")}]`);
  for (const upd of blockUpdates) {
    console.log(`   ブロック: "${upd.before.slice(0, 60)}" → "${upd.after.slice(0, 60)}"`);
  }

  if (!isDryRun) {
    const propsUpdate = {};
    if (titleNeedsChange) {
      propsUpdate["Title"] = { title: [{ type: "text", text: { content: applyReplacements(title) } }] };
    }
    if (descNeedsChange) {
      propsUpdate["description"] = { rich_text: [{ type: "text", text: { content: applyReplacements(description) } }] };
    }
    if (tagsNeedChange) {
      propsUpdate["tags"] = { multi_select: tags.map((t) => ({ name: applyReplacements(t) })) };
    }
    if (Object.keys(propsUpdate).length > 0) {
      await notion.pages.update({ page_id: page.id, properties: propsUpdate });
    }
    for (const upd of blockUpdates) {
      await notion.blocks.update({ block_id: upd.blockId, ...upd.payload });
    }
    console.log(`   ✅ 更新完了`);
  }

  return { title, changed: true };
}

async function main() {
  console.log(isDryRun ? "🔍 DRY RUN モード" : "✏️  EXECUTE モード");
  const res = await notion.databases.query({ database_id: DB_ID, page_size: 100 });
  const pages = res.results.filter((p) => p.object === "page");
  console.log(`合計 ${pages.length} 件\n`);

  let changedCount = 0;
  for (const page of pages) {
    const result = await processPage(page);
    if (result.changed) changedCount++;
  }

  console.log(`\n${isDryRun ? "📋 変更が必要:" : "✅ 変更済み:"} ${changedCount} / ${pages.length} 件`);
  if (isDryRun && changedCount > 0) {
    console.log("実行: node scripts/rewrite-love-names.mjs --execute");
  }
}

main().catch(console.error);
