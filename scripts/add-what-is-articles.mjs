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

// ── MBTIとは ─────────────────────────────────────────────
const mbtiBlocks = [
  h2("MBTIとは？"),
  p("MBTI（Myers-Briggs Type Indicator）は、スイスの心理学者カール・ユングの理論をもとに、イザベル・マイヤーズとキャサリン・ブリッグスが開発した性格分類ツールです。世界で最も広く使われている性格診断の一つで、企業の採用・チームビルディングから個人の自己理解まで、幅広い場面で活用されています。"),
  p("4つの軸の組み合わせによって、人の性格を16タイプに分類します。"),

  h2("4つの軸"),
  h3("E（外向）/ I（内向）：エネルギーの方向"),
  p("外の世界（人・活動・会話）からエネルギーを得るのがE（外向）。自分の内側（思考・感情・内省）からエネルギーを得るのがI（内向）。どちらが良い・悪いではなく、エネルギーの補充方法の違いです。"),
  h3("N（直感）/ S（感覚）：情報の受け取り方"),
  p("可能性・パターン・将来的な意味に注目するのがN（直感）。現実・具体的な事実・今ここにある情報を重視するのがS（感覚）。"),
  h3("T（思考）/ F（感情）：意思決定の基準"),
  p("論理・客観的な分析・原則を優先するのがT（思考）。人への影響・価値観・感情的な調和を優先するのがF（感情）。"),
  h3("J（判断）/ P（知覚）：外界への対応スタイル"),
  p("計画的・組織的・決断を好むのがJ（判断）。柔軟・アドリブ的・選択肢を開いておくのを好むのがP（知覚）。"),

  h2("16タイプの4グループ"),
  bullet("分析家（NT）：INTJ・INTP・ENTJ・ENTP ― 論理と革新を重視"),
  bullet("外交官（NF）：INFJ・INFP・ENFJ・ENFP ― 理想と人間関係を重視"),
  bullet("番人（SJ）：ISTJ・ISFJ・ESTJ・ESFJ ― 秩序と安定を重視"),
  bullet("探検家（SP）：ISTP・ISFP・ESTP・ESFP ― 自由と行動を重視"),

  h2("MBTIを使うときの注意点"),
  p("MBTIはあくまで「傾向」を示すツールです。タイプで人を決めつけたり、「このタイプだから〇〇」と固定的に見るのは本来の使い方ではありません。自己理解のヒントとして、柔軟に活用することが大切です。"),
  p("また、人はストレス状態や成長によってタイプの表れ方が変わります。定期的に診断を受け直すことも有効です。"),

  h2("revelaでMBTIを活用する"),
  p("revelaでは、MBTIタイプに加えて「ラブタイプコード」「職業RPGクラス」「星座」「タロット」を組み合わせた独自の分析が受けられます。単なる性格診断を超えて、チームでの役割・恋愛傾向・キャリア適性まで多角的に自分を知ることができます。"),
  p("まずは無料の総合診断を試してみてください。"),

  h2("まとめ"),
  p("MBTIは「自分を知るための地図」です。4つの軸と16タイプを理解することで、なぜ自分がそう感じるのか・なぜあの人とうまくいかないのか、多くの謎が解けていきます。"),
];

// ── ラブタイプとは ────────────────────────────────────────
const loveBlocks = [
  h2("ラブタイプとは？"),
  p("ラブタイプとは、恋愛における自分のスタイル・傾向・価値観を4文字のコードで表したrevelaオリジナルの分類システムです。MBTIがあなたの「全体的な性格」を表すのに対し、ラブタイプは「恋愛・人間関係における自分の本質」に特化しています。"),
  p("例えば「FCRO」「LARE」のような4文字のコードで表され、それぞれの文字が恋愛の異なる側面を示します。"),

  h2("4文字の意味"),
  h3("1文字目：L（論理型）/ F（感情型）"),
  p("恋愛における意思決定の基準です。L（Logical）は理性・現実・安定性を優先。F（Feeling）は感情・直感・気持ちのつながりを優先します。"),
  h3("2文字目：C（協調型）/ A（主張型）"),
  p("関係の中でのスタンスです。C（Cooperative）は相手に合わせ調和を重視。A（Assertive）は自分の意見や欲求をはっきり伝えます。"),
  h3("3文字目：R（ロマンス重視）/ P（実用重視）"),
  p("恋愛に何を求めるかです。R（Romantic）は感情的なつながり・特別感・ドラマを重視。P（Practical）は現実的なサポート・安定・共同生活の質を重視します。"),
  h3("4文字目：O（オープン）/ E（クローズド）"),
  p("関係の広さへの志向です。O（Open）は友人・家族も含めた広いつながりを大切にします。E（Exclusive）は二人だけの深い関係を重視します。"),

  h2("ラブタイプとMBTIの関係"),
  p("ラブタイプはMBTIタイプと密接に関連していますが、完全に一致するわけではありません。同じMBTIタイプでも、育ちや経験によってラブタイプが異なることがあります。"),
  p("revelaでは、MBTIとラブタイプの組み合わせから「職業RPGクラス」が決まる仕組みになっています。同じINTJでも、ラブタイプによって「賢者」になるか「錬金術師」になるかが変わります。"),

  h2("ラブタイプを知る意味"),
  bullet("自分が恋愛で何を求めているかが明確になる"),
  bullet("相手との「すれ違いの原因」が言語化できる"),
  bullet("MBTIだけではわからない恋愛の細かな傾向がわかる"),
  bullet("revelaのパーティー機能でチームの相性を見るときの指標になる"),

  h2("ラブタイプコードの確認方法"),
  p("revelaの総合診断を受けると、MBTIタイプと合わせてラブタイプコードが表示されます。診断後のマイページでいつでも確認できます。"),
  p("自分のラブタイプを知ったら、ぜひ下のラブタイプ別解説記事で自分のコードの詳細を読んでみてください。"),

  h2("まとめ"),
  p("ラブタイプは「恋愛における自分の取扱説明書」です。4文字のコードを知ることで、自分の恋愛パターンが客観的に見えてきます。パートナーとのすれ違いを減らし、より深い関係を築くヒントが見つかるはずです。"),
];

async function createArticle(title, slug, description, tags, category, order, blocks) {
  const page = await notion.pages.create({
    parent: { database_id: DB_ID },
    properties: {
      Title: { title: [{ type: "text", text: { content: title } }] },
      slug: { rich_text: [{ type: "text", text: { content: slug } }] },
      description: { rich_text: [{ type: "text", text: { content: description } }] },
      date: { date: { start: "2026-03-29" } },
      tags: { multi_select: tags.map(n => ({ name: n })) },
      category: { multi_select: [{ name: category }] },
      order: { number: order },
    },
    children: blocks,
  });
  console.log(`✓ Created: ${title} (order: ${order})`);
  return page.id;
}

async function main() {
  await createArticle(
    "MBTIとは？16タイプ診断の仕組みと活用法を完全解説",
    "what-is-mbti",
    "MBTI（Myers-Briggs Type Indicator）の基礎を完全解説。4つの軸・16タイプの意味・正しい活用法まで、MBTIを初めて知る人にもわかりやすく紹介します。",
    ["MBTI基礎", "16タイプ", "自己分析"],
    "MBTI",
    1,
    mbtiBlocks,
  );

  await createArticle(
    "ラブタイプとは？revelaオリジナルの恋愛タイプコード完全解説",
    "what-is-lovetype",
    "revelaのラブタイプコード（4文字）の仕組みを徹底解説。L/F・C/A・R/P・O/Eそれぞれの意味と、MBTIとの関係、恋愛への活用法を紹介します。",
    ["ラブタイプ", "恋愛", "MBTI相性", "自己分析"],
    "ラブタイプ",
    1,
    loveBlocks,
  );
}

main();
