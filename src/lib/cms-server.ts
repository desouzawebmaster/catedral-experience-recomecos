import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import type { CmsSection } from "./cms";

const adminEmail = "desouza.webmaster@gmail.com";

const dataFiles: Record<CmsSection, string> = {
  musicos: "musicos.json",
  convidados: "convidados.json",
  galeria: "galeria.json",
  patrocinadores: "patrocinadores.json"
};

export const uploadFolders: Record<CmsSection, string> = {
  musicos: "musicos",
  convidados: "convidados",
  galeria: "galeria",
  patrocinadores: "patrocinadores"
};

export function isCmsSection(value: string): value is CmsSection {
  return value === "musicos" || value === "convidados" || value === "galeria" || value === "patrocinadores";
}

export function getDataPath(section: CmsSection) {
  return path.join(process.cwd(), "src", "data", dataFiles[section]);
}

export function getUploadPath(section: CmsSection, filename: string) {
  return path.join(process.cwd(), "public", "uploads", uploadFolders[section], filename);
}

export async function ensureAdmin(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!url || !key || !token) return false;

  const supabase = createClient(url, key);
  const { data, error } = await supabase.auth.getUser(token);
  return !error && data.user?.email === adminEmail;
}

export function safeFileName(name: string) {
  const ext = path.extname(name).toLowerCase();
  const base = path
    .basename(name, ext)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60);

  return `${Date.now()}-${base || "upload"}${ext}`;
}
