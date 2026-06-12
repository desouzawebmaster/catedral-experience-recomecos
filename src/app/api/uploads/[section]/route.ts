import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { ensureAdmin, getUploadPath, isCmsSection, safeFileName, uploadFolders } from "@/lib/cms-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: { section: string } }) {
  if (!isCmsSection(params.section)) {
    return NextResponse.json({ error: "Secao invalida." }, { status: 404 });
  }

  if (!(await ensureAdmin(request))) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo nao enviado." }, { status: 400 });
  }

  const filename = safeFileName(file.name);
  const destination = getUploadPath(params.section, filename);

  try {
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/${uploadFolders[params.section]}/${filename}` });
  } catch {
    return NextResponse.json(
      {
        error:
          "Nao foi possivel salvar o upload no disco. Na Vercel este armazenamento nao e persistente; mantenha a estrutura para uso local ou migre para Supabase Storage."
      },
      { status: 500 }
    );
  }
}
