import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  const body = await request.json() as { email?: string; password?: string; name?: string };
  if (!body.email || !body.password) return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  const { data, error } = await supabase.auth.signUp({ email: body.email, password: body.password, options: { data: { name: body.name ?? "" } } });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ user: data.user ? { id: data.user.id, email: data.user.email } : null, confirmationRequired: !data.session });
}
