import type { ReactNode } from "react";
import Text from "@/src/components/Text/Text";
import Title from "@/src/components/Title/Title";
import Contact from "@/src/components/Contact/Contact";
import ProjectCard, {
  type ProjectCardProps,
} from "@/src/components/ProjectCard/ProjectCard";
import { Reveal, StarLine, StarMark } from "@/src/components/StarBorders/InView";

/**
 * Imagens do modal: /imgs/design/<pasta>/<pasta>-img1.png ... imgN.png
 * (mesma convenção da página de serigrafia). Troque a pasta/quantidade
 * conforme os arquivos reais de cada projeto.
 */
const gallery = (folder: string, count: number) =>
  Array.from(
    { length: count },
    (_, i) => `/imgs/design/${folder}/${folder}-img${i + 1}.png`,
  );

/**
 * Ateliê Paulina: arquivos "paulina atelie1.jpg" ... "paulina atelie17.jpg"
 * em public/imgs/design/ateliePaulina/ (nomes com espaço, por isso o encodeURI).
 */
const paulinaImages = Array.from(
  { length: 17 },
  (_, i) => encodeURI(`/imgs/design/ateliePaulina/paulina atelie${i + 1}.jpg`),
);

const guaraPortifolioImages = Array.from(
  { length: 10 },
  (_, i) => encodeURI(`/imgs/design/guaraPortifolio/manual de marca guara${i + 1}.jpg`),
);

const projects: ProjectCardProps[] = [
  {
    name: "Identidade Visual - Mosaico Cultural",
    image: "/imgs/bannerDesing/b-mosaico.png",
    images: [],
  },
  {
    name: "Manual de Marca - Ateliê Paulina",
    image: "/imgs/bannerDesing/b-paulina.png",
    images: paulinaImages,
  },
  {
    name: "Identidade Visual - Guará Estúdio",
    image: "/imgs/bannerDesing/b-guara.png",
    images: guaraPortifolioImages,
  },
  {
    name: "Landing Page - Umami Sushi",
    image: "/imgs/bannerDesing/b-umami.png",
    images: [],
  },
];

/* Mesmo cabeçalho de seção da página de Serigrafia (estrela + linha) */
function SectionHeader({ title }: { title: ReactNode }) {
  return (
    <Reveal>
      <header className="relative mb-8 flex items-center lg:mb-16">
        <div className="shrink-0">
          <Title
            as="h2"
            font="nunito"
            weight="semibold"
            className="relative z-10 uppercase"
          >
            {title}
          </Title>
        </div>

        <div className="absolute left-1/2 top-1/2 z-[1] h-0 w-0 lg:static lg:-ml-3 lg:w-[90px] lg:shrink-0">
          <StarMark className="pointer-events-none absolute left-0 top-0 block h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 lg:left-1/2 lg:h-[90px] lg:w-[90px]" />
        </div>

        {/* a linha nasce do centro da estrela e corre para a direita */}
        <div className="absolute left-1/2 right-0 top-1/2 -translate-y-1/2 lg:static lg:-ml-[45px] lg:flex-1 lg:translate-y-0">
          <StarLine side="grow" className="w-full" />
        </div>
      </header>
    </Reveal>
  );
}

export default function Design() {
  return (
    <main className="min-h-screen bg-[#f9fadb] text-black">
      {/* Título */}
      <section className="px-6 pb-32 pt-28 text-center">
        <h1 className="font-display text-7xl uppercase tracking-tight md:text-8xl">
          Design
        </h1>
        <Text className="mx-auto mt-3 max-w-[22rem] text-[15px] leading-[18px] sm:max-w-none">
          Design Gráfico, Identidade visual, materiais para impressão,
          fechamento de arquivos.
        </Text>
      </section>

      {/* Projetos */}
      <section className="px-4 pb-24 lg:px-[70px]">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeader title="Projetos" />

          <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard key={project.name} {...project} />
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </main>
  );
}