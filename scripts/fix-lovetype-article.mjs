import { Client } from "@notionhq/client";

const notion = new Client({ auth: "process.env.NOTION_API_KEY" });
const DB_ID = "331f9aba91e3804aa3dcddbd34b79c65";

async function main() {
  // slug で記事を探す
  const res = await notion.databases.query({
    database_id: DB_ID,
    filter: { property: "slug", rich_text: { equals: "what-is-lovetype" } },
  });

  const page = res.results[0];
  if (!page) { console.error("記事が見つかりません"); return; }

  // 既存ブロックを取得して最初のparagraphを探す
  const blocks = await notion.blocks.children.list({ block_id: page.id });

  for (const block of blocks.results) {
    if (block.type === "paragraph") {
      const text = block.paragraph.rich_text.map(t => t.plain_text).join("");
      if (text.includes("revelaオリジナルの分類システムです")) {
        // 修正
        await notion.blocks.update({
          block_id: block.id,
          paragraph: {
            rich_text: [{
              type: "text",
              text: {
                content: "ラブタイプとは、恋愛における自分のスタイル・傾向・価値観を4文字のコードで表した分類システムです。Love Character 64（lovecharacter64.jp）のシステムをもとに、revelaのMBTI・職業RPGと連携できるよう設計されています。",
              },
            }],
          },
        });
        console.log("✓ 修正完了");
        return;
      }
    }
  }

  console.log("対象のブロックが見つかりませんでした");
}

main();
