import StepCard from "../../../components/StepCard/StepCard";
import ProjectCard, {
  type ProjectCardProps,
} from "../../../components/ProjectCard/ProjectCard";
import Text from "@/src/components/Text/Text";
import Title from "@/src/components/Title/Title";
import StepGrid from "@/src/components/StepGrid/StepGrid";
import Image from "next/image";

const steps = [
  {
    title: "Alinhamento comercial",
    description:
      "Você me explica sobre seu negócio, por video chamada, mensagens ou áudios. :)",
  },
  {
    title: "Proposta comercial + Contrato",
    description:
      "O que te entregamos, como será nossa parceria, nosso fluxo de trabalho, prazos de entrega, valores e condições, junto com o contrato.",
  },
  {
    title: "Briefing",
    description:
      "É com ele que entendemos as reais necessidades do seu projeto e como iremos desenvolvê-lo.",
  },
  {
    title: "Desenvolvimento + Entrega",
    description:
      "Protótipo - Aprovação - Desenvolvimento de código - entrega :)",
  },
];

const projects: ProjectCardProps[] = [
  {
    name: "Mosaico",
    image: "/imgs/banner/b-mosaico.png",
    projectHref: "/projetos/mosaico",
    siteHref: "https://www.mosaicovitrinecultural.com/",
  },
  {
    name: "Pousada Alvorada",
    image: "/imgs/banner/b-pousada.png",
    projectHref: "/projetos/pousada-alvorada",
    siteHref: "https://exemplo.com.br",
  },
  {
    name: "Rooftop",
    image: "/imgs/banner/b-rooftop.png",
    projectHref: "/projetos/rooftop",
    siteHref: "https://rooftop-lemon.vercel.app/",
  },
  {
    name: "Cafeteria",
    image: "/imgs/banner/b-cafe.png",
    projectHref: "/projetos/cafeteria",
    siteHref: "https://exemplo.com.br",
  },
  {
    name: "Cocktail bar",
    image: "/imgs/banner/b-cocktail.png",
    projectHref: "/projetos/cocktail-bar",
    siteHref: "https://cocktail-bar-six.vercel.app/",
  },
  {
    name: "Umami Sushi",
    image: "/imgs/banner/b-umami.png",
    projectHref: "/projetos/umami",
    siteHref: "https://umamisushi-rust.vercel.app/",
  },
];

export default function WebDesign() {
  return (
    <main className="min-h-screen bg-[#f9fadb] text-black">
      {/* Título */}
      <section className="flex justify-center px-6 pb-24 pt-28">
        <h1 className="font-display text-7xl uppercase tracking-tight md:text-8xl">
          Webdesign
        </h1>
      </section>

      {/* Texto
          Mobile: bloco 1 sem borda + bloco 2 com borda vermelha.
          Desktop (md+): um bloco só com borda, na ordem original. */}
      <section className="px-5 pb-20 md:px-16">
        <div className="max-w-[1500px] text-[15px] leading-[18px] md:flex md:flex-col md:gap-5 md:border-l md:border-[#8b0000] md:py-2 md:pl-2">
          {/* Bloco 1 (mobile) */}
          <div className="flex flex-col gap-5 md:contents">
            <Text>
              Webdesign assim como toda sua Identidade Visual é mais do que
              estética. É um meio muito importante no processo de posicionar a
              sua marca para o público correto, comunicar com clareza quem você
              atende e qual seu diferencial de mercado.
            </Text>
            <Text>
              A presença online é indispensável, você já sabe disso, e garantir
              para seus clientes uma vitrine do seu trabalho como um website te
              coloca em grande vantagem no seu segmento. A pesquisa por
              profissionais e lugares no Google ainda hoje continua sendo maior
              do que qualquer outro meio.
            </Text>
            <Text className="md:order-1">
              Nossos códigos não são feitos com IA, WordPress ou Vibe Coding.
              Como o código é limpo, os robôs do Google conseguem ler a sua
              página com muito mais facilidade. O site ranqueia melhor nas
              pesquisas locais e você aparece antes que seus concorrentes nas
              pesquisas.{" "}
              <span className="ml-1 inline-block origin-bottom-left rotate-10 whitespace-nowrap align-baseline font-beth-ellen text-[12px] leading-none text-[#5b7a8c] sm:text-[16px]">
                = mais clientes :)
              </span>
            </Text>
          </div>

          {/* Bloco 2 (mobile) */}
          <div className="mt-24 flex flex-col gap-5 border-l border-[#8b0000] py-2 pl-2 md:contents">
            <Text className="font-semibold md:font-normal">
              Somos uma equipe de duas pessoas, cada uma especializada em uma
              área do desenvolvimento.
            </Text>
            <Text>
              Seu site será produzido pelas mãos de uma designer que irá
              estruturar toda a estética do seu projeto com técnicas de UX/UI,
              depois da sua aprovação ele será desenvolvido com código-puro por
              um programador especializado.
            </Text>
          </div>
        </div>
      </section>

      {/* Etapas */}
      <section className="border-y border-[#5b7a8c] px-6 py-32 lg:px-[70px]">
        <StepGrid steps={steps} />
      </section>

      {/* Projetos */}
      <section className="px-4 pb-24 pt-16 lg:px-[70px]">
        <header className="mb-24 text-center">
          <div className="relative inline-block">
            <Image
              src="/imgs/Star.png"
              alt=""
              aria-hidden
              width={100}
              height={100}
              className="pointer-events-none absolute right-0 top-1/2 z-0 h-23 w-23 rotate-20 translate-y-[-70%] translate-x-[65%]"
            />
            <h2 className="relative z-10 text-3xl font-semibold uppercase">
              Projetos
            </h2>
          </div>
          <Text className="mt-2 text-[15px] leading-[18px]">
            Desenvolvimento de Sites e Landing pages.
            <br />
            Clique para ver sites com links reais. :)
          </Text>
        </header>
        <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.name} {...project} />
          ))}
        </div>
      </section>
    </main>
  );
}