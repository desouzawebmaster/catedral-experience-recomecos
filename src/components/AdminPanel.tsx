 "use client";
 
 import Image from "next/image";
 import { useEffect, useMemo, useState } from "react";
 import type { ChangeEvent, DragEvent, FormEvent, ReactNode } from "react";
-import { Edit3, GripVertical, ImagePlus, LogOut, Plus, Save, ShieldCheck, Trash2 } from "lucide-react";
+import { Edit3, GripVertical, ImagePlus, KeyRound, LogOut, Plus, Save, ShieldCheck, Trash2 } from "lucide-react";
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
   { id: "musicos", label: "Músicos" },
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
       <Image src={src} alt={alt || "Prévia"} fill className="object-cover object-top" sizes="96px" />
     </div>
   );
 }
 
 export function AdminPanel() {
   const [authState, setAuthState] = useState<AuthState>("loading");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [message, setMessage] = useState("");
+  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
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
       setMessage("Configure as variáveis do Supabase para ativar o login no admin.");
       return;
     }
 
     const supabase = getSupabaseClient();
     supabase.auth.getSession().then(({ data }) => {
       const isAdmin = data.session?.user.email === adminEmail;
       setAuthState(isAdmin ? "signed-in" : "signed-out");
       if (data.session && !isAdmin) setMessage("Este acesso é exclusivo do administrador do site.");
     });
 
     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
@@ -175,50 +176,77 @@ export function AdminPanel() {
 
     const { data } = getSupabaseClient().storage.from("site-media").getPublicUrl(path);
     setMessage("Arquivo enviado ao Supabase Storage. Clique em salvar alterações para publicar no site.");
     return data.publicUrl;
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
       setMessage("Este acesso é exclusivo do administrador do site.");
       return;
     }
 
     setMessage("Login realizado.");
   }
 
+  async function recoverPassword() {
+    if (!supabaseReady || isRecoveringPassword) return;
+
+    const normalizedEmail = email.trim().toLowerCase();
+    if (!normalizedEmail) {
+      setMessage("Informe o e-mail do administrador para recuperar a senha.");
+      return;
+    }
+
+    if (normalizedEmail !== adminEmail) {
+      setMessage("A recuperação de senha está disponível apenas para o e-mail do administrador.");
+      return;
+    }
+
+    setIsRecoveringPassword(true);
+    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/admin` : undefined;
+    const { error } = await getSupabaseClient().auth.resetPasswordForEmail(normalizedEmail, { redirectTo });
+    setIsRecoveringPassword(false);
+
+    if (error) {
+      setMessage(error.message || "Não foi possível enviar o e-mail de recuperação de senha.");
+      return;
+    }
+
+    setMessage("Enviamos um e-mail de recuperação de senha para o administrador. Abra o link recebido para definir uma nova senha.");
+  }
+
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
@@ -233,53 +261,64 @@ export function AdminPanel() {
                 Sair
               </button>
             ) : null}
             <a href="/" className="inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 py-3 font-black text-white">
               Voltar ao site
             </a>
           </div>
         </div>
 
         <div className="mb-5 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm font-bold leading-6 text-ink/75">
           Este CMS salva os dados no Supabase e envia arquivos para o Supabase Storage. Depois de salvar, as alterações ficam disponíveis para o site publicado na Vercel.
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
-            <button disabled={!supabaseReady} className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-ember px-5 py-3 font-black text-white disabled:cursor-not-allowed disabled:bg-ink/30" type="submit">
-              Entrar
-            </button>
+            <div className="grid gap-3">
+              <button disabled={!supabaseReady} className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-ember px-5 py-3 font-black text-white disabled:cursor-not-allowed disabled:bg-ink/30" type="submit">
+                Entrar
+              </button>
+              <button
+                disabled={!supabaseReady || isRecoveringPassword}
+                onClick={recoverPassword}
+                type="button"
+                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-ember px-5 py-3 font-black text-ember disabled:cursor-not-allowed disabled:border-ink/20 disabled:text-ink/35"
+              >
+                <KeyRound size={18} />
+                {isRecoveringPassword ? "Enviando recuperação..." : "Recuperar senha"}
+              </button>
+            </div>
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
               <CmsBlock title="Músicos" onAdd={() => setMusicians((current) => withPositions([...current, { id: newId("musico"), name: "Novo músico", role: "", image: "", alt: "", active: true, position: current.length + 1 }]))} onSave={() => saveSection("musicos", musicians)}>
                 {musicians.map((item, index) => (
                   <div key={item.id} {...dragHandlers(musicians, setMusicians, index)} className="grid gap-4 rounded-lg border border-ink/10 bg-white p-4 lg:grid-cols-[32px_96px_1fr_auto] lg:items-center">
                     <GripVertical className="cursor-grab text-ink/35" />
                     {imagePreview(item.image, item.alt)}
                     <div className="grid gap-3 md:grid-cols-2">
                       <TextInput label="Nome" value={item.name} onChange={(value) => setMusicians((items) => items.map((row) => (row.id === item.id ? { ...row, name: value } : row)))} />
                       <TextInput label="Função" value={item.role} onChange={(value) => setMusicians((items) => items.map((row) => (row.id === item.id ? { ...row, role: value } : row)))} />
                       <TextInput label="Imagem" value={item.image} onChange={(value) => setMusicians((items) => items.map((row) => (row.id === item.id ? { ...row, image: value } : row)))} />
                       <TextInput label="Texto alternativo" value={item.alt} onChange={(value) => setMusicians((items) => items.map((row) => (row.id === item.id ? { ...row, alt: value } : row)))} />
                     </div>
                     <RowActions active={item.active} onToggle={() => setMusicians((items) => items.map((row) => (row.id === item.id ? { ...row, active: !row.active } : row)))} onUpload={(event) => uploadAndSet(event, "musicos", (url) => setMusicians((items) => items.map((row) => (row.id === item.id ? { ...row, image: url } : row))))} onDelete={() => setMusicians((items) => withPositions(items.filter((row) => row.id !== item.id)))} />
                   </div>
