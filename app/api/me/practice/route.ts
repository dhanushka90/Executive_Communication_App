import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const body = await request.json() as { contentId?: string };
  if (!body.contentId) return NextResponse.json({ error: "contentId is required" }, { status: 400 });
  const { data, error } = await supabase.from("practice_events").insert({ user_id: user.id, content_id: body.contentId }).select("id, content_id, practiced_at").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ event: data });
}
