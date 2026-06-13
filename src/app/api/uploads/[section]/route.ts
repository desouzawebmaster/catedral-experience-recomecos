import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ensureAdmin, isCmsSection, safeFileName, uploadFolders } from "@/lib/cms-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function supabaseFromRequest(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token = request.headers.get("authorization");

  if (!url || !key) return null;
  return createClient(url, key, token ? { global: { headers: { Authorization: token } } } : undefined);
}

export async function POST(request: Request, { params }: { params: { section: string } }) {
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

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
  }

  const path = `${uploadFolders[params.section]}/${safeFileName(file.name)}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file, {
    cacheControl: "31536000",
    upsert: true
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from("site-media").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
