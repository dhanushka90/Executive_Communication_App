import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ configured: false, items: [] });

  const query = new URL(request.url).searchParams.get("q")?.trim();
  let contentQuery = supabase
    .from("content_items")
    .select("id, slug, phrase, meaning, example, region, type, context, tone")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (query) contentQuery = contentQuery.or(`phrase.ilike.%${query}%,meaning.ilike.%${query}%,example.ilike.%${query}%`);
  const { data, error } = await contentQuery;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ configured: true, items: data ?? [] });
}
