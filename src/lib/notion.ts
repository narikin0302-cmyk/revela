import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DB_ID = process.env.NOTION_BLOG_DB_ID!;

function richTextToString(richText: RichTextItemResponse[]): string {
  return richText.map((t) => t.plain_text).join("");
}

export interface NotionArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  order: number;
}

export async function getPublishedArticles(): Promise<NotionArticle[]> {
  const res = await notion.databases.query({
    database_id: DB_ID,
    sorts: [{ property: "order", direction: "ascending" }],
  });

  return res.results
    .filter((p): p is PageObjectResponse => p.object === "page")
    .map((page) => {
      const props = page.properties;

      const titleProp = props["Title"] ?? props["Name"];
      const title =
        titleProp?.type === "title" ? richTextToString(titleProp.title) : "";

      const slugProp = props["slug"];
      const slug =
        slugProp?.type === "rich_text" ? richTextToString(slugProp.rich_text) : page.id;

      const descProp = props["description"];
      const description =
        descProp?.type === "rich_text" ? richTextToString(descProp.rich_text) : "";

      const dateProp = props["date"];
      const date =
        dateProp?.type === "date" ? (dateProp.date?.start ?? "") : "";

      const tagsProp = props["tags"];
      const tags =
        tagsProp?.type === "multi_select"
          ? tagsProp.multi_select.map((t) => t.name)
          : [];

      const orderProp = props["order"];
      const order =
        orderProp?.type === "number" ? (orderProp.number ?? 9999) : 9999;

      return { id: page.id, slug, title, description, date, tags, order };
    })
    .sort((a, b) => a.order - b.order);
}

export async function getArticleBySlug(slug: string): Promise<NotionArticle | null> {
  const all = await getPublishedArticles();
  return all.find((a) => a.slug === slug) ?? null;
}

function blockToHtml(block: BlockObjectResponse): string {
  const type = block.type;

  if (type === "paragraph") {
    const text = richTextToString(block.paragraph.rich_text);
    return text ? `<p>${text}</p>` : "<br/>";
  }
  if (type === "heading_1") {
    return `<h1>${richTextToString(block.heading_1.rich_text)}</h1>`;
  }
  if (type === "heading_2") {
    return `<h2>${richTextToString(block.heading_2.rich_text)}</h2>`;
  }
  if (type === "heading_3") {
    return `<h3>${richTextToString(block.heading_3.rich_text)}</h3>`;
  }
  if (type === "bulleted_list_item") {
    return `<li>${richTextToString(block.bulleted_list_item.rich_text)}</li>`;
  }
  if (type === "numbered_list_item") {
    return `<li>${richTextToString(block.numbered_list_item.rich_text)}</li>`;
  }
  if (type === "quote") {
    return `<blockquote>${richTextToString(block.quote.rich_text)}</blockquote>`;
  }
  if (type === "code") {
    return `<pre><code>${richTextToString(block.code.rich_text)}</code></pre>`;
  }
  if (type === "divider") {
    return "<hr/>";
  }
  return "";
}

export async function getArticleContent(pageId: string): Promise<string> {
  const res = await notion.blocks.children.list({ block_id: pageId });
  const blocks = res.results.filter(
    (b): b is BlockObjectResponse => b.object === "block"
  );

  let html = "";
  let inUl = false;
  let inOl = false;

  for (const block of blocks) {
    if (block.type === "bulleted_list_item") {
      if (!inUl) { html += "<ul>"; inUl = true; }
      html += blockToHtml(block);
    } else if (block.type === "numbered_list_item") {
      if (!inOl) { html += "<ol>"; inOl = true; }
      html += blockToHtml(block);
    } else {
      if (inUl) { html += "</ul>"; inUl = false; }
      if (inOl) { html += "</ol>"; inOl = false; }
      html += blockToHtml(block);
    }
  }
  if (inUl) html += "</ul>";
  if (inOl) html += "</ol>";

  return html;
}
