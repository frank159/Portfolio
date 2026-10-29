import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import Text from "@/src/components/Text/Text";
import Title from "@/src/components/Title/Title";
import Contact from "@/src/components/Contact/Contact";
import Carousel from "@/src/components/Carrocel/Carrocel";
import { Reveal, StarLine, StarMark } from "@/src/components/StarBorders/InView";

/* ---------- Caminhos das imagens (public/imgs/serigrafia) ---------- */
const BASE = "/imgs/serigrafia";
const PROCESS_IMAGES = [`${BASE}/s/s-img1.png`, `${BASE}/s/s-img2.png`];
const WOOD_IMAGE = `${BASE}/s7-img1.png`;
const PROFILE_IMAGE = `${BASE}/perfil.png`;

/* =====================================================================
 *  AJUSTES DAS IMAGENS — é só mexer aqui para testar
 * ===================================================================== */

/** Filtro de cor por cima de TODAS as imagens (inclusive carrosséis) */
const OVERLAY_COLOR = "#1B0000";
/** Intensidade do filtro: 0 = invisível, 1 = cor sólida */
const OVERLAY_OPACITY = 0.45;

/**
 * LARGURA e ALTURA de cada imagem, separadas, em classes Tailwind.
 * Os valores abaixo reproduzem os tamanhos ATUAIS (padrão).
 *
 *  width  -> "w-full", "w-[300px]", "max-w-[500px]", "w-[90%] sm:w-full"
 *  height -> hoje é uma proporção ("aspect-[4/5]" = a altura acompanha a largura).
 *            Para fixar a altura, troque pela altura: "h-[420px]" ou "h-[300px] lg:h-[520px]"
 *            (com altura definida a proporção deixa de valer)
 *
 * O prefixo "lg:" vale só para telas grandes; "sm:" a partir do tablet.
 */
const IMG_SIZE = {
    /** 2 fotos de "Entenda o processo" (cada uma) */
    process: { width: "w-full", height: "aspect-[4/5]" },
    /** foto da serigrafia em madeira */
    wood: { width: "-mx-4 lg:mx-0", height: "aspect-[16/7] lg:aspect-[21/8]" },
    /** foto de perfil */
    profile: { width: "w-[88px] lg:w-[200px]", height: "h-[200px] lg:h-[200px]" },
    /**
     * carrossel: "width" é a largura do carrossel inteiro (cada slide é 1 ou 2 por tela);
     * "height" é a altura de CADA foto dentro dele.
     */
    carousel: { width: "mx-auto w-[90%] sm:w-full sm:max-w-none", height: "aspect-[5/7]" },
};

/** Camada de cor sobre a imagem (o pai precisa ser "relative") */
function ImageOverlay() {
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundColor: OVERLAY_COLOR, opacity: OVERLAY_OPACITY }}
        />
    );
}

/** s1-img1.png ... s1-imgN.png */
const folderImages = (folder: string, count: number, alt: string) =>
    Array.from({ length: count }, (_, i) => ({
        src: `${BASE}/${folder}/${folder}-img${i + 1}.png`,
        alt: `${alt} - foto ${i + 1}`,
    }));

type Technique = {
    title: string;
    description: string;
    extra?: string;
    folder: string;
    count: number;
    alt: string;
};

const techniques: Technique[] = [
    {
        title: "Artes chapadas\ncores sólidas",
        description: "Artes sólidas, de uma ou várias cores.",
        extra: "Algodão Menegotti 30.1 Penteado.",
        folder: "s1",
        count: 7,
        alt: "Arte chapada estampada em serigrafia",
    },
    {
        title: "Quadricromias",
        description: "Para artes que possuem degradês, sombras e transições de cores.",
        folder: "s2",
        count: 6,
        alt: "Estampa em quadricromia",
    },
    {
        title: "Simulados",
        description:
            "Técnica utilizada para estampar ilustrações e artes que necessitam de cores e detalhes precisos.",
        folder: "s3",
        count: 5,
        alt: "Estampa simulada em serigrafia",
    },
    {
        title: "Tinta vinílica",
        description: "Serigrafia em chapa de alumínio.",
        folder: "s4",
        count: 2,
        alt: "Serigrafia com tinta vinílica em chapa de alumínio",
    },
    {
        title: "Tinta UV",
        description: "Tinta com cura Ultravioleta.",
        folder: "s5",
        count: 6,
        alt: "Serigrafia com tinta UV",
    },
    {
        title: "Braille com verniz UV",
        description:
            "Relevo para escrita em braille, feito com 9 demãos de verniz transparente.",
        folder: "s6",
        count: 3,
        alt: "Escrita em braille feita com verniz UV",
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
 * Só passamos tamanho aqui onde ele é DIFERENTE do padrão (o rótulo "Técnicas", 16px).
 */
const LABEL = "text-[16px] leading-none uppercase tracking-wide";

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

/** Linha de borda a borda com a estrela no meio (ignora o padding da seção) */
function StarDivider() {
    return (
        <Reveal
            aria-hidden
            className="-mx-4 flex items-center gap-5 lg:-mx-[max(70px,calc((100vw_-_1200px)/2))] lg:gap-8"
        >
            <StarLine side="left" className="flex-1" />
            <StarMark className="relative z-[1] block h-[30px] w-[30px] shrink-0 lg:h-[48px] lg:w-[48px]" />
            <StarLine side="right" className="flex-1" />
        </Reveal>
    );
}

export default function Serigrafia() {
    return (
        <main className="min-h-screen bg-[#f9fadb] text-black">
            {/* Título */}
            <section className="px-6 pb-16 pt-28 text-center lg:pb-24">
                <Title>Serigrafia</Title>
                <Text className="mx-auto mt-3 max-w-[22rem] sm:max-w-none">
                    Artes chapadas, quadricromias &amp; Similados.
                    <br />
                    Uniformes personalizados em algodão menegotti 30.1 penteado
                </Text>
            </section>

            {/* Entenda o processo */}
            <section className="px-4 pb-16 lg:px-[70px] lg:pb-28">
                <div className="mx-auto max-w-[1200px]">
                    <SectionHeader
                        title={
                            <>
                                Entenda o<br className="lg:hidden" /> processo
                            </>
                        }
                    />

                    <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-20">
                        <div className="flex flex-col gap-6">
                            <Text>
                                A serigrafia é uma das técnicas mais tradicionais, eficientes e
                                duradouras para a personalização. O processo consiste na
                                transferência de tinta para o tecido por meio de uma tela vazada,
                                garantindo uma aplicação precisa e de alta cobertura.
                            </Text>

                            <Text as="ul" className="list-disc space-y-4 pl-5">
                                {benefits.map((benefit) => (
                                    <Text as="li" key={benefit.title}>
                                        {benefit.title}: {benefit.text}
                                    </Text>
                                ))}
                            </Text>
                        </div>

                        <div className="grid grid-cols-2 gap-3 lg:gap-5">
                            {PROCESS_IMAGES.map((src, i) => (
                                <div
                                    key={src}
                                    className={`relative overflow-hidden ${IMG_SIZE.process.width} ${IMG_SIZE.process.height}`}
                                >
                                    <Image
                                        src={src}
                                        alt={`Processo de serigrafia - foto ${i + 1}`}
                                        fill
                                        sizes="(min-width: 1024px) 400px, 45vw"
                                        className="object-cover"
                                    />
                                    <ImageOverlay />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Técnicas */}
            <section className="overflow-x-clip px-4 pb-16 lg:px-[70px] lg:pb-24">
                <div className="mx-auto max-w-[1200px]">
                    <Reveal className="mb-3 flex items-center gap-3 lg:mb-5 lg:gap-4">
                        <Title
                            as="h2"
                            font="nunito"
                            weight="bold"
                            className={`shrink-0 ${LABEL}`}
                        >
                            Técnicas
                        </Title>
                        <StarLine side="grow" className="-mr-4 flex-1 lg:-mr-[max(70px,calc((100vw_-_1200px)/2))]" />
                    </Reveal>

                    {techniques.map((technique, i) => (
                        <Fragment key={technique.title}>
                            {i > 0 && <StarDivider />}

                            <article className="py-10 lg:py-14">
                                <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
                                    <div className="text-center lg:pt-2 lg:text-left">
                                        <Title
                                            as="h3"
                                            font="nunito"
                                            weight="bold"
                                            className="whitespace-pre-line uppercase"
                                        >
                                            {technique.title}
                                        </Title>
                                        <Text className="mx-auto mt-2 max-w-[20rem] lg:mx-0">
                                            {technique.description}
                                        </Text>
                                        {technique.extra && (
                                            <Text className="mx-auto mt-3 max-w-[20rem] lg:mx-0">
                                                {technique.extra}
                                            </Text>
                                        )}
                                    </div>

                                    <Carousel
                                        images={folderImages(
                                            technique.folder,
                                            technique.count,
                                            technique.alt,
                                        )}
                                        label={`Galeria: ${technique.title.replace("\n", " ")}`}
                                        className={IMG_SIZE.carousel.width}
                                        overlayColor={OVERLAY_COLOR}
                                        overlayOpacity={OVERLAY_OPACITY}
                                        slideClassName={IMG_SIZE.carousel.height}
                                    />
                                </div>
                            </article>
                        </Fragment>
                    ))}

                    <StarDivider />

                    {/* Serigrafia em madeira: imagem única, em largura total */}
                    <article className="pt-10 lg:pt-14">
                        <div className="text-center lg:text-left">
                            <Title
                                as="h3"
                                font="nunito"
                                weight="bold"
                                className="uppercase"
                            >
                                Serigrafia em madeira
                            </Title>
                            <Text className="mt-2">Caixas de MDF.</Text>
                        </div>

                        <div className={`relative mt-6 overflow-hidden lg:mt-10 ${IMG_SIZE.wood.width} ${IMG_SIZE.wood.height}`}>
                            <Image
                                src={WOOD_IMAGE}
                                alt="Caixas de MDF estampadas em serigrafia"
                                fill
                                sizes="(min-width: 1280px) 1200px, 100vw"
                                className="object-cover"
                            />
                            <ImageOverlay />
                        </div>
                    </article>
                </div>
            </section>

            {/* Sobre */}
            <section className="px-6 pb-16 lg:px-[70px] lg:pb-28">
                <div className="mx-auto flex max-w-[1000px] flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-16">
                    <div className="flex shrink-0 flex-col items-center gap-2">
                        <div className="relative h-[88px] w-[88px] overflow-hidden rounded-full lg:h-[200px] lg:w-[200px]">
                            <Image
                                src={PROFILE_IMAGE}
                                alt="Vitória Carvalho"
                                fill
                                sizes="(min-width: 1024px) 200px, 88px"
                                className="object-cover"
                            />
                            <ImageOverlay />
                        </div>
                        {/* span simples: a fonte script não deve receber o font-sans do Text */}
                        <span className="font-beth-ellen -rotate-5 text-[16px] leading-none text-[#5a7a8a]">
                            Vitória Carvalho :)
                        </span>
                    </div>

                    <div className="flex flex-col gap-4 text-left">
                        <Text>
                            Já estampei diversos tipos de materiais, atendi empresas como O
                            Boticário, McDonalds, trabalhei com técnicas básicas e avançadas.
                        </Text>
                        <Text>
                            Fui formada por uma das maiores referências da serigrafia no
                            Brasil, o mestre Rafael Roan, onde consolidei meu compromisso
                            inegociável com a técnica, precisão e qualidade.
                        </Text>
                        <Text>
                            Designer Gráfica, Designer Web, Arte Finalista e Serígrafa com 8
                            anos de experiência em estamparia e comunicação visual, ajudo
                            empresas e marcas a se posicionar no mercado com identidade,
                            estilo e técnica.
                        </Text>
                    </div>
                </div>
            </section>

            <Contact />
        </main>
    );
}