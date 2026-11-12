import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Text from "@/src/components/Text/Text";
import Title from "@/src/components/Title/Title";
import Contact from "@/src/components/Contact/Contact";
import Carousel from "@/src/components/Carrocel/Carrocel";
import { Reveal, StarLine, StarMark } from "@/src/components/StarBorders/InView";

/* ---------- Caminhos das imagens (public/imgs/serigrafia) ---------- */
const BASE = "/imgs/serigrafia";
const BANNER_IMAGE = `${BASE}/Banner/CapaSilk.png`;
const PROCESS_IMAGES = [`${BASE}/Geral/s-img1.jpeg`, `${BASE}/Geral/s-img2.jpeg`];
const WOOD_IMAGE = `${BASE}/Geral/s7-img1.jpeg`;
const PROFILE_IMAGE = `${BASE}/Geral/perfil.jpeg`;

/**
 * Tamanhos das imagens. O que NÃO tem prefixo "lg:" é o mobile (não mexi).
 * O que tem "lg:" é o desktop, ajustado para bater com a referência.
 */
const IMG_SIZE = {
    /** 2 fotos de "Entenda o processo" (cada uma) */
    process: { width: "w-full", height: "aspect-[4/5] lg:aspect-[3/4]" },
    /** foto da serigrafia em madeira (mobile: faixa larga | desktop: retrato igual aos outros cards) */
    wood: { width: "-mx-4 lg:mx-0", height: "aspect-[16/7] lg:aspect-[5/7]" },
    /** foto de perfil (no PDF ela tem ~132px no desktop) */
    profile: { width: "w-[88px] lg:w-[132px]", height: "h-[88px] lg:h-[132px]" },
    /**
     * carrossel: "width" é a largura do carrossel inteiro (cada slide é 1 ou 2 por tela);
     * "height" é a altura de CADA foto dentro dele.
     */
    carousel: { width: "mx-auto w-[90%] sm:w-full sm:max-w-none", height: "aspect-[5/7]" },
};

/** Entrelinha do texto no desktop (no PDF as linhas são bem coladas: ~18px). O tamanho vem do <Text>. */
const BODY = "lg:leading-[18px]";

/** s1-img1.jpeg ... s1-imgN.jpeg */
const folderImages = (
    folder: string,
    prefix: string,
    count: number,
    alt: string,
    extensions: string[] = ["jpeg"] // <-- Adicione este parâmetro
) =>
    Array.from({ length: count }, (_, i) => {
        // Pega a extensão correspondente ou repete a última
        const ext = extensions[i] || extensions[extensions.length - 1] || "jpeg";
        return {
            src: `${BASE}/${folder}/${prefix}-img${i + 1}.${ext}`,
            alt: `${alt} - mídia ${i + 1}`,
        };
    });

type TechniqueBase = {
    title: string;
    /** 2ª linha do título: aparece só no mobile (no desktop o título fica em uma linha, como na referência) */
    mobileTitleExtra?: string;
    description: string;
    extra?: string;
    alt: string;
    /** posição no mobile. No desktop vale a ordem do array (= ordem da referência) */
    mobileOrder?: string;
};
type Gallery = TechniqueBase & { folder: string; prefix: string; count: number, extensions?: string[]; };
type Single = TechniqueBase & { image: string };
type Technique = Gallery | Single;

/**
 * Ordem do array = ordem da referência no desktop:
 * linha 1: Chapadas, Quadricromias, Simulados, Vinílica
 * linha 2: Braille, Madeira, UV
 * No mobile a ordem original é mantida via `mobileOrder` (UV → Braille → Madeira no fim).
 */
const techniques: Technique[] = [
    {
        title: "Artes chapadas",
        mobileTitleExtra: "cores sólidas",
        description: "Artes sólidas, de uma ou várias cores.",
        extra: "Algodão Menegotti 30.1 Penteado.",
        folder: "artsChapadas",
        prefix: "s1",
        count: 7,
        alt: "Arte chapada estampada em serigrafia",
    },
    {
        title: "Quadricromias",
        description: "Para artes que possuem degradês, sombras e transições de cores.",
        folder: "Quadricromia",
        prefix: "s2",
        count: 5,
        alt: "Estampa em quadricromia",
    },
    {
        title: "Simulados",
        description:
            "Técnica utilizada para estampar ilustrações e artes que necessitam de cores e detalhes precisos.",
        folder: "Simulado",
        prefix: "s3",
        count: 5,
        alt: "Estampa simulada em serigrafia",
    },
    {
        title: "Tinta vinílica",
        description: "Serigrafia em chapa de alumínio.",
        folder: "Vinilica",
        prefix: "s4",
        count: 2,
        alt: "Serigrafia com tinta vinílica em chapa de alumínio",
    },
    {
        title: "Braille com verniz UV",
        description:
            "Relevo para escrita em braille, feito com 9 demãos de verniz transparente.",
        folder: "UvVerniz",
        prefix: "s6",
        count: 3,
        extensions: ["mp4", "jpeg", "jpeg"], // <-- Adicione isso aqui!
        alt: "Escrita em braille feita com verniz UV",
        mobileOrder: "order-2",
    },
    {
        title: "Serigrafia em madeira",
        description: "Caixas de MDF.",
        extra: "Tinta à base d'água.",
        image: WOOD_IMAGE,
        alt: "Caixas de MDF estampadas em serigrafia",
        mobileOrder: "order-3",
    },
    {
        title: "Tinta UV",
        description: "Tinta com cura Ultravioleta.",
        folder: "Uv",
        prefix: "s5",
        count: 6,
        alt: "Serigrafia com tinta UV",
        mobileOrder: "order-1",
    },
];

const benefits = [
    {
        title: "Alta Durabilidade",
        text: "As estampas resistem a constantes ciclos de lavagem e ao desgaste do uso diário, mantendo as cores vivas por muito mais tempo.",
    },
    {
        title: "Fidelidade de Cores",
        text: "Permite a aplicação exata da identidade visual da marca sobre tecidos claros ou escuros.",
    },
];

/**
 * Tamanhos: o padrão vem dos componentes.
 *  - Text:  16px / 24px
 *  - Title: h1 = text-6xl md:text-8xl | h2, h3... = 24px
 * O tamanho da fonte vem do componente <Title>.
 */
const LABEL = "leading-none uppercase tracking-wide";

/** Cabeçalho "Entenda o processo" — só mobile (no desktop entra o rótulo SILKSCREEN + título grande) */
function SectionHeader({ title }: { title: ReactNode }) {
    return (
        <Reveal>
            <header className="relative mb-8 flex items-center">
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

                <div className="absolute left-1/2 top-1/2 z-[1] h-0 w-0">
                    <StarMark className="pointer-events-none absolute left-0 top-0 block h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* a linha nasce do centro da estrela e corre para a direita */}
                <div className="absolute left-1/2 right-0 top-1/2 -translate-y-1/2">
                    <StarLine side="grow" className="w-full" />
                </div>
            </header>
        </Reveal>
    );
}

/** Linha de borda a borda com a estrela no meio — só mobile (no desktop os cards ficam em grade, sem divisores) */
function StarDivider({ className = "" }: { className?: string }) {
    return (
        <Reveal aria-hidden className={`-mx-4 flex items-center gap-5 ${className}`}>
            <StarLine side="left" className="flex-1" />
            <StarMark className="relative z-[1] block h-[30px] w-[30px] shrink-0" />
            <StarLine side="right" className="flex-1" />
        </Reveal>
    );
}

/**
 * Selo circular "GUARÁ ESTÚDIO" do hero (só desktop).
 * Se você já tem esse selo como componente/SVG no projeto, troque este <Badge /> por ele.
 */
function Badge({ className = "" }: { className?: string }) {
    return (
        <div
            role="img"
            aria-label="Guará Estúdio"
            className={className}
            style={{
                backgroundColor: "#910100",
                mask: "url('/logo/logoCarimbo.png') center / contain no-repeat",
                WebkitMask: "url('/logo/logoCarimbo.png') center / contain no-repeat",
            }}
        />
    );
}

export default function Serigrafia() {
    return (
        <main className="min-h-screen bg-[#f9fadb] text-black">
            {/* Banner da pré-venda + botão da loja (o pt libera o espaço do menu fixo) */}
            <section>
                <div className="relative">
                    <Image
                        src={BANNER_IMAGE}
                        alt="Pré-venda Guará Estúdio: novembro todo com 40% off"
                        width={1920}
                        height={730}
                        priority
                        sizes="100vw"
                        className="h-auto w-full"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#f9fadb]"
                    />
                </div>
                <div className="flex justify-center px-6 pt-6 lg:pt-10">
                    <Link
                        href="/loja"
                        className="border border-black px-7 py-2 text-[13px] uppercase leading-none transition-colors hover:bg-black hover:text-[#f9fadb]"
                    >
                        Acesse a loja
                    </Link>
                </div>
            </section>

            {/* Título: centralizado no mobile | à esquerda + selo à direita no desktop */}
            <section className="px-6 pb-16 pt-14 text-center lg:flex lg:items-center lg:justify-between lg:overflow-x-clip lg:px-[4vw] lg:pb-24 lg:pt-24 lg:text-left">
                <div>
                    <Title className="lg:text-left">Serigrafia</Title>
                    <Text
                        className={`mx-auto mt-3 max-w-[22rem] sm:max-w-none lg:mx-0 ${BODY}`}
                    >
                        Artes chapadas, quadricromias &amp; Similados.
                        <br />
                        Uniformes personalizados em algodão menegotti 30.1 penteado
                    </Text>
                    {/* botão só no desktop (como na referência) — aponta para a seção de contato */}
                    <a
                        href="#contato"
                        className="mt-5 hidden border border-[#5a7a8a]/60 px-5 py-2 text-[15px] leading-none text-[#5a7a8a] transition-colors hover:bg-[#5a7a8a] hover:text-[#f9fadb] lg:inline-block"
                    >
                        Entrar em contato
                    </a>
                </div>

                <Badge className="hidden h-[252px] w-[252px] shrink-0 lg:-mr-[7vw] lg:block lg:translate-x-4" />
            </section>

            {/* Entenda o processo */}
            <section className="px-4 pb-16 lg:pb-24 lg:pl-[4.2vw] lg:pr-[6vw]">
                {/* mobile */}
                <div className="lg:hidden">
                    <SectionHeader
                        title={
                            <>
                                Entenda o<br /> processo
                            </>
                        }
                    />
                </div>

                {/* desktop: rótulo SILKSCREEN + estrela + linha até a borda direita */}
                <Reveal className="hidden lg:-ml-[4.2vw] lg:-mr-[6vw] lg:mb-16 lg:flex lg:items-center lg:pl-5">
                    <Title
                        as="h2"
                        font="nunito"
                        weight="semibold"
                        className="shrink-0 uppercase lg:text-[32px]"
                    >
                        Silkscreen
                    </Title>
                    <StarMark className="relative z-[1] ml-2 block h-[90px] w-[90px] shrink-0" />
                    <StarLine side="grow" className="-ml-[45px] flex-1" />
                </Reveal>

                <div className="grid gap-8 lg:grid-cols-[53fr_40fr] lg:items-center lg:gap-x-[7%]">
                    <div className="flex flex-col gap-6 lg:gap-4">
                        {/* título grande e apagado — só desktop */}
                        <Title
                            as="h2"
                            className="hidden uppercase text-[#d8dab4] lg:mb-5 lg:block lg:text-[68px] lg:leading-none"
                        >
                            Entenda o processo.
                        </Title>

                        <Text className={BODY}>
                            A serigrafia é uma das técnicas mais tradicionais, eficientes e
                            duradouras para a personalização. O processo consiste na
                            transferência de tinta para o tecido por meio de uma tela vazada,
                            garantindo uma aplicação precisa e de alta cobertura.
                        </Text>

                        <Text as="ul" className={`list-disc space-y-4 pl-5 ${BODY}`}>
                            {benefits.map((benefit) => (
                                <Text as="li" key={benefit.title} className={BODY}>
                                    {benefit.title}: {benefit.text}
                                </Text>
                            ))}
                        </Text>
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:gap-[18px]">
                        {PROCESS_IMAGES.map((src, i) => (
                            <div
                                key={src}
                                className={`relative overflow-hidden ${IMG_SIZE.process.width} ${IMG_SIZE.process.height}`}
                            >
                                <Image
                                    src={src}
                                    alt={`Processo de serigrafia - foto ${i + 1}`}
                                    fill
                                    sizes="(min-width: 1024px) 20vw, 45vw"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Técnicas */}
            <section className="overflow-x-clip px-4 pb-16 lg:px-[6.5vw] lg:pb-40">
                {/* rótulo "Técnicas": no desktop sai da margem e vai de borda a borda */}
                <Reveal className="mb-3 flex items-center gap-3 lg:-ml-[6.5vw] lg:mb-[132px] lg:gap-5 lg:pl-3">
                    <Title
                        as="h2"
                        font="nunito"
                        weight="bold"
                        className={`shrink-0 ${LABEL}`}
                    >
                        Técnicas
                    </Title>
                    <StarLine side="grow" className="-mr-4 flex-1 lg:-mr-[6.5vw]" />
                </Reveal>

                {/* mobile: lista vertical com divisores | desktop: grade de 4 colunas */}
                <div className="flex flex-col lg:grid lg:grid-cols-4 lg:items-start lg:gap-x-[7.85%] lg:gap-y-[100px]">
                    {techniques.map((technique, i) => (
                        <article
                            key={technique.title}
                            className={`${technique.mobileOrder ?? ""} lg:order-none`}
                        >
                            {i > 0 && <StarDivider className="lg:hidden" />}

                            <div
                                className={
                                    "image" in technique
                                        ? "pt-10 lg:pt-0"
                                        : "py-10 lg:py-0"
                                }
                            >
                                {/* min-h: todos os cabeçalhos da linha ficam com a mesma altura, então as fotos alinham */}
                                <div className="text-center lg:min-h-[103px] lg:border-l-2 lg:border-black/15 lg:pl-[22px] lg:text-left">
                                    <Title
                                        as="h3"
                                        font="nunito"
                                        weight="bold"
                                        className="uppercase lg:leading-tight 2xl:whitespace-nowrap"
                                    >
                                        {technique.title}
                                        {technique.mobileTitleExtra && (
                                            <span className="lg:hidden">
                                                <br />
                                                {technique.mobileTitleExtra}
                                            </span>
                                        )}
                                    </Title>
                                    <Text
                                        className={`mx-auto mt-2 max-w-[20rem] lg:mx-0 ${BODY}`}
                                    >
                                        {technique.description}
                                    </Text>
                                    {technique.extra && (
                                        <Text
                                            className={`mx-auto mt-3 max-w-[20rem] lg:mx-0 lg:mt-2 ${BODY}`}
                                        >
                                            {technique.extra}
                                        </Text>
                                    )}
                                </div>

                                {"image" in technique ? (
                                    <div
                                        className={`relative mt-6 overflow-hidden lg:mt-5 ${IMG_SIZE.wood.width} ${IMG_SIZE.wood.height}`}
                                    >
                                        <Image
                                            src={technique.image}
                                            alt={technique.alt}
                                            fill
                                            sizes="(min-width: 1024px) 20vw, 100vw"
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <Carousel
                                        images={folderImages(
                                            technique.folder,
                                            technique.prefix,
                                            technique.count,
                                            technique.alt,
                                            technique.extensions // <-- Passe isso aqui
                                        )}
                                        label={`Galeria: ${technique.title}`}
                                        className={`mt-6 lg:mt-5 ${IMG_SIZE.carousel.width}`}
                                        slideClassName={IMG_SIZE.carousel.height}
                                        slidesFromLg={1}
                                    />
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Sobre + Contato: empilhados no mobile | lado a lado no desktop, com linha no topo */}
            <div className="lg:flex lg:items-stretch lg:border-t lg:border-black/15 lg:px-[5vw]">
                {/* Sobre + Contato num só bloco: o Contact ativa o modo perfil quando recebe `profile` */}
                <div id="contato" className="scroll-mt-24 lg:border-t lg:border-black/15">
                    <Contact
                        profile={{
                            image: PROFILE_IMAGE,
                            name: "Vitória Carvalho :)",
                            alt: "Vitória Carvalho",
                            greeting: "Olá ;)",
                            paragraphs: [
                                "Já estampei diversos tipos de materiais, atendi empresas como O Boticário, McDonalds, trabalhei com técnicas básicas e avançadas.",
                                "Fui formada por uma das maiores referências da serigrafia no Brasil, o mestre Rafael Roan, onde consolidei meu compromisso inegociável com a técnica, precisão e qualidade.",
                                "Designer Gráfica, Designer Web, Arte Finalista e Serígrafa com 8 anos de experiência em estamparia e comunicação visual, ajudo empresas e marcas a se posicionar no mercado com identidade, estilo e técnica.",
                            ],
                        }}
                    />
                </div>
            </div>
        </main>
    );
}