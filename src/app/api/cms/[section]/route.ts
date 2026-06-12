import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { ensureAdmin, getDataPath, isCmsSection } from "@/lib/cms-server";
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

export async function GET(_request: Request, { params }: { params: { section: string } }) {
  if (!isCmsSection(params.section)) {
    return NextResponse.json({ error: "Seção inválida." }, { status: 404 });
  }

  try {
    const content = await fs.readFile(getDataPath(params.section), "utf8");
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json(fallbackData[params.section]);
  }
}

export async function PUT(request: Request, { params }: { params: { section: string } }) {
  if (!isCmsSection(params.section)) {
    return NextResponse.json({ error: "Seção inválida." }, { status: 404 });
  }

  if (!(await ensureAdmin(request))) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 401 });
  }

  const items = await request.json();

  try {
    await fs.writeFile(getDataPath(params.section), `${JSON.stringify(items, null, 2)}\n`, "utf8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "Não foi possível salvar no disco. Em produção na Vercel, arquivos enviados e JSON locais não são persistentes; use esta estrutura localmente ou migre para Supabase Storage."
      },
      { status: 500 }
    );
  }
}
