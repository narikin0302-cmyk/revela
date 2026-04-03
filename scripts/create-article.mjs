import https from 'https';

const NOTION_TOKEN = 'process.env.NOTION_API_KEY';
const DB_ID = '331f9aba91e3804aa3dcddbd34b79c65';

function p(text) {
  return { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: text } }] } };
}
function h2(text) {
  return { object: 'block', type: 'heading_2', heading_2: { rich_text: [{ text: { content: text } }] } };
}
function li(text) {
  return { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ text: { content: text } }] } };
}
function link(text, url) {
  return { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: text, link: { url } } }] } };
}

const body = JSON.stringify({
  parent: { database_id: DB_ID },
  properties: {
    Title: { title: [{ text: { content: '本質を追いかける人の特徴と強み【建前タイプ診断】' } }] },
    slug: { rich_text: [{ text: { content: 'tatemae-honshitsu-wo-oikakeru' } }] },
    description: { rich_text: [{ text: { content: 'revelaの建前タイプ「本質を追いかける人」の特徴・強み・向いている仕事・弱点を解説。直感×論理グループの深い探求者。' } }] },
    date: { date: { start: '2026-04-02' } },
    tags: { multi_select: [{ name: '建前タイプ' }, { name: '自己分析' }, { name: 'revela' }] },
    category: { multi_select: [{ name: '自己分析' }] },
    order: { number: 71 },
    published: { checkbox: true }
  },
  children: [
    p('表面ではなく、その奥にある仕組みや原理を知りたい。'),
    p('revelaの建前タイプ「本質を追いかける人」は、深い論理と探究心で真実に迫る知識探求者タイプです。'),
    h2('基本プロフィール'),
    li('グループ：直感×論理'),
    li('キャッチコピー：答えのない問いに魅せられる'),
    li('得意な場面：深い分析・理論構築、複雑な概念の整理、自分のペースでの深い思考'),
    h2('このタイプの特徴'),
    p('「本質を追いかける人」は、「なぜそうなるのか」という問いを止められません。表面的な答えに満足できず、より深い原理や仕組みを求めて思考を続けます。'),
    p('会話でも「それって本当に？」と深掘りしたくなる。他者から見ると難しいことを考えているように見えますが、本人は純粋に面白いから考えているだけ。感情より論理を信頼し、自分の思考世界を大切にします。'),
    h2('強み'),
    li('分析力：物事の構造・原理を解明する深い思考力'),
    li('理論構築：バラバラな情報を統合し、一貫した理論を組み立てられる'),
    li('客観性：感情に流されず、論理的に物事を評価できる'),
    li('独創性：既存の枠を外れた独自の理論・モデルを生み出せる'),
    h2('弱点・注意点'),
    li('考えすぎて行動が遅れることがある'),
    li('完璧な理解を求めるあまり、決断を先延ばしにしやすい'),
    li('感情的なコミュニケーションが苦手で、人間関係で誤解されることも'),
    h2('向いている仕事・役割'),
    li('研究者・学者'),
    li('データアナリスト・サイエンティスト'),
    li('エンジニア・アーキテクト'),
    li('哲学者・思想家'),
    li('システム設計・問題解決の専門職'),
    h2('本音タイプとの掛け合わせ'),
    p('建前タイプが「本質を追いかける人」でも、本音タイプによってRPGクラスは変わります。'),
    p('本音が「静かに真理を極めたい」なら、孤高の知識人として一点突破する深淵の探求者。「ありのままの自分でいたい」なら、自分の知的世界を誠実に生きる自由な思索者。探求の動き方は同じでも、何のために深めるかが違います。'),
    h2('あなたの建前タイプを確認しよう'),
    p('自分が「本質を追いかける人」かどうかは、revelaの自己分析診断で確認できます。'),
    link('▶ revela 自己分析を受ける', 'https://revela.jp/shindan')
  ]
});

const options = {
  hostname: 'api.notion.com',
  path: '/v1/pages',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const r = JSON.parse(data);
    if (r.id) console.log('作成成功:', r.id);
    else console.log('エラー:', JSON.stringify(r).slice(0, 500));
  });
});
req.on('error', e => console.error(e));
req.write(body);
req.end();
