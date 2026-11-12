import Image from "next/image";
import type { ReactNode } from "react";
import Text from "@/src/components/Text/Text";
import Title from "@/src/components/Title/Title";
import Contact from "@/src/components/Contact/Contact";
import ProjectCard, {
  type ProjectCardProps,
} from "@/src/components/ProjectCard/ProjectCard";
import { Reveal, StarLine, StarMark } from "@/src/components/StarBorders/InView";
import StepGrid from "@/src/components/StepGrid/StepGrid";

const oncaImages = Array.from({ length: 9 }, (_, i) =>
  encodeURI(`/imgs/design/onca/onca${i + 1}.jpg`),
);

const paulinaImages = Array.from({ length: 17 }, (_, i) =>
  encodeURI(`/imgs/design/ateliePaulina/paulina atelie${i + 1}.jpg`),
);

const guaraPortifolioImages = Array.from({ length: 10 }, (_, i) =>
  encodeURI(`/imgs/design/guaraPortifolio/manual de marca guara${i + 1}.jpg`),
);

const cookctailBarfolioImages = Array.from({ length: 7 }, (_, i) =>
  encodeURI(`/imgs/design/cookctailBar/cookctailBar${i + 1}.jpg`),
);

/* Ordem e nomes iguais ao PDF de referência */
const projects: ProjectCardProps[] = [
  {
    name: "Identidade Visual - Em Terra de Onça",
    image: "/imgs/bannerDesing/b-onca.jpg",
    images: oncaImages,
  },
  {
    name: "Identidade Visual - Paulina Ateliê",
    image: "/imgs/bannerDesing/b-paulina.png",
    images: paulinaImages,
  },
  {
    name: "Identidade Visual - Guará Estúdio",
    image: "/imgs/bannerDesing/b-guara.png",
    images: guaraPortifolioImages,
  },
  {
    name: "Carta de drinks - Cocktail Bar",
    image: "/imgs/design/cookctailBar/cookctailBar1.jpg",
    images: cookctailBarfolioImages,
  }
];

const steps = [
  {
    title: "Alinhamento comercial",
    description: "voce me explica sobre seu negócio, por video chamada, mensagens ou áudios. :)",
  },
  {
    title: "Proposta comercial + Contrato",
    description: "O que te entregamos, como será nossa parceria, nosso fluxo de trabalho, prazos de entrega, valores e condições, junto com o contrato.",
  },
  {
    title: "Briefing",
    description: "É com ele que entendemos as reais necessidades do seu projeto e como iremos desenvolvê-lo.",
  },
  {
    title: "Desenvolvimento + Entrega",
    description: "Protótipo - Aprovação - Desenvolvimento de código - entrega :)",
  },
];

function SectionHeader({ title }: { title: ReactNode }) {
  return (
    <Reveal>
      <header className="mb-8 flex items-center lg:mb-16">
        {/* Título */}
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

        {/* Estrela grudada no texto e no início da linha */}
        <div className="relative z-10 shrink-0 ml-3 lg:ml-5">
          <StarMark className="pointer-events-none block h-[52px] w-[52px] lg:h-[90px] lg:w-[90px]" />
        </div>

        {/* Linha que nasce do centro da estrela e vai até o fim */}
        <div className="flex-1 -ml-[26px] lg:-ml-[45px]">
          <StarLine side="grow" className="w-full" />
        </div>
      </header>
    </Reveal>
  );
}

function ProcessSteps() {
  return (
    <section className="px-6 pb-16 lg:px-[52px] lg:pb-20">
      <Title
        as="h1"
        className="mb-8 font-display text-5xl text-black/[0.12] [font-variant-caps:small-caps] lg:mb-16 lg:text-[64px]"
      >
        Processo de desenvolvimento.
      </Title>
      <StepGrid steps={steps} />
    </section>
  );
}

export default function Design() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f9fadb] text-black">
      {/* Carimbo cortado no canto superior direito (só desktop) */}
      <Image
        src="/imgs/GuaraCarinbo.png"
        alt=""
        aria-hidden
        width={150}
        height={150}
        className="pointer-events-none absolute right-[-14px] top-[100px] hidden lg:block"
      />

      {/* Título */}
      <section className="px-6 pb-20 pt-28 text-center lg:pb-36">
        <Title as="h1">
          Design
        </Title>
        <Text className="mx-auto mt-3 max-w-[22rem] leading-[18px] sm:max-w-none">
          Design Gráfico, Identidade visual, materiais para impressão,
          fechamento de arquivos.
        </Text>
      </section>

      <ProcessSteps />

      {/* Projetos */}
      <section className="pb-24 pt-8 lg:pt-12">
        {/* sem padding direito no desktop: a linha vai até a borda da tela */}
        <div className="px-4 lg:pl-[52px] lg:pr-0">
          <SectionHeader title="Projetos" />
        </div>

        <div className="flex flex-wrap justify-center gap-x-[24px] gap-y-10 px-4 lg:gap-y-[30px] lg:px-[60px]">
          {projects.map((project) => (
            <div
              key={project.name}
              className="w-full sm:w-[calc((100%_-_24px)/2)] lg:w-[calc((100%_-_96px)/5)]"
            >
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </section>

      <Contact />
    </main>
  );
}