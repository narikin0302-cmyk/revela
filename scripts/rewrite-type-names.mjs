/**
 * 建前タイプ名のリネームスクリプト
 * - ESFP（エンターテイナー）→ 感覚×適応【その場を明るくする人】
 * - MBTIアーキタイプ名（エンターテイナー等）も削除
 * - ラブタイプキャラクター名を削除
 *
 * Usage:
 *   --dry-run  : スキャンのみ
 *   --execute  : 実際に変更
 */

import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DB_ID = process.env.NOTION_BLOG_DB_ID;
const isDryRun = !process.argv.includes("--execute");

// ── 建前タイプ マッピング ──────────────────────────────────────
const MBTI_MAP = {
  INTJ: { group: "直感×論理", name: "遠くを見据えて動く人" },
  INTP: { group: "直感×論理", name: "本質を追いかける人" },
  ENTJ: { group: "直感×論理", name: "場を仕切って動かす人" },
  ENTP: { group: "直感×論理", name: "常識を疑い続ける人" },
  INFJ: { group: "直感×感情", name: "人の未来を見通す人" },
  INFP: { group: "直感×感情", name: "理想を手放さない人" },
  ENFJ: { group: "直感×感情", name: "人の可能性を引き出す人" },
  ENFP: { group: "直感×感情", name: "熱量で周りを巻き込む人" },
  ISTJ: { group: "感覚×秩序", name: "地道にやり遂げる人" },
  ISFJ: { group: "感覚×秩序", name: "陰で誰かを支える人" },
  ESTJ: { group: "感覚×秩序", name: "仕組みで場を動かす人" },
  ESFJ: { group: "感覚×秩序", name: "場の空気を整える人" },
  ISTP: { group: "感覚×適応", name: "黙々と極める人" },
  ISFP: { group: "感覚×適応", name: "感性のままに動く人" },
  ESTP: { group: "感覚×適応", name: "考える前に動く人" },
  ESFP: { group: "感覚×適応", name: "その場を明るくする人" },
};

// MBTIの標準アーキタイプ名（削除対象）
const MBTI_ARCHETYPES = [
  "建築家", "論理学者", "指揮官", "討論者",
  "提唱者", "仲介者", "主人公", "広報運動家", "運動家",
  "管理者", "擁護者", "幹部", "領事",
  "巨匠", "冒険家", "起業家", "エンターテイナー",
];

// ラブタイプキャラクター名（削除 or 要置換）
// ※ ラブタイプは概念ごと使わないため、キャラ名が出てきたら削除
const LOVE_TYPE_CHARS = [
  "忠犬ハチ公", "忠犬", "ツンデレ", "小悪魔系", "天然系",
  "ラブタイプキャラ", "ラブキャラ",
];

function revelName(mbti) {
  const m = MBTI_MAP[mbti];
  if (!m) return null;
  return `${m.group}【${m.name}】`;
}

function applyReplacements(text) {
  let result = text;

  // 1. "XXXX（アーキタイプ名）" のパターン
  for (const [mbti, info] of Object.entries(MBTI_MAP)) {
    const revela = `${info.group}【${info.name}】`;
    for (const arch of MBTI_ARCHETYPES) {
      result = result.split(`${mbti}（${arch}）`).join(revela);
      result = result.split(`${mbti}(${arch})`).join(revela);
    }
  }

  // 2. タイトルパターン: "XXXXの〇〇" → "グループ【名前】の〇〇"
  //    但しタグとして単独で "XXXX" だけの場合も変換
  for (const [mbti, info] of Object.entries(MBTI_MAP)) {
    const revela = `${info.group}【${info.name}】`;
    result = result.split(mbti).join(revela);
  }

  // 3. ラブタイプキャラ名を削除（含む文を自然に処理）
  for (const char of LOVE_TYPE_CHARS) {
    result = result.split(char).join("");
  }

  return result;
}

function needsReplacement(text) {
  for (const mbti of Object.keys(MBTI_MAP)) {
    if (text.includes(mbti)) return true;
  }
  for (const char of LOVE_TYPE_CHARS) {
    if (text.includes(char)) return true;
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
    console.log("実行: node scripts/rewrite-type-names.mjs --execute");
  }
}

main().catch(console.error);
