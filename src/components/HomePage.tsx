"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock,
  ExternalLink,
  HeartHandshake,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Music2,
  Play,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  Utensils,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { fallbackSponsors, type Sponsor } from "@/lib/sponsors";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { site, whatsappUrl } from "@/lib/site";

const navItems = [
  { label: "Evento", href: "#evento" },
  { label: "Causa", href: "#causa" },
  { label: "Galeria", href: "#galeria" },
  { label: "Ingressos", href: "#ingressos" },
  { label: "Patrocínios", href: "#patrocinios" },
  { label: "Local", href: "#local" }
];

const causeImages = ["/assets/cause-1.jpg", "/assets/cause-2.jpg", "/assets/cause-3.jpg", "/assets/cause-4.jpg"];
const experienceImages = ["/assets/exp-1.jpg", "/assets/exp-2.jpg", "/assets/exp-3.jpg", "/assets/exp-4.jpg"];

const eventHighlights: Array<[string, LucideIcon]> = [
  ["Tributo à Banda Catedral", Music2],
  ["Evento beneficente", HeartHandshake],
  ["Experiência intimista", Sparkles],
  ["Capacidade limitada", Users]
];

const galleryItems = [
  { type: "photo", src: "/assets/hero-concert.jpg", title: "Noite de música e propósito" },
  { type: "photo", src: "/assets/experience.jpg", title: "Experiência musical intimista" },
  { type: "photo", src: "/assets/cause.jpg", title: "Impacto social" },
  { type: "photo", src: "/assets/venue.jpg", title: "Dissenso Lounge" },
  { type: "photo", src: "/assets/exp-1.jpg", title: "Banda cover" },
  { type: "photo", src: "/assets/cause-3.jpg", title: "Arrecadação solidária" }
];

const tickets = [
  {
    name: "Ingresso Recomeços",
    price: "R$100,00",
    detail: "Para quem deseja contribuir diretamente com as causas do evento.",
    action: "Comprar na Sympla",
    href: site.symplaUrl
  },
  {
    name: "Ingresso Juntos",
    price: "R$70,00 por pessoa",
    detail: "Válido apenas para compra de dois ingressos. Ideal para compartilhar a experiência.",
    action: "Comprar na Sympla",
    href: site.symplaUrl,
    featured: true
  },
  {
    name: "Ingresso Pela Causa",
    price: "R$150,00",
    detail: "Cota especial de contribuição direta, não disponível na Sympla.",
    action: "Comprar pelo WhatsApp",
    href: whatsappUrl("Olá! Quero comprar o Ingresso Pela Causa do Catedral Experience – Recomeços.")
  }
];

const sponsorTiers = [
  {
    name: "Patrocinador Master",
    availability: "Apenas 1 vaga",
    price: "R$600",
    benefits: ["Destaque máximo no site oficial", "Presença prioritária em Instagram e lives", "Logo em banner do evento", "Menções nas redes sociais"]
  },
  {
    name: "Patrocinador Colaborador",
    availability: "Até 8 vagas",
    price: "R$250",
    benefits: ["Logo na área de parceiros", "Divulgação nas redes sociais", "Citação em conteúdos do evento", "Associação direta à causa social"]
  }
];

function Countdown() {
  const target = useMemo(() => new Date(site.eventDateIso).getTime(), []);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const distance = Math.max(target - now, 0);
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return (
    <div className="grid grid-cols-4 gap-2 rounded-lg border border-white/15 bg-white/10 p-2 backdrop-blur sm:max-w-xl sm:gap-3 sm:p-3" aria-label="Contador regressivo para 14 de novembro de 2026 às 20h">
      {[
        ["Dias", days],
        ["Horas", hours],
        ["Min", minutes],
        ["Seg", seconds]
      ].map(([label, value]) => (
        <div key={label} className="rounded-md bg-ink/70 px-2 py-3 text-center">
          <strong className="block text-2xl font-black text-white sm:text-4xl">{String(value).padStart(2, "0")}</strong>
          <span className="text-[0.68rem] font-bold uppercase tracking-wide text-white/70 sm:text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12">
      <p className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-ember">{eyebrow}</p>
      <h2 className="text-3xl font-black text-ink sm:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-ink/70 sm:text-lg">{text}</p>
    </div>
  );
}

function Mosaic({ images, label }: { images: string[]; label: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {images.map((src, index) => (
        <div key={src} className={`relative overflow-hidden rounded-lg ${index === 0 ? "row-span-2 min-h-72" : "min-h-36"}`}>
          <Image src={src} alt={`${label} ${index + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
        </div>
      ))}
    </div>
  );
}

function SponsorForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = ["Interesse em patrocínio - Catedral Experience – Recomeços", ""];

    for (const [key, value] of data.entries()) {
      lines.push(`${key}: ${value}`);
    }

    window.location.href = `mailto:${site.contactEmail}?subject=${encodeURIComponent("Quero patrocinar o Catedral Experience")}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg bg-white p-5 text-ink shadow-xl sm:grid-cols-2 sm:p-8">
      {["Nome", "Empresa", "Telefone", "E-mail", "Site", "Instagram"].map((field) => (
        <label key={field} className="text-sm font-bold text-ink/75">
          {field}
          <input
            required={["Nome", "Telefone", "E-mail"].includes(field)}
            name={field}
            type={field === "E-mail" ? "email" : "text"}
            className="mt-2 w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-base outline-none transition focus:border-ember focus:ring-2 focus:ring-ember/20"
          />
        </label>
      ))}
      <label className="text-sm font-bold text-ink/75 sm:col-span-2">
        Mensagem
        <textarea
          name="Mensagem"
          rows={5}
          className="mt-2 w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-base outline-none transition focus:border-ember focus:ring-2 focus:ring-ember/20"
          defaultValue="Olá! Quero receber informações sobre as cotas de patrocínio do evento."
        />
      </label>
      <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ember px-6 py-3 font-black text-white transition hover:bg-ink sm:col-span-2" type="submit">
        <HeartHandshake size={20} />
        Quero ser patrocinador
      </button>
      {sent ? <p className="text-sm font-bold text-moss sm:col-span-2">Seu aplicativo de e-mail foi aberto com a mensagem pronta.</p> : null}
    </form>
  );
}

function Gallery() {
  const [active, setActive] = useState<(typeof galleryItems)[number] | null>(null);

  return (
    <>
      <div className="masonry">
        {galleryItems.map((item) => (
          <button
            key={`${item.type}-${item.src}`}
            onClick={() => setActive(item)}
            className="group relative mb-4 block w-full overflow-hidden rounded-lg bg-ink text-left shadow-lg"
            type="button"
          >
            <Image
              src={item.poster || item.src}
              alt={item.title}
              width={900}
              height={640}
              className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/[0.85] to-transparent p-4 text-sm font-black text-white">
              {item.title}
              {item.type === "video" ? <Play size={18} /> : <ArrowUpRight size={18} />}
            </span>
          </button>
        ))}
      </div>

      {active ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true">
          <button className="absolute right-4 top-4 rounded-full bg-white p-3 text-ink" onClick={() => setActive(null)} type="button" aria-label="Fechar galeria">
            <X size={22} />
          </button>
          <div className="w-full max-w-5xl overflow-hidden rounded-lg bg-black">
            {active.type === "video" ? (
              <video controls poster={active.poster} className="max-h-[82vh] w-full">
                <source src={active.src} type="video/mp4" />
              </video>
            ) : (
              <Image src={active.src} alt={active.title} width={1400} height={900} className="max-h-[82vh] w-full object-contain" />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function SponsorsShowcase() {
  const [sponsors, setSponsors] = useState<Sponsor[]>(fallbackSponsors);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    getSupabaseClient()
      .from("sponsors")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data?.length) setSponsors(data as Sponsor[]);
      });
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {sponsors.map((sponsor) => (
        <a key={sponsor.id} href={sponsor.url || "#"} target={sponsor.url?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="rounded-lg border border-ink/10 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div className="relative mx-auto mb-4 h-20 w-20 overflow-hidden rounded-md bg-paper">
            <Image src={sponsor.logo_url || site.assets.logoPlaceholder} alt={sponsor.name} fill className="object-cover" sizes="80px" />
          </div>
          <h3 className="text-lg font-black text-ink">{sponsor.name}</h3>
          <p className="mt-2 text-sm leading-6 text-ink/[0.65]">{sponsor.slogan}</p>
        </a>
      ))}
    </div>
  );
}

export function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-ink/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Menu principal">
          <a href="#topo" className="text-sm font-black uppercase tracking-[0.2em] text-white sm:text-base">
            Catedral Experience
          </a>
          <button className="rounded-md p-2 text-white lg:hidden" onClick={() => setMenuOpen((value) => !value)} type="button" aria-label="Abrir menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
          <div className={`${menuOpen ? "block" : "hidden"} absolute inset-x-0 top-full bg-ink px-4 py-4 shadow-2xl lg:static lg:block lg:bg-transparent lg:p-0 lg:shadow-none`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="text-sm font-bold text-white/75 transition hover:text-white" onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              ))}
              <a href={site.musicianAreaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-gold/50 px-3 py-2 text-sm font-black text-gold transition hover:bg-gold hover:text-ink">
                Área do Músico
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </nav>
      </header>

      <section id="topo" className="relative min-h-screen overflow-hidden pt-20">
        <Image src={site.assets.hero} alt="Catedral Experience – Recomeços" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/[0.55] to-ink" />
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-center px-4 pb-12 pt-16 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.24em] text-gold backdrop-blur">
              <CalendarDays size={16} />
              14/11/2026 às 20:00
            </p>
            <h1 className="text-5xl font-black leading-none text-white sm:text-7xl lg:text-8xl">Catedral Experience – Recomeços</h1>
            <p className="mt-5 text-2xl font-black text-gold sm:text-4xl">{site.slogan}</p>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/[0.82] sm:text-xl">{site.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={site.symplaUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ember px-6 py-3 font-black text-white shadow-glow transition hover:bg-white hover:text-ink">
                <Ticket size={20} />
                Comprar Ingresso
              </a>
              <a href="#patrocinios" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/40 px-6 py-3 font-black text-white transition hover:bg-white hover:text-ink">
                <HeartHandshake size={20} />
                Quero Patrocinar
              </a>
            </div>
            <div className="mt-8">
              <Countdown />
            </div>
            <p className="mt-6 max-w-3xl text-sm font-semibold leading-6 text-white/70">{site.legalNotice}</p>
          </motion.div>
        </div>
      </section>

      <section id="evento" className="bg-paper px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-ember">Sobre o evento</p>
            <h2 className="text-3xl font-black text-ink sm:text-5xl">Tributo beneficente com cara de grande noite.</h2>
            <p className="mt-5 text-lg leading-8 text-ink/[0.72]">
              O Catedral Experience – Recomeços celebra o repertório da Banda Catedral em uma experiência independente, intimista e beneficente, criada para aproximar música, memória afetiva e ação social concreta.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {eventHighlights.map(([text, Icon]) => (
                <div key={text} className="flex items-center gap-3 rounded-lg bg-white p-4 text-ink shadow-sm">
                  <Icon className="text-ember" size={22} />
                  <span className="font-black">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[460px] overflow-hidden rounded-lg">
            <Image src={site.assets.experienceHero} alt="Experiência musical do Catedral Experience" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <section id="causa" className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="A causa" title="Duas frentes sociais, um mesmo recomeço." text="Parte da arrecadação será direcionada a apoio emergencial e arrecadação de alimentos para famílias em vulnerabilidade em São Paulo." />
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <Mosaic images={causeImages} label="Causa social" />
            <div className="grid gap-5">
              <div className="rounded-lg border border-ink/10 bg-paper p-6">
                <HeartHandshake className="mb-4 text-ember" size={34} />
                <h3 className="text-2xl font-black text-ink">Família em Recomeço</h3>
                <p className="mt-3 leading-7 text-ink/70">Parte da arrecadação ajudará uma família que sofreu um golpe financeiro e está reconstruindo sua vida com dignidade, segurança e esperança.</p>
              </div>
              <div className="rounded-lg border border-ink/10 bg-paper p-6">
                <Utensils className="mb-4 text-moss" size={34} />
                <h3 className="text-2xl font-black text-ink">Arrecadação de Alimentos</h3>
                <p className="mt-3 leading-7 text-ink/70">O evento também impulsiona a arrecadação de alimentos para famílias em situação de vulnerabilidade em São Paulo.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="text-white">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-gold">Experiência musical</p>
            <h2 className="text-3xl font-black sm:text-5xl">Som, memória e presença em uma atmosfera próxima.</h2>
            <p className="mt-5 text-lg leading-8 text-white/[0.72]">
              Banda cover, participação especial de Rodolfo Lauber, estrutura preparada para uma noite marcante e ambiente intimista para quem quer viver a música de perto.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Banda cover", "Rodolfo Lauber", "Estrutura do evento", "Ambiente intimista"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-white/[0.12] bg-white/[0.08] p-4">
                  <Check className="text-gold" size={20} />
                  <span className="font-black">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <Mosaic images={experienceImages} label="Experiência musical" />
        </div>
      </section>

      <section id="galeria" className="bg-paper px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Galeria" title="Fotos e vídeos preparados para crescer." text="Uma galeria moderna em formato masonry para registrar ensaios, bastidores, parceiros, vídeos e momentos do evento." />
          <Gallery />
        </div>
      </section>

      <section id="ingressos" className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Ingressos" title="Escolha sua forma de participar." text="Garanta seu lugar e contribua para as causas sociais do Catedral Experience – Recomeços." />
          <div className="grid gap-5 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <div key={ticket.name} className={`relative rounded-lg border p-6 shadow-sm ${ticket.featured ? "border-ember bg-ink text-white shadow-glow" : "border-ink/10 bg-paper text-ink"}`}>
                {ticket.featured ? <span className="absolute right-4 top-4 rounded-md bg-gold px-3 py-1 text-xs font-black uppercase text-ink">Mais escolhido</span> : null}
                <h3 className="pr-24 text-2xl font-black">{ticket.name}</h3>
                <p className={`mt-5 text-4xl font-black ${ticket.featured ? "text-gold" : "text-ember"}`}>{ticket.price}</p>
                <p className={`mt-4 min-h-20 leading-7 ${ticket.featured ? "text-white/[0.76]" : "text-ink/70"}`}>{ticket.detail}</p>
                <a href={ticket.href} target="_blank" rel="noreferrer" className={`mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-5 py-3 font-black transition ${ticket.featured ? "bg-ember text-white hover:bg-white hover:text-ink" : "bg-ink text-white hover:bg-ember"}`}>
                  <Ticket size={20} />
                  {ticket.action}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="patrocinios" className="bg-ink px-4 py-16 text-white sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-4xl text-center">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-gold">Patrocínios</p>
            <h2 className="text-4xl font-black sm:text-6xl">Sua marca impulsionando recomeços.</h2>
            <p className="mt-5 text-lg leading-8 text-white/[0.72]">
              O patrocínio conecta sua empresa a um evento com presença digital, visibilidade local, conteúdo em redes sociais e impacto social transparente.
            </p>
          </div>
          <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {["Site oficial", "Instagram", "Lives", "Banner do evento", "Redes sociais"].map((benefit) => (
              <div key={benefit} className="rounded-lg border border-white/[0.12] bg-white/[0.08] p-4 text-center font-black">
                {benefit}
              </div>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {sponsorTiers.map((tier) => (
              <div key={tier.name} className="rounded-lg border border-white/[0.14] bg-white p-6 text-ink shadow-xl">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <h3 className="text-3xl font-black">{tier.name}</h3>
                    <p className="mt-2 font-bold text-ember">{tier.availability}</p>
                  </div>
                  <div className="rounded-md bg-paper px-5 py-4 text-center">
                    <p className="text-xs font-black uppercase text-ink/[0.55]">Contribuição mínima</p>
                    <p className="text-3xl font-black text-ember">{tier.price}</p>
                  </div>
                </div>
                <ul className="mt-6 grid gap-3">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3 text-ink/75">
                      <ShieldCheck className="mt-0.5 shrink-0 text-moss" size={20} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <a href={whatsappUrl(`Olá! Quero ser ${tier.name} do Catedral Experience – Recomeços.`)} target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-ember px-5 py-3 font-black text-white transition hover:bg-ink">
                  <HeartHandshake size={20} />
                  Quero ser patrocinador
                </a>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <SponsorForm />
          </div>
        </div>
      </section>

      <section id="parceiros" className="bg-paper px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Parceiros" title="Marcas que caminham com a causa." text="A área visual de patrocinadores está pronta para receber logomarcas, slogans e links oficiais via administração Supabase." />
          <SponsorsShowcase />
        </div>
      </section>

      <section id="local" className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-ember">Local</p>
            <h2 className="text-4xl font-black text-ink">{site.address.venue}</h2>
            <div className="mt-5 space-y-2 text-lg font-bold leading-8 text-ink/[0.72]">
              <p>{site.address.street}</p>
              <p>{site.address.floor}</p>
              <p>{site.address.district}</p>
              <p>{site.address.city}</p>
            </div>
            <div className="mt-6 overflow-hidden rounded-lg border border-ink/10">
              <iframe
                title="Mapa para Dissenso Lounge"
                src="https://www.google.com/maps?q=Dissenso%20Lounge%20Rua%20Anhaia%201180%20Bom%20Retiro%20S%C3%A3o%20Paulo&output=embed"
                loading="lazy"
                className="h-80 w-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-ink">
            <Image src={site.assets.venue} alt="Dissenso Lounge" width={1200} height={900} className="h-full min-h-[420px] w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-ink px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-3">
          <a href={whatsappUrl("Olá! Quero falar sobre o Catedral Experience – Recomeços.")} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-white/[0.12] bg-white/[0.08] p-5 font-black">
            <Users className="text-gold" />
            WhatsApp
          </a>
          <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-white/[0.12] bg-white/[0.08] p-5 font-black">
            <Instagram className="text-gold" />
            Instagram
          </a>
          <a href={`mailto:${site.contactEmail}`} className="flex items-center gap-3 rounded-lg border border-white/[0.12] bg-white/[0.08] p-5 font-black">
            <Mail className="text-gold" />
            E-mail
          </a>
        </div>
      </section>

      <footer className="bg-black px-4 py-8 text-white/70 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Catedral Experience – Recomeços. Todos os direitos reservados.</p>
          <p className="max-w-2xl text-sm">{site.shortLegalNotice}</p>
        </div>
      </footer>
    </main>
  );
}
