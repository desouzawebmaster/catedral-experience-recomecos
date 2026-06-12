"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, DragEvent, FormEvent, ReactNode } from "react";
import { Edit3, GripVertical, ImagePlus, LogOut, Plus, Save, ShieldCheck, Trash2 } from "lucide-react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { ordered, type CmsSection, type GalleryMedia, type Guest, type Musician, type Sponsor } from "@/lib/cms";
import musiciansSeed from "@/data/musicos.json";
import guestsSeed from "@/data/convidados.json";
import gallerySeed from "@/data/galeria.json";
import sponsorsSeed from "@/data/patrocinadores.json";

type AuthState = "loading" | "signed-out" | "signed-in";
type Tab = CmsSection;

const adminEmail = "desouza.webmaster@gmail.com";

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "musicos", label: "Musicos" },
  { id: "convidados", label: "Convidados" },
  { id: "galeria", label: "Galeria" },
  { id: "patrocinadores", label: "Patrocinadores" }
];

function newId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

function withPositions<T extends { position: number }>(items: T[]) {
  return items.map((item, index) => ({ ...item, position: index + 1 }));
}

function moveItem<T>(items: T[], from: number, to: number) {
  const copy = [...items];
  const [removed] = copy.splice(from, 1);
  copy.splice(to, 0, removed);
  return copy;
}

function imagePreview(src: string, alt: string) {
  if (!src) return <div className="flex h-24 w-24 items-center justify-center rounded-md bg-paper text-xs font-bold text-ink/50">Sem foto</div>;

  return (
    <div className="relative h-24 w-24 overflow-hidden rounded-md bg-paper">
      <Image src={src} alt={alt || "Preview"} fill className="object-cover object-top" sizes="96px" />
    </div>
  );
}

export function AdminPanel() {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<Tab>("musicos");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const [musicians, setMusicians] = useState<Musician[]>(ordered(musiciansSeed as Musician[]));
  const [guests, setGuests] = useState<Guest[]>(ordered(guestsSeed as Guest[]));
  const [gallery, setGallery] = useState<GalleryMedia[]>(ordered(gallerySeed as GalleryMedia[]));
  const [sponsors, setSponsors] = useState<Sponsor[]>(ordered(sponsorsSeed as Sponsor[]));

  const supabaseReady = isSupabaseConfigured;

  useEffect(() => {
    if (!supabaseReady) {
      setAuthState("signed-out");
      setMessage("Configure as variaveis do Supabase para ativar login no admin.");
      return;
    }

    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data }) => {
      const isAdmin = data.session?.user.email === adminEmail;
      setAuthState(isAdmin ? "signed-in" : "signed-out");
      if (data.session && !isAdmin) setMessage("Este acesso e exclusivo do administrador do site.");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const isAdmin = session?.user.email === adminEmail;
      setAuthState(isAdmin ? "signed-in" : "signed-out");
      if (session && !isAdmin) setMessage("Este acesso e exclusivo do administrador do site.");
    });

    return () => listener.subscription.unsubscribe();
  }, [supabaseReady]);

  useEffect(() => {
    if (authState !== "signed-in") return;

    (async () => {
      await Promise.all([
        loadSection("musicos", setMusicians),
        loadSection("convidados", setGuests),
        loadSection("galeria", setGallery),
        loadSection("patrocinadores", setSponsors)
      ]);
    })();
  }, [authState]);

  const stats = useMemo(() => {
    const master = sponsors.filter((sponsor) => sponsor.active && sponsor.tier === "master").length;
    const parceiros = sponsors.filter((sponsor) => sponsor.active && sponsor.tier === "parceiro").length;
    return { master, parceiros };
  }, [sponsors]);

  async function getToken() {
    const { data } = await getSupabaseClient().auth.getSession();
    return data.session?.access_token;
  }

  async function loadSection<T>(section: CmsSection, setter: (items: T[]) => void) {
    const response = await fetch(`/api/cms/${section}`, { cache: "no-store" });
    if (!response.ok) return;
    setter(ordered((await response.json()) as Array<T & { position: number }>) as T[]);
  }

  async function saveSection(section: CmsSection, items: unknown[]) {
    if (!supabaseReady) return;
    const token = await getToken();

    if (section === "patrocinadores") {
      const current = items as Sponsor[];
      const masterCount = current.filter((sponsor) => sponsor.active && sponsor.tier === "master").length;
      const partnerCount = current.filter((sponsor) => sponsor.active && sponsor.tier === "parceiro").length;
      if (masterCount > 1) {
        setMessage("So pode existir 1 Patrocinador Master ativo.");
        return;
      }
      if (partnerCount > 8) {
        setMessage("So podem existir ate 8 Patrocinadores Parceiros ativos.");
        return;
      }
    }

    const response = await fetch(`/api/cms/${section}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(withPositions(items as Array<{ position: number }>))
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(result.error || "Nao foi possivel salvar.");
      return;
    }

    setMessage("Alteracoes salvas no JSON local do projeto.");
  }

  async function upload(section: CmsSection, file: File) {
    const token = await getToken();
    const body = new FormData();
    body.append("file", file);

    const response = await fetch(`/api/uploads/${section}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(result.error || "Nao foi possivel enviar o arquivo.");
      return "";
    }

    setMessage("Upload enviado. Clique em salvar para gravar o JSON.");
    return result.url as string;
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabaseReady) return;

    const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }

    if (email.trim().toLowerCase() !== adminEmail) {
      await getSupabaseClient().auth.signOut();
      setMessage("Este acesso e exclusivo do administrador do site.");
      return;
    }

    setMessage("Login realizado.");
  }

  async function signOut() {
    if (!supabaseReady) return;
    await getSupabaseClient().auth.signOut();
  }

  function dragHandlers<T extends { position: number }>(items: T[], setter: (items: T[]) => void, index: number) {
    return {
      draggable: true,
      onDragStart: () => setDragIndex(index),
      onDragOver: (event: DragEvent) => event.preventDefault(),
      onDrop: () => {
        if (dragIndex === null || dragIndex === index) return;
        setter(withPositions(moveItem(items, dragIndex, index)));
        setDragIndex(null);
      }
    };
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-8 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-ember">
              <ShieldCheck size={18} />
              Administracao
            </p>
            <h1 className="text-3xl font-black sm:text-5xl">CMS local do site</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {authState === "signed-in" ? (
              <button onClick={signOut} type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-ink/15 px-5 py-3 font-black text-ink">
                <LogOut size={18} />
                Sair
              </button>
            ) : null}
            <a href="/" className="inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 py-3 font-black text-white">
              Voltar ao site
            </a>
          </div>
        </div>

        <div className="mb-5 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm font-bold leading-6 text-ink/75">
          Este CMS salva arquivos JSON e uploads dentro do projeto. Localmente isso funciona como persistencia no repositorio. Na Vercel, arquivos enviados em producao nao sao persistentes entre deploys; a estrutura esta pronta para futura migracao para Supabase Storage ou outro storage externo.
        </div>

        {message ? <p className="mb-5 rounded-md border border-ember/20 bg-white p-4 font-bold text-ink/75">{message}</p> : null}

        {authState !== "signed-in" ? (
          <form onSubmit={signIn} className="max-w-md rounded-lg bg-white p-6 shadow-lg">
            <label className="mb-4 block text-sm font-bold">
              E-mail
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="mt-2 w-full rounded-md border border-ink/15 bg-paper px-4 py-3" />
            </label>
            <label className="mb-4 block text-sm font-bold">
              Senha
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="mt-2 w-full rounded-md border border-ink/15 bg-paper px-4 py-3" />
            </label>
            <button disabled={!supabaseReady} className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-ember px-5 py-3 font-black text-white disabled:cursor-not-allowed disabled:bg-ink/30" type="submit">
              Entrar
            </button>
          </form>
        ) : (
          <div className="grid gap-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((item) => (
                <button key={item.id} onClick={() => setTab(item.id)} type="button" className={`rounded-md px-4 py-3 font-black ${tab === item.id ? "bg-ember text-white" : "bg-white text-ink"}`}>
                  {item.label}
                </button>
              ))}
            </div>

            {tab === "musicos" ? (
              <CmsBlock title="Musicos" onAdd={() => setMusicians((current) => withPositions([...current, { id: newId("musico"), name: "Novo musico", role: "", image: "", alt: "", active: true, position: current.length + 1 }]))} onSave={() => saveSection("musicos", musicians)}>
                {musicians.map((item, index) => (
                  <div key={item.id} {...dragHandlers(musicians, setMusicians, index)} className="grid gap-4 rounded-lg border border-ink/10 bg-white p-4 lg:grid-cols-[32px_96px_1fr_auto] lg:items-center">
                    <GripVertical className="cursor-grab text-ink/35" />
                    {imagePreview(item.image, item.alt)}
                    <div className="grid gap-3 md:grid-cols-2">
                      <TextInput label="Nome" value={item.name} onChange={(value) => setMusicians((items) => items.map((row) => (row.id === item.id ? { ...row, name: value } : row)))} />
                      <TextInput label="Funcao" value={item.role} onChange={(value) => setMusicians((items) => items.map((row) => (row.id === item.id ? { ...row, role: value } : row)))} />
                      <TextInput label="Imagem" value={item.image} onChange={(value) => setMusicians((items) => items.map((row) => (row.id === item.id ? { ...row, image: value } : row)))} />
                      <TextInput label="Alt" value={item.alt} onChange={(value) => setMusicians((items) => items.map((row) => (row.id === item.id ? { ...row, alt: value } : row)))} />
                    </div>
                    <RowActions active={item.active} onToggle={() => setMusicians((items) => items.map((row) => (row.id === item.id ? { ...row, active: !row.active } : row)))} onUpload={(event) => uploadAndSet(event, "musicos", (url) => setMusicians((items) => items.map((row) => (row.id === item.id ? { ...row, image: url } : row))))} onDelete={() => setMusicians((items) => withPositions(items.filter((row) => row.id !== item.id)))} />
                  </div>
                ))}
              </CmsBlock>
            ) : null}

            {tab === "convidados" ? (
              <CmsBlock title="Convidados Especiais" onAdd={() => setGuests((current) => withPositions([...current, { id: newId("convidado"), name: "Novo convidado", description: "", image: "", alt: "", active: true, position: current.length + 1 }]))} onSave={() => saveSection("convidados", guests)}>
                {guests.map((item, index) => (
                  <div key={item.id} {...dragHandlers(guests, setGuests, index)} className="grid gap-4 rounded-lg border border-ink/10 bg-white p-4 lg:grid-cols-[32px_96px_1fr_auto] lg:items-center">
                    <GripVertical className="cursor-grab text-ink/35" />
                    {imagePreview(item.image, item.alt)}
                    <div className="grid gap-3">
                      <TextInput label="Nome" value={item.name} onChange={(value) => setGuests((items) => items.map((row) => (row.id === item.id ? { ...row, name: value } : row)))} />
                      <TextInput label="Descricao" value={item.description} onChange={(value) => setGuests((items) => items.map((row) => (row.id === item.id ? { ...row, description: value } : row)))} />
                      <div className="grid gap-3 md:grid-cols-2">
                        <TextInput label="Foto" value={item.image} onChange={(value) => setGuests((items) => items.map((row) => (row.id === item.id ? { ...row, image: value } : row)))} />
                        <TextInput label="Alt" value={item.alt} onChange={(value) => setGuests((items) => items.map((row) => (row.id === item.id ? { ...row, alt: value } : row)))} />
                      </div>
                    </div>
                    <RowActions active={item.active} onToggle={() => setGuests((items) => items.map((row) => (row.id === item.id ? { ...row, active: !row.active } : row)))} onUpload={(event) => uploadAndSet(event, "convidados", (url) => setGuests((items) => items.map((row) => (row.id === item.id ? { ...row, image: url } : row))))} onDelete={() => setGuests((items) => withPositions(items.filter((row) => row.id !== item.id)))} />
                  </div>
                ))}
              </CmsBlock>
            ) : null}

            {tab === "galeria" ? (
              <CmsBlock title="Galeria" onAdd={() => setGallery((current) => withPositions([...current, { id: newId("midia"), type: "image", src: "", poster: "", title: "Nova midia", active: true, position: current.length + 1 }]))} onSave={() => saveSection("galeria", gallery)}>
                {gallery.map((item, index) => (
                  <div key={item.id} {...dragHandlers(gallery, setGallery, index)} className="grid gap-4 rounded-lg border border-ink/10 bg-white p-4 lg:grid-cols-[32px_120px_1fr_auto] lg:items-center">
                    <GripVertical className="cursor-grab text-ink/35" />
                    {item.type === "video" ? <video src={item.src} poster={item.poster} className="h-24 w-32 rounded-md bg-ink object-cover" muted /> : imagePreview(item.src, item.title)}
                    <div className="grid gap-3 md:grid-cols-2">
                      <TextInput label="Titulo" value={item.title} onChange={(value) => setGallery((items) => items.map((row) => (row.id === item.id ? { ...row, title: value } : row)))} />
                      <label className="text-sm font-bold">
                        Tipo
                        <select value={item.type} onChange={(event) => setGallery((items) => items.map((row) => (row.id === item.id ? { ...row, type: event.target.value as "image" | "video" } : row)))} className="mt-2 w-full rounded-md border border-ink/15 bg-paper px-4 py-3">
                          <option value="image">Imagem</option>
                          <option value="video">Video</option>
                        </select>
                      </label>
                      <TextInput label="Arquivo" value={item.src} onChange={(value) => setGallery((items) => items.map((row) => (row.id === item.id ? { ...row, src: value } : row)))} />
                      <TextInput label="Poster do video" value={item.poster || ""} onChange={(value) => setGallery((items) => items.map((row) => (row.id === item.id ? { ...row, poster: value } : row)))} />
                    </div>
                    <RowActions active={item.active} onToggle={() => setGallery((items) => items.map((row) => (row.id === item.id ? { ...row, active: !row.active } : row)))} onUpload={(event) => uploadAndSet(event, "galeria", (url) => setGallery((items) => items.map((row) => (row.id === item.id ? { ...row, src: url } : row))))} onDelete={() => setGallery((items) => withPositions(items.filter((row) => row.id !== item.id)))} />
                  </div>
                ))}
              </CmsBlock>
            ) : null}

            {tab === "patrocinadores" ? (
              <CmsBlock title={`Patrocinadores (${stats.master}/1 Master, ${stats.parceiros}/8 Parceiros)`} onAdd={() => setSponsors((current) => withPositions([...current, { id: newId("patrocinador"), name: "Nova empresa", slogan: "", logo: "", url: "", instagram: "", facebook: "", whatsapp: "", tier: "parceiro", active: true, position: current.length + 1 }]))} onSave={() => saveSection("patrocinadores", sponsors)}>
                {sponsors.map((item, index) => (
                  <div key={item.id} {...dragHandlers(sponsors, setSponsors, index)} className="grid gap-4 rounded-lg border border-ink/10 bg-white p-4 lg:grid-cols-[32px_96px_1fr_auto] lg:items-center">
                    <GripVertical className="cursor-grab text-ink/35" />
                    {imagePreview(item.logo, item.name)}
                    <div className="grid gap-3 md:grid-cols-2">
                      <TextInput label="Empresa" value={item.name} onChange={(value) => setSponsors((items) => items.map((row) => (row.id === item.id ? { ...row, name: value } : row)))} />
                      <TextInput label="Slogan" value={item.slogan} onChange={(value) => setSponsors((items) => items.map((row) => (row.id === item.id ? { ...row, slogan: value } : row)))} />
                      <TextInput label="Logomarca" value={item.logo} onChange={(value) => setSponsors((items) => items.map((row) => (row.id === item.id ? { ...row, logo: value } : row)))} />
                      <TextInput label="Site" value={item.url} onChange={(value) => setSponsors((items) => items.map((row) => (row.id === item.id ? { ...row, url: value } : row)))} />
                      <TextInput label="Instagram" value={item.instagram} onChange={(value) => setSponsors((items) => items.map((row) => (row.id === item.id ? { ...row, instagram: value } : row)))} />
                      <TextInput label="Facebook" value={item.facebook} onChange={(value) => setSponsors((items) => items.map((row) => (row.id === item.id ? { ...row, facebook: value } : row)))} />
                      <TextInput label="WhatsApp" value={item.whatsapp} onChange={(value) => setSponsors((items) => items.map((row) => (row.id === item.id ? { ...row, whatsapp: value } : row)))} />
                      <label className="text-sm font-bold">
                        Nivel
                        <select value={item.tier} onChange={(event) => setSponsors((items) => items.map((row) => (row.id === item.id ? { ...row, tier: event.target.value as "master" | "parceiro" } : row)))} className="mt-2 w-full rounded-md border border-ink/15 bg-paper px-4 py-3">
                          <option value="master">Patrocinador Master</option>
                          <option value="parceiro">Patrocinador Parceiro</option>
                        </select>
                      </label>
                    </div>
                    <RowActions active={item.active} onToggle={() => setSponsors((items) => items.map((row) => (row.id === item.id ? { ...row, active: !row.active } : row)))} onUpload={(event) => uploadAndSet(event, "patrocinadores", (url) => setSponsors((items) => items.map((row) => (row.id === item.id ? { ...row, logo: url } : row))))} onDelete={() => setSponsors((items) => withPositions(items.filter((row) => row.id !== item.id)))} />
                  </div>
                ))}
              </CmsBlock>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );

  async function uploadAndSet(event: ChangeEvent<HTMLInputElement>, section: CmsSection, setter: (url: string) => void) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await upload(section, file);
    if (url) setter(url);
    event.target.value = "";
  }
}

function CmsBlock({ title, children, onAdd, onSave }: { title: string; children: ReactNode; onAdd: () => void; onSave: () => void }) {
  return (
    <section className="rounded-lg bg-white p-5 shadow-lg">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-black">{title}</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={onAdd} type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-ink/15 px-4 py-2 font-black text-ink">
            <Plus size={18} />
            Adicionar
          </button>
          <button onClick={onSave} type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ember px-4 py-2 font-black text-white">
            <Save size={18} />
            Salvar JSON
          </button>
        </div>
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-sm font-bold">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-md border border-ink/15 bg-paper px-4 py-3" />
    </label>
  );
}

function RowActions({ active, onToggle, onUpload, onDelete }: { active: boolean; onToggle: () => void; onUpload: (event: ChangeEvent<HTMLInputElement>) => void; onDelete: () => void }) {
  return (
    <div className="grid gap-2">
      <button onClick={onToggle} type="button" className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-black ${active ? "bg-moss text-white" : "bg-ink/10 text-ink"}`}>
        <Edit3 size={16} />
        {active ? "Ativo" : "Inativo"}
      </button>
      <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-ink/15 px-3 py-2 text-sm font-black text-ink">
        <ImagePlus size={16} />
        Upload
        <input type="file" accept="image/*,video/*" className="hidden" onChange={onUpload} />
      </label>
      <button onClick={onDelete} type="button" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-ember px-3 py-2 text-sm font-black text-ember">
        <Trash2 size={16} />
        Excluir
      </button>
    </div>
  );
}
