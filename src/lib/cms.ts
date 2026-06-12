export type CmsSection = "musicos" | "convidados" | "galeria" | "patrocinadores";

export type Musician = {
  id: string;
  name: string;
  role: string;
  image: string;
  alt: string;
  active: boolean;
  position: number;
};

export type Guest = {
  id: string;
  name: string;
  description: string;
  image: string;
  alt: string;
  active: boolean;
  position: number;
};

export type GalleryMedia = {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  active: boolean;
  position: number;
};

export type Sponsor = {
  id: string;
  name: string;
  slogan: string;
  logo: string;
  url: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  tier: "master" | "parceiro";
  active: boolean;
  position: number;
};

export function sortActive<T extends { active: boolean; position: number }>(items: T[]) {
  return items.filter((item) => item.active).sort((a, b) => a.position - b.position);
}

export function ordered<T extends { position: number }>(items: T[]) {
  return [...items].sort((a, b) => a.position - b.position);
}
