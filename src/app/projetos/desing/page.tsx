import Image from "next/image";
import Link from "next/link";
import Text from "@/src/components/Text/Text";

type DesignProject = {
  title: string;
  image: string;
  href: string;
};

const projects: DesignProject[] = [
  {
    title: "Identidade Visual - Mosaico Cultural",
    image: "/imgs/design/d-mosaico.png",
    href: "/design/mosaico",
  },
  {
    title: "Manual de Marca - Ateliê Paulina",
    image: "/imgs/design/d-paulina.png",
    href: "/design/atelie-paulina",
  },
  {
    title: "Identidade Visual - Guará Estúdio",
    image: "/imgs/design/d-guara.png",
    href: "/design/guara-estudio",
  },
  {
    title: "Landing Page - Umami Sushi",
    image: "/imgs/design/d-umami.png",
    href: "/design/umami",
  },
];

function DesignCard({ title, image, href }: DesignProject) {
  return (
    <Link
      href={href}
      className="block overflow-hidden rounded-[6px] border border-[#8b0000] lg:rounded-none"
    >
      <div className="relative aspect-[4/3] w-full border-b border-[#8b0000] sm:aspect-[8/5]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex items-center gap-3 px-3 py-3">
        <Image
          src="/imgs/Star.png"
          alt=""
          aria-hidden
          width={24}
          height={24}
          className="h-6 w-6 shrink-0"
        />
        <span className="text-[16px] leading-tight">{title}</span>
      </div>
    </Link>
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
              className="pointer-events-none absolute left-full top-1/2 z-0 -ml-3 h-[90px] w-[90px] -translate-y-1/2"
            />
          </div>
          <div className="ml-[75px] h-px flex-1 bg-[#5b7a8c] lg:bg-black" />
        </header>

        <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <DesignCard key={project.title} {...project} />
          ))}
        </div>
      </section>
    </main>
  );
}