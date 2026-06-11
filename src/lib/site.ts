export const site = {
  name: "Catedral Experience - Recomecos",
  displayName: "Catedral Experience – Recomeços",
  slogan: "Mais que um show. Um recomeço.",
  description: "Uma noite especial de música, propósito e impacto social.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.catedralexperience.com.br",
  eventDateIso: "2026-11-14T20:00:00-03:00",
  symplaUrl:
    "https://www.sympla.com.br/evento/catedral-experience/3386163?algoliaID=6d3e1424a9cd84839d2e37091fff68d5",
  musicianAreaUrl: "https://catedralexperience.lovable.app/auth",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/catedralexperience",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contato@catedralexperience.com.br",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999",
  legalNotice:
    "Catedral Experience – Recomeços é um evento independente em homenagem ao repertório da Banda Catedral e não possui vínculo oficial com a banda.",
  shortLegalNotice:
    "Evento independente em homenagem ao repertório da Banda Catedral. Sem vínculo oficial com a banda.",
  address: {
    venue: "Dissenso Lounge",
    street: "Rua Anhaia, 1180",
    floor: "4º andar",
    district: "Bom Retiro",
    city: "São Paulo"
  },
  assets: {
    hero: "/assets/hero-band-stage.jpg",
    causeHero: "/assets/social-cause-2.jpeg",
    experienceHero: "/assets/hero-singer.png",
    venue: "/assets/place-1.jpeg",
    logoPlaceholder: "/assets/logo-placeholder.jpg"
  }
};

export const keywords = [
  "Banda Catedral",
  "Tributo Banda Catedral",
  "Show Banda Catedral São Paulo",
  "Evento beneficente São Paulo",
  "Música cristã São Paulo",
  "Catedral Experience"
];

export const whatsappUrl = (message: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
