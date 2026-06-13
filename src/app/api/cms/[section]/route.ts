import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ensureAdmin, isCmsSection } from "@/lib/cms-server";
import musicians from "@/data/musicos.json";
import guests from "@/data/convidados.json";
import gallery from "@/data/galeria.json";
import sponsors from "@/data/patrocinadores.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fallbackData = {
  musicos: musicians,
  convidados: guests,
  galeria: gallery,
  patrocinadores: sponsors
};

function supabaseFromRequest(request?: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token = request?.headers.get("authorization");

  if (!url || !key) return null;

  return createClient(url, key, token ? { global: { headers: { Authorization: token } } } : undefined);
}

export async function GET(request: Request, { params }: { params: { section: string } }) {
  if (!isCmsSection(params.section)) {
    return NextResponse.json({ error: "Seção inválida." }, { status: 404 });
  }

  const supabase = supabaseFromRequest(request);
  if (!supabase) return NextResponse.json(fallbackData[params.section]);

  const { data } = await supabase.from("cms_sections").select("items").eq("section", params.section).maybeSingle();
  return NextResponse.json(Array.isArray(data?.items) && data.items.length > 0 ? data.items : fallbackData[params.section]);
}

export async function PUT(request: Request, { params }: { params: { section: string } }) {
  if (!isCmsSection(params.section)) {
    return NextResponse.json({ error: "Seção inválida." }, { status: 404 });
  }

  if (!(await ensureAdmin(request))) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 401 });
  }

  const supabase = supabaseFromRequest(request);
  if (!supabase) {
    return NextResponse.json({ error: "Supabase não configurado." }, { status: 500 });
  }

  const items = await request.json();
  const { error } = await supabase.from("cms_sections").upsert({
    section: params.section,
    items,
    updated_at: new Date().toISOString()
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
