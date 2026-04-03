/**
 * ブログ記事リメイクスクリプト
 * MBTI → 建て前の16タイプ
 * ラブタイプ → 本音の16タイプ
 * に書き換える
 *
 * Usage:
 *   --dry-run  : スキャンのみ（実際の変更なし）
 *   --execute  : 実際に変更する
 */

import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DB_ID = process.env.NOTION_BLOG_DB_ID;

const isDryRun = process.argv.includes("--dry-run") || !process.argv.includes("--execute");

// 置換ルール（順序重要: 長い文字列から先に）
const REPLACEMENTS = [
  // MBTI + タイプ系（二重タイプにならないよう先に処理）
  { from: "MBTIタイプ別", to: "16タイプ別" },
  { from: "MBTIタイプ", to: "建て前の16タイプ" },
  { from: "MBTIをはじめとした", to: "revelaの" },
  { from: "MBTIと", to: "建て前の16タイプと" },
  { from: "MBTIや", to: "建て前の16タイプや" },
  { from: "MBTIで", to: "建て前の16タイプで" },
  { from: "MBTIを", to: "建て前の16タイプを" },
  { from: "MBTIに", to: "建て前の16タイプに" },
  { from: "MBTIの", to: "建て前の16タイプの" },
  { from: "MBTI診断", to: "建て前診断" },
  { from: "MBTI活用", to: "建て前の16タイプ活用" },
  { from: "MBTI解説", to: "建て前の16タイプ解説" },
  { from: "MBTI4軸", to: "建て前の16タイプの4軸" },
  { from: "MBTIコード", to: "revelaコード" },
  { from: "MBTI", to: "建て前の16タイプ" },
  // ラブタイプ系
  { from: "ラブタイプ診断", to: "本音診断" },
  { from: "ラブタイプで", to: "本音の16タイプで" },
  { from: "ラブタイプを", to: "本音の16タイプを" },
  { from: "ラブタイプに", to: "本音の16タイプに" },
  { from: "ラブタイプの", to: "本音の16タイプの" },
  { from: "ラブタイプや", to: "本音の16タイプや" },
  { from: "ラブタイプと", to: "本音の16タイプと" },
  { from: "ラブタイプコード", to: "本音コード" },
  { from: "ラブタイプ", to: "本音の16タイプ" },
];

function applyReplacements(text) {
  let result = text;
  for (const { from, to } of REPLACEMENTS) {
    result = result.split(from).join(to);
  }
  return result;
}

function needsReplacement(text) {
  return REPLACEMENTS.some(({ from }) => text.includes(from));
}

// RichTextItemの配列を変換
function transformRichText(richText) {
  return richText.map((item) => {
    if (item.type === "text" && needsReplacement(item.plain_text)) {
      return {
        ...item,
        text: {
          ...item.text,
          content: applyReplacements(item.text.content),
        },
      };
    }
    return item;
  });
}

// ブロックのRichTextを取得
function getRichTextFromBlock(block) {
  const type = block.type;
  const content = block[type];
  if (!content || !Array.isArray(content.rich_text)) return null;
  return content.rich_text;
}

// ブロックのRichTextを更新したオブジェクトを作る
function buildUpdatePayload(block) {
  const type = block.type;
  const richText = getRichTextFromBlock(block);
  if (!richText) return null;

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
    ? titleProp.title.map((t) => t.plain_text).join("")
    : "(no title)";

  const descProp = page.properties["description"];
  const description = descProp?.type === "rich_text"
    ? descProp.rich_text.map((t) => t.plain_text).join("")
    : "";

  const tagsProp = page.properties["tags"];
  const tags = tagsProp?.type === "multi_select"
    ? tagsProp.multi_select.map((t) => t.name)
    : [];

  // タイトル・descriptionのチェック
  const titleNeedsChange = needsReplacement(title);
  const descNeedsChange = needsReplacement(description);
  const tagsNeedChange = tags.some(needsReplacement);

  // ブロック取得
  const blocksRes = await notion.blocks.children.list({ block_id: page.id, page_size: 100 });
  const blocks = blocksRes.results.filter((b) => b.object === "block");

  const blockUpdates = [];
  for (const block of blocks) {
    const update = buildUpdatePayload(block);
    if (update) blockUpdates.push(update);
  }

  const hasChanges = titleNeedsChange || descNeedsChange || tagsNeedChange || blockUpdates.length > 0;
  if (!hasChanges) return { title, changed: false };

  console.log(`\n📄 ${title}`);
  console.log(`   ID: ${page.id}`);

  if (titleNeedsChange) {
    const newTitle = applyReplacements(title);
    console.log(`   タイトル: "${title}" → "${newTitle}"`);
  }
  if (descNeedsChange) {
    const newDesc = applyReplacements(description);
    console.log(`   説明: "${description}" → "${newDesc}"`);
  }
  if (tagsNeedChange) {
    const newTags = tags.map(applyReplacements);
    console.log(`   タグ: [${tags.join(", ")}] → [${newTags.join(", ")}]`);
  }
  for (const upd of blockUpdates) {
    console.log(`   ブロック: "${upd.before}" → "${upd.after}"`);
  }

  if (!isDryRun) {
    // タイトル・description・tagsを更新
    const propsUpdate = {};
    if (titleNeedsChange) {
      propsUpdate["Title"] = {
        title: [{ type: "text", text: { content: applyReplacements(title) } }],
      };
    }
    if (descNeedsChange) {
      propsUpdate["description"] = {
        rich_text: [{ type: "text", text: { content: applyReplacements(description) } }],
      };
    }
    if (tagsNeedChange) {
      propsUpdate["tags"] = {
        multi_select: tags.map((t) => ({ name: applyReplacements(t) })),
      };
    }
    if (Object.keys(propsUpdate).length > 0) {
      await notion.pages.update({ page_id: page.id, properties: propsUpdate });
    }

    // ブロックを更新
    for (const upd of blockUpdates) {
      await notion.blocks.update({ block_id: upd.blockId, ...upd.payload });
    }
    console.log(`   ✅ 更新完了`);
  }

  return { title, changed: true };
}

async function main() {
  console.log(isDryRun ? "🔍 DRY RUN モード（変更なし）" : "✏️  EXECUTE モード（実際に変更します）");
  console.log("Notionから全記事を取得中...\n");

  const res = await notion.databases.query({
    database_id: DB_ID,
    page_size: 100,
  });

  const pages = res.results.filter((p) => p.object === "page");
  console.log(`合計 ${pages.length} 件の記事を確認します\n`);

  let changedCount = 0;
  for (const page of pages) {
    const result = await processPage(page);
    if (result.changed) changedCount++;
  }

  console.log(`\n${isDryRun ? "📋 変更が必要な" : "✅ 変更した"}記事: ${changedCount} / ${pages.length} 件`);
  if (isDryRun && changedCount > 0) {
    console.log("\n実際に変更するには: node scripts/rewrite-mbti-articles.mjs --execute");
  }
}

main().catch(console.error);
