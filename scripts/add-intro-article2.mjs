import { Client } from "@notionhq/client";

const notion = new Client({ auth: "process.env.NOTION_API_KEY" });
const DB_ID = "331f9aba91e3804aa3dcddbd34b79c65";

function h2(text) {
  return { object: "block", type: "heading_2", heading_2: { rich_text: [{ type: "text", text: { content: text } }] } };
}
function h3(text) {
  return { object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: text } }] } };
}
function p(text) {
  return { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: text } }] } };
}
function bullet(text) {
  return { object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: [{ type: "text", text: { content: text } }] } };
}

const blocks = [
  h2("「上司と合わない」の正体"),
  p("多くの人が「自分の性格が悪いのかも」「もっと我慢しなきゃ」と考えがちですが、実は問題は個人の性格ではなく、チームの「陣形（ロール構成）」にあることがほとんどです。"),
  p("revelaの4ロール分類（LEADER・SUPPORT・BRAIN・TRICKSTER）で見ると、職場の人間関係の摩擦は驚くほど明確に説明できます。"),

  h2("陣形崩壊のパターン3選"),

  h3("パターン①：LEADERだらけの職場"),
  p("全員が前に出たがり、誰も後ろを支えない。意見の衝突が絶えず、決断しても実行が続かない。「なんでこの人たちこんなに自己主張が強いの？」と感じたらこれ。"),
  bullet("典型的な悩み：会議が長い・決まらない・言い合いになる"),
  bullet("欠けているロール：SUPPORT（後衛）・BRAIN（頭脳）"),

  h3("パターン②：BRAINが評価されない職場"),
  p("「分析してもすぐ行動しろと言われる」「じっくり考えたいのに空気が読めないと言われる」。BRAINタイプが多い職場では静かに機能するが、LEADERが多い職場では浮きやすい。"),
  bullet("典型的な悩み：自分のペースで仕事できない・アイデアを無視される"),
  bullet("本質：ロールの違いを「仕事が遅い」と誤解されている"),

  h3("パターン③：TRICKSTERが窮屈な職場"),
  p("「なんでそんな変なことするの？」「もっと普通にやって」。TRICKSTER（自由）タイプは型にはまった環境で最もストレスを感じる。創造性が封じられると、一気にパフォーマンスが落ちる。"),
  bullet("典型的な悩み：ルールが多すぎる・斬新なアイデアを出しても却下される"),
  bullet("本質：このタイプを活かすには「遊びの余白」が必要"),

  h2("解決策：自分のロールを知ること"),
  p("上司や同僚と合わないとき、まず確認すべきは「相手のロール」と「自分のロール」の組み合わせです。"),
  bullet("LEADERとBRAINのズレ → 「なぜそんなに慎重なの？」vs「なぜそんなに急ぐの？」"),
  bullet("LEADERとTRICKSTERのズレ → 「なぜ脱線するの？」vs「なぜ枠に縛られるの？」"),
  bullet("SUPPORTとTRICKSTERのズレ → 「なぜ空気を読まないの？」vs「なぜそんな細かいことを？」"),

  h2("revelaのパーティー機能で陣形を可視化"),
  p("revelaでは仲間を誘ってパーティーを組むと、チームの陣形が可視化されます。「このチームはLEADER過多」「BRAINがいない」といったことが一目でわかり、採用・チーム編成の参考になります。"),
  p("まずは自分のロールを知ることから始めましょう。診断は無料です。"),

  h2("まとめ"),
  p("職場の人間関係の摩擦は、多くの場合「性格の問題」ではなく「ロールのミスマッチ」です。自分と相手のロールを知るだけで、「この人はこういうタイプなんだ」と理解でき、無駄なストレスが大幅に減ります。"),
];

async function main() {
  const page = await notion.pages.create({
    parent: { database_id: DB_ID },
    properties: {
      Title: { title: [{ type: "text", text: { content: "「上司と合わない」それ、性格のせいじゃなくて職場の「陣形」が崩壊してるだけかも？" } }] },
      slug: { rich_text: [{ type: "text", text: { content: "workplace-formation-collapse" } }] },
      description: { rich_text: [{ type: "text", text: { content: "職場の人間関係がうまくいかないのは性格のせいじゃない。revelaの4ロール分類（LEADER・SUPPORT・BRAIN・TRICKSTER）で見ると、チームの「陣形崩壊」が原因だとわかります。" } }] },
      date: { date: { start: "2026-03-29" } },
      tags: { multi_select: ["職業RPG", "チーム分析", "MBTI活用", "人間関係"].map(n => ({ name: n })) },
      category: { multi_select: [{ name: "イントロ" }] },
    },
    children: blocks,
  });
  console.log(`✓ Created: ${page.id}`);
}

main();
