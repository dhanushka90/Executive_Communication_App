import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ configured: false, user: null });
  const { data: { user } } = await supabase.auth.getUser();
  return NextResponse.json({ configured: true, user: user ? { id: user.id, email: user.email } : null });
}
