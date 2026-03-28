import { NextResponse } from "next/server";
import { getPublishedArticles } from "@/lib/notion";

export async function GET() {
  const articles = await getPublishedArticles();
  return NextResponse.json(articles);
}
