import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

async function getAdminClient() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { supabase: null, user: null, admin: false };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, admin: false };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return { supabase, user, admin: profile?.role === "admin" };
}

export async function GET() {
  const { supabase, admin } = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const { data, error } = await supabase.from("content_items").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const { supabase, user, admin } = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  if (!user || !admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const body = await request.json() as Record<string, unknown>;
  const { data, error } = await supabase.from("content_items").insert({ ...body, created_by: user.id }).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ item: data }, { status: 201 });
}
