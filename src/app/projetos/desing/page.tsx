import Image from "next/image";
import Text from "@/src/components/Text/Text";
import Contact from "@/src/components/Contact/Contact";
import ProjectCard, {
  type ProjectCardProps,
} from "@/src/components/ProjectCard/ProjectCard";

const projects: ProjectCardProps[] = [
  {
    name: "Identidade Visual - Mosaico Cultural",
    image: "/imgs/bannerDesing/b-mosaico.png",
    projectHref: "/design/mosaico",
  },
  {
    name: "Manual de Marca - Ateliê Paulina",
    image: "/imgs/bannerDesing/b-paulina.png",
    projectHref: "/design/atelie-paulina",
  },
  {
    name: "Identidade Visual - Guará Estúdio",
    image: "/imgs/bannerDesing/b-guara.png",
    projectHref: "/design/guara-estudio",
  },
  {
    name: "Landing Page - Umami Sushi",
    image: "/imgs/bannerDesing/b-umami.png",
    projectHref: "/design/umami",
  },
];

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
        <header className="mb-8 flex items-center lg:mb-28">
          <div className="relative shrink-0">
            <h2 className="relative z-10 text-[28px] font-semibold uppercase leading-none lg:text-[32px]">
              Projetos
            </h2>
            <Image
              src="/imgs/Star.png"
              alt=""
              aria-hidden
              width={90}
              height={90}
              className="pointer-events-none absolute left-full top-1/2 z-0 -ml-2 h-[52px] w-[52px] -translate-y-1/2 lg:-ml-3 lg:h-[80px] lg:w-[80px] lg:-translate-y-[65%]"
            />
          </div>
          <div className="ml-[18px] h-px flex-1 bg-[#5b7a8c] lg:ml-[75px]" />
        </header>

        <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.name} {...project} />
          ))}
        </div>
      </section>

      <Contact />
    </main>
  );
}