export type SiteImageSlot = {
  key: string;
  label: string;
  image_url: string;
  alt: string;
  category: "hero" | "evento" | "causa" | "experiencia" | "local" | "galeria";
  position: number;
};

export const defaultImageSlots: SiteImageSlot[] = [
  { key: "hero.main", label: "Banner principal", image_url: "/assets/hero-image.png", alt: "Banda no palco do Catedral Experience", category: "hero", position: 1 },
  { key: "evento.vocal", label: "Evento - vocal", image_url: "/assets/hero-singer.png", alt: "Vocalista no palco", category: "evento", position: 1 },
  { key: "evento.bateria", label: "Evento - bateria", image_url: "/assets/hero-musician-1.png", alt: "Baterista", category: "evento", position: 2 },
  { key: "evento.guitarra", label: "Evento - guitarra", image_url: "/assets/hero-musician-3.jpeg", alt: "Guitarrista", category: "evento", position: 3 },
  { key: "evento.baixo", label: "Evento - baixo", image_url: "/assets/hero-musician-4.jpeg", alt: "Baixista", category: "evento", position: 4 },
  { key: "evento.teclado", label: "Evento - teclado", image_url: "/assets/hero-musician-5.png", alt: "Tecladista", category: "evento", position: 5 },
  { key: "causa.1", label: "Causa 1", image_url: "/assets/social-cause-1.jpeg", alt: "Familia recebendo cesta basica", category: "causa", position: 1 },
  { key: "causa.2", label: "Causa 2", image_url: "/assets/social-cause-2.jpeg", alt: "Cestas basicas organizadas", category: "causa", position: 2 },
  { key: "causa.3", label: "Causa 3", image_url: "/assets/social-cause-3.jpeg", alt: "Atendimento social no evento", category: "causa", position: 3 },
  { key: "causa.4", label: "Causa 4", image_url: "/assets/social-cause-4.jpeg", alt: "Cadastro para recebimento de alimentos", category: "causa", position: 4 },
  { key: "causa.5", label: "Causa 5", image_url: "/assets/social-cause-5.jpeg", alt: "Entrega de alimentos", category: "causa", position: 5 },
  { key: "local.1", label: "Local 1", image_url: "/assets/place-1.jpeg", alt: "Palco do Dissenso Lounge", category: "local", position: 1 },
  { key: "local.2", label: "Local 2", image_url: "/assets/place-2.png", alt: "Estrutura do palco", category: "local", position: 2 },
  { key: "local.3", label: "Local 3", image_url: "/assets/place-3.png", alt: "Iluminacao do palco", category: "local", position: 3 }
];

export function getSlot(slots: SiteImageSlot[], key: string) {
  return slots.find((slot) => slot.key === key) ?? defaultImageSlots.find((slot) => slot.key === key);
}

export function getSlotsByCategory(slots: SiteImageSlot[], category: SiteImageSlot["category"]) {
  const merged = defaultImageSlots.map((fallback) => slots.find((slot) => slot.key === fallback.key) ?? fallback);
  return merged.filter((slot) => slot.category === category).sort((a, b) => a.position - b.position);
}
