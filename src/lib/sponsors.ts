export type Sponsor = {
  id: string;
  name: string;
  slogan: string;
  logo_url: string;
  url: string;
  tier?: "master" | "colaborador";
};

export const fallbackSponsors: Sponsor[] = [
  {
    id: "placeholder-master",
    name: "Sua marca aqui",
    slogan: "Associe sua empresa a uma noite de impacto social.",
    logo_url: "/assets/logo-placeholder.jpg",
    url: "#patrocinios",
    tier: "master"
  },
  {
    id: "placeholder-colaborador",
    name: "Parceiro Colaborador",
    slogan: "Visibilidade com propósito para empresas locais.",
    logo_url: "/assets/logo-placeholder.jpg",
    url: "#patrocinios",
    tier: "colaborador"
  }
];
