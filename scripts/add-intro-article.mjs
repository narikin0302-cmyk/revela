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
  h2("revelaの「4タイプ分類」とは？"),
  p("revelaでは、16種類のMBTIタイプを職場での役割・戦い方によって4つのロールに分類しています。RPGのクラス（職業）になぞらえたこの分類は、チームの中での自分の立ち位置や、仲間との相性を直感的に理解するために設計されました。"),
  p("自分が「前衛」なのか「頭脳」なのかを知るだけで、仕事への向き合い方・チームでの活かし方が大きく変わります。"),

  h2("4つのロール一覧"),

  h3("⚔️ LEADER（前衛）― 覇王・執行官・聖騎士・海賊王"),
  p("チームの先頭に立ち、方向性と推進力をもたらすタイプ。カリスマ性と決断力に優れ、困難な局面でも仲間を鼓舞し続けます。"),
  bullet("対応MBTIタイプ：ENTJ・ESTJ・ENFJ・ESTP"),
  bullet("強み：行動力、決断力、カリスマ性、突破力"),
  bullet("職場での役割：チームリーダー、プロジェクト推進、意思決定"),

  h3("🛡️ SUPPORT（後衛）― 聖職者・ギルドマスター・騎士団長・吟遊詩人"),
  p("チームの内側から安定と調和をもたらすタイプ。献身性・気配り・信頼性に優れ、他のメンバーが最大限に力を発揮できる環境を作ります。"),
  bullet("対応MBTIタイプ：ISFJ・ESFJ・ISTJ・INFP"),
  bullet("強み：気配り、協調性、安定感、長期的な関係構築"),
  bullet("職場での役割：サポート役、調整役、チームの継続力を支える"),

  h3("🔮 BRAIN（頭脳）― 賢者・錬金術師・影の刺客・予言者"),
  p("深い分析と長期戦略でチームを影から動かすタイプ。表には出なくても、意思決定の質とチームの方向性を決定的に左右します。"),
  bullet("対応MBTIタイプ：INTJ・INTP・ISTP・INFJ"),
  bullet("強み：分析力、戦略思考、専門性、長期ビジョン"),
  bullet("職場での役割：参謀、専門家、品質・戦略の番人"),

  h3("🃏 TRICKSTER（自由）― 奇術師・冒険者・森の狩人・星の踊り子"),
  p("予測不能な発想でチームに革新と活力をもたらすタイプ。固定観念を打ち破り、行き詰まったときに全く新しい視点を提供します。"),
  bullet("対応MBTIタイプ：ENTP・ENFP・ISFP・ESFP"),
  bullet("強み：創造性、直感力、柔軟性、場のエネルギー"),
  bullet("職場での役割：アイデアマン、場の活性化、変化の起爆剤"),

  h2("4タイプのシナジー（相性）"),
  p("4つのロールはそれぞれ異なる強みを持ち、組み合わせることで最強のチームが生まれます。"),
  bullet("LEADER × BRAIN：行動力と戦略が合わさった「最強の攻撃力」"),
  bullet("LEADER × SUPPORT：前衛と後衛の黄金バランス「持続可能な強さ」"),
  bullet("BRAIN × TRICKSTER：緻密な計画と自由な発想の「革新コンビ」"),
  bullet("全4ロール揃い：究極のバランス型チーム"),

  h2("自分のロールを知る方法"),
  p("自分がどのロールに属するかは、revelaのMBTI診断を受けることで確認できます。診断後に表示される「職業RPGクラス」がそのままあなたのロールです。"),
  p("さらに、仲間を誘ってパーティーを組むと「チームの陣形」が可視化されます。LEADERばかりのチームなのか、BRAINが揃った知性集団なのか——チームの強みと弱みが一目でわかります。"),

  h2("まとめ"),
  p("revelaの4ロール分類は、あなたの「職場での本質的な役割」を明らかにします。自分がLEADERなのかTRICKSTERなのかを知ることで、仕事の向き合い方・チームへの貢献の仕方が大きく変わるでしょう。"),
  p("まずは診断して、あなたのロールを確認してみてください。"),
];

async function main() {
  const page = await notion.pages.create({
    parent: { database_id: DB_ID },
    properties: {
      Title: { title: [{ type: "text", text: { content: "【前衛・後衛・頭脳・自由】revelaの4タイプ完全ガイド｜あなたの職場での役割は？" } }] },
      slug: { rich_text: [{ type: "text", text: { content: "revela-4roles-guide" } }] },
      description: { rich_text: [{ type: "text", text: { content: "revelaの職業RPG4ロール（LEADER・SUPPORT・BRAIN・TRICKSTER）を完全解説。あなたのMBTIタイプが職場でどんな役割を担うのか、チームシナジーも合わせて紹介します。" } }] },
      date: { date: { start: "2026-03-29" } },
      tags: { multi_select: ["職業RPG", "MBTI活用", "チーム分析", "16タイプ"].map(n => ({ name: n })) },
      category: { multi_select: [{ name: "イントロ" }] },
    },
    children: blocks,
  });

  console.log(`✓ Created: ${page.id}`);
}

main();
