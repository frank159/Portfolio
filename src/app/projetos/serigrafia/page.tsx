import type { ReactNode } from "react";
import Image from "next/image";
import Text from "@/src/components/Text/Text";
import Contact from "@/src/components/Contact/Contact";
import Carousel from "@/src/components/Carrocel/Carrocel";

/* ---------- Caminhos das imagens (public/imgs/serigrafia) ---------- */
const BASE = "/imgs/serigrafia";
const PROCESS_IMAGES = [`${BASE}/s/s-img1.png`, `${BASE}/s/s-img2.png`];
const WOOD_IMAGE = `${BASE}/s7-img1.png`;
const PROFILE_IMAGE = `${BASE}/perfil.png`;

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

const BODY = "text-[14px] leading-[19px] lg:text-[17px] lg:leading-[26px]";

function SectionHeader({ title }: { title: ReactNode }) {
    return (
        <header className="mb-8 flex items-center lg:mb-16">
            <div className="relative shrink-0">
                <h2 className="relative z-10 text-[28px] font-semibold uppercase leading-none lg:text-[32px]">
                    {title}
                </h2>
                <Image
                    src="/imgs/Star.png"
                    alt=""
                    aria-hidden
                    width={90}
                    height={90}
                    className="pointer-events-none absolute left-full top-1/2 z-0 -ml-2 h-[52px] w-[52px] -translate-y-1/2 lg:-ml-3 lg:h-[90px] lg:w-[90px] lg:-translate-y-[65%]"
                />
            </div>
            <div className="ml-[18px] h-px flex-1 bg-[#5b7a8c] lg:ml-0" />
        </header>
    );
}

export default function Serigrafia() {
    return (
        <main className="min-h-screen bg-[#f9fadb] text-black">
            {/* Título */}
            <section className="px-6 pb-16 pt-28 text-center lg:pb-24">
                <h1 className="font-display text-6xl uppercase tracking-tight md:text-8xl">
                    Serigrafia
                </h1>
                <Text className="mx-auto mt-3 max-w-[22rem] text-[15px] leading-[18px] sm:max-w-none">
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
                            <Text className={BODY}>
                                A serigrafia é uma das técnicas mais tradicionais, eficientes e
                                duradouras para a personalização. O processo consiste na
                                transferência de tinta para o tecido por meio de uma tela vazada,
                                garantindo uma aplicação precisa e de alta cobertura.
                            </Text>

                            <ul className={`list-disc space-y-4 pl-5 ${BODY}`}>
                                {benefits.map((benefit) => (
                                    <li key={benefit.title}>
                                        {benefit.title}: {benefit.text}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-3 lg:gap-5">
                            {PROCESS_IMAGES.map((src, i) => (
                                <div
                                    key={src}
                                    className="relative aspect-[4/5] overflow-hidden"
                                >
                                    <Image
                                        src={src}
                                        alt={`Processo de serigrafia - foto ${i + 1}`}
                                        fill
                                        sizes="(min-width: 1024px) 400px, 45vw"
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Técnicas */}
            <section className="px-4 pb-16 lg:px-[70px] lg:pb-24">
                <div className="mx-auto max-w-[1200px]">
                    <h2 className="mb-3 text-[12px] font-medium uppercase tracking-wide lg:mb-5 lg:text-[14px]">
                        Técnicas
                    </h2>

                    {techniques.map((technique) => (
                        <article
                            key={technique.title}
                            className="border-t border-[#5b7a8c] py-10 lg:py-14"
                        >
                            <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
                                <div className="text-center lg:pt-2 lg:text-left">
                                    <h3 className="whitespace-pre-line text-[17px] font-bold uppercase leading-[21px] lg:text-[22px] lg:leading-[26px]">
                                        {technique.title}
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-[17rem] text-[12px] leading-[16px] lg:mx-0 lg:text-[15px] lg:leading-[20px]">
                                        {technique.description}
                                    </p>
                                    {technique.extra && (
                                        <p className="mx-auto mt-3 max-w-[17rem] text-[12px] leading-[16px] lg:mx-0 lg:text-[15px] lg:leading-[20px]">
                                            {technique.extra}
                                        </p>
                                    )}
                                </div>

                                <Carousel
                                    images={folderImages(
                                        technique.folder,
                                        technique.count,
                                        technique.alt,
                                    )}
                                    label={`Galeria: ${technique.title.replace("\n", " ")}`}
                                    className="mx-auto w-[78%] max-w-[340px] sm:w-full sm:max-w-none"
                                />
                            </div>
                        </article>
                    ))}

                    {/* Serigrafia em madeira: imagem única, em largura total */}
                    <article className="border-t border-[#5b7a8c] pt-10 lg:pt-14">
                        <div className="text-center lg:text-left">
                            <h3 className="text-[17px] font-bold uppercase leading-[21px] lg:text-[22px] lg:leading-[26px]">
                                Serigrafia em madeira
                            </h3>
                            <p className="mt-2 text-[12px] leading-[16px] lg:text-[15px] lg:leading-[20px]">
                                Caixas de MDF.
                            </p>
                        </div>

                        <div className="relative -mx-4 mt-6 aspect-[16/7] overflow-hidden lg:mx-0 lg:mt-10 lg:aspect-[21/8]">
                            <Image
                                src={WOOD_IMAGE}
                                alt="Caixas de MDF estampadas em serigrafia"
                                fill
                                sizes="(min-width: 1280px) 1200px, 100vw"
                                className="object-cover"
                            />
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
                        </div>
                        <span className="font-beth-ellen text-[26px] leading-none text-[#7D0103] lg:text-[32px]">
                            Vitória Carvalho :)
                        </span>
                    </div>

                    <div className={`flex flex-col gap-4 text-left ${BODY}`}>
                        <p>
                            Já estampei diversos tipos de materiais, atendi empresas como O
                            Boticário, McDonalds, trabalhei com técnicas básicas e avançadas.
                        </p>
                        <p>
                            Fui formada por uma das maiores referências da serigrafia no
                            Brasil, o mestre Rafael Roan, onde consolidei meu compromisso
                            inegociável com a técnica, precisão e qualidade.
                        </p>
                        <p>
                            Designer Gráfica, Designer Web, Arte Finalista e Serígrafa com 8
                            anos de experiência em estamparia e comunicação visual, ajudo
                            empresas e marcas a se posicionar no mercado com identidade,
                            estilo e técnica.
                        </p>
                    </div>
                </div>
            </section>

            <Contact />
        </main>
    );
}