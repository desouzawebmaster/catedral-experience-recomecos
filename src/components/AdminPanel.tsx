"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Edit3, LogOut, Plus, Save, ShieldCheck, Trash2, X } from "lucide-react";
import { fallbackSponsors, type Sponsor } from "@/lib/sponsors";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { site } from "@/lib/site";

type AuthState = "loading" | "signed-out" | "signed-in";

const emptySponsor = {
  name: "",
  slogan: "",
  logo_url: "",
  url: "",
  tier: "colaborador" as "master" | "colaborador"
};

export function AdminPanel() {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [sponsors, setSponsors] = useState<Sponsor[]>(fallbackSponsors);
  const [form, setForm] = useState(emptySponsor);
  const [editingId, setEditingId] = useState<string | null>(null);
  const supabaseReady = isSupabaseConfigured;

  useEffect(() => {
    if (!supabaseReady) {
      setAuthState("signed-out");
      setMessage("Configure as variáveis do Supabase para ativar login e edição.");
      return;
    }

    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data }) => setAuthState(data.session ? "signed-in" : "signed-out"));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(session ? "signed-in" : "signed-out");
    });

    return () => listener.subscription.unsubscribe();
  }, [supabaseReady]);

  useEffect(() => {
    if (authState !== "signed-in" || !supabaseReady) return;

    getSupabaseClient()
      .from("sponsors")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setMessage(error.message);
        if (data) setSponsors(data as Sponsor[]);
      });
  }, [authState, supabaseReady]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabaseReady) return;

    const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : "Login realizado.");
  }

  async function signOut() {
    if (!supabaseReady) return;
    await getSupabaseClient().auth.signOut();
  }

  async function saveSponsor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabaseReady) return;

    const payload = {
      name: form.name,
      slogan: form.slogan,
      logo_url: form.logo_url,
      url: form.url,
      tier: form.tier
    };

    const query = editingId
      ? getSupabaseClient().from("sponsors").update(payload).eq("id", editingId)
      : getSupabaseClient().from("sponsors").insert(payload);

    const { data, error } = await query.select().single();

    if (error) {
      setMessage(error.message);
      return;
    }

    setSponsors((current) =>
      editingId ? current.map((sponsor) => (sponsor.id === editingId ? (data as Sponsor) : sponsor)) : [data as Sponsor, ...current]
    );
    setForm(emptySponsor);
    setEditingId(null);
    setMessage(editingId ? "Patrocinador atualizado." : "Patrocinador cadastrado.");
  }

  function startEditing(sponsor: Sponsor) {
    setEditingId(sponsor.id);
    setForm({
      name: sponsor.name,
      slogan: sponsor.slogan,
      logo_url: sponsor.logo_url,
      url: sponsor.url || "",
      tier: sponsor.tier || "colaborador"
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptySponsor);
  }

  async function deleteSponsor(id: string) {
    if (!supabaseReady) return;
    const { error } = await getSupabaseClient().from("sponsors").delete().eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setSponsors((current) => current.filter((sponsor) => sponsor.id !== id));
    setMessage("Patrocinador removido.");
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-8 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-ember">
              <ShieldCheck size={18} />
              Administração
            </p>
            <h1 className="text-3xl font-black sm:text-5xl">Patrocinadores</h1>
          </div>
          <a href="/" className="inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 py-3 font-black text-white">
            Voltar ao site
          </a>
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
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <form onSubmit={saveSponsor} className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black">{editingId ? "Editar" : "Cadastrar"}</h2>
                {editingId ? <Edit3 className="text-ember" /> : <Plus className="text-ember" />}
              </div>
              {[
                ["Nome", "name"],
                ["Slogan", "slogan"],
                ["Logo", "logo_url"],
                ["URL", "url"]
              ].map(([label, key]) => (
                <label key={key} className="mb-4 block text-sm font-bold">
                  {label}
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    required={key !== "url"}
                    className="mt-2 w-full rounded-md border border-ink/15 bg-paper px-4 py-3"
                  />
                </label>
              ))}
              <label className="mb-5 block text-sm font-bold">
                Cota
                <select value={form.tier} onChange={(event) => setForm((current) => ({ ...current, tier: event.target.value as "master" | "colaborador" }))} className="mt-2 w-full rounded-md border border-ink/15 bg-paper px-4 py-3">
                  <option value="master">Patrocinador Master</option>
                  <option value="colaborador">Patrocinador Colaborador</option>
                </select>
              </label>
              <button className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-ember px-5 py-3 font-black text-white" type="submit">
                <Save size={18} />
                {editingId ? "Salvar alterações" : "Salvar patrocinador"}
              </button>
              {editingId ? (
                <button onClick={cancelEditing} type="button" className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-ink/15 px-5 py-3 font-black text-ink">
                  <X size={18} />
                  Cancelar edição
                </button>
              ) : null}
              <button onClick={signOut} type="button" className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-ink/15 px-5 py-3 font-black text-ink">
                <LogOut size={18} />
                Sair
              </button>
            </form>

            <div className="grid gap-4">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="grid gap-4 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-[80px_1fr_auto] sm:items-center">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md bg-paper">
                    <Image src={sponsor.logo_url || site.assets.logoPlaceholder} alt={sponsor.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{sponsor.name}</h3>
                    <p className="text-sm leading-6 text-ink/[0.65]">{sponsor.slogan}</p>
                    <p className="mt-1 text-xs font-bold uppercase text-ember">{sponsor.tier || "colaborador"}</p>
                  </div>
                  <div className="grid gap-2">
                    <button onClick={() => startEditing(sponsor)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-ink/15 px-4 py-2 font-black text-ink" type="button">
                      <Edit3 size={18} />
                      Editar
                    </button>
                    <button onClick={() => deleteSponsor(sponsor.id)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-ember px-4 py-2 font-black text-ember" type="button">
                      <Trash2 size={18} />
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
