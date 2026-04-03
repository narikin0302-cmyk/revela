/**
 * Notion記事にcategoryを一括セット
 */

import { Client } from "@notionhq/client";

const notion = new Client({ auth: "process.env.NOTION_API_KEY" });
const DB_ID = "331f9aba91e3804aa3dcddbd34b79c65";

function getCategory(slug, tags) {
  if (slug.endsWith("-guide")) return "MBTI";
  if (slug.endsWith("-love")) return "ラブタイプ";
  if (slug.startsWith("rpg-role")) return "職業RPG";
  // 既存記事・一覧系はイントロ
  return "イントロ";
}

async function main() {
  console.log("Fetching all articles...");

  let allPages = [];
  let cursor = undefined;

  while (true) {
    const res = await notion.databases.query({
      database_id: DB_ID,
      start_cursor: cursor,
      page_size: 100,
    });
    allPages = allPages.concat(res.results);
    if (!res.has_more) break;
    cursor = res.next_cursor;
  }

  console.log(`Found ${allPages.length} articles. Setting categories...\n`);

  for (const page of allPages) {
    const props = page.properties;

    const slugProp = props["slug"];
    const slug = slugProp?.type === "rich_text"
      ? slugProp.rich_text.map(t => t.plain_text).join("")
      : "";

    const tagsProp = props["tags"];
    const tags = tagsProp?.type === "multi_select"
      ? tagsProp.multi_select.map(t => t.name)
      : [];

    const titleProp = props["Title"] ?? props["Name"];
    const title = titleProp?.type === "title"
      ? titleProp.title.map(t => t.plain_text).join("")
      : "";

    const category = getCategory(slug, tags);

    try {
      await notion.pages.update({
        page_id: page.id,
        properties: {
          category: { multi_select: [{ name: category }] },
        },
      });
      console.log(`✓ [${category}] ${title}`);
    } catch (err) {
      console.error(`✗ ${title}: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log("\n=== Done ===");
}

main();
