export type Project = {
  slug: string;
  name: string;
  image: string;
  siteHref: string;
  description: string;
};

export const projects: Project[] = [
  {
    slug: "pousada-alvorada",
    name: "Pousada Alvorada",
    image: "/projetos/pousada-alvorada.jpg",
    siteHref: "https://exemplo.com.br",
    description:
      "Site institucional para pousada, com foco em reservas e na atmosfera do lugar.",
  },
  {
    slug: "rooftop",
    name: "Rooftop",
    image: "/projetos/rooftop.jpg",
    siteHref: "https://exemplo.com.br",
    description:
      "Landing page para rooftop gastronômico, com vista, cardápio e reservas.",
  },
  {
    slug: "cafeteria",
    name: "Cafeteria",
    image: "/projetos/cafeteria.jpg",
    siteHref: "https://exemplo.com.br",
    description:
      "Site para cafeteria com identidade acolhedora, cardápio e localização.",
  },
  {
    slug: "cocktail-bar",
    name: "Cocktail bar",
    image: "/projetos/cocktail-bar.jpg",
    siteHref: "https://exemplo.com.br",
    description:
      "Landing page para bar de drinks autorais, com carta e contato rápido.",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}