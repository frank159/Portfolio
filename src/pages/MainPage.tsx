"use client";

import { Fragment, useState, useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useMotionValue, animate, MotionConfig, type Variants } from "framer-motion";
import Link from "next/link";

const BG = "#FAFADC";
const BLUE = "#5a7a8a";
const RED = "#8b0000";

const PROJECTS = [
    { label: "Website", href: "/web-site" },
    { label: "Design", href: "/design" },
    { label: "Serigrafia", href: "/serigrafia" },
    { label: "Tecnologia", href: "/desenvolvimento" },
];

/* ==========================================================================
   ANIMAÇÃO — tokens compartilhados
   ========================================================================== */

// Curva "easeOutExpo" suave: arranca rápido e assenta devagar.
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Dispara quando o elemento entra um pouco acima da borda inferior da tela.
const VIEW = { once: true, margin: "0px 0px -8% 0px" } as const;
// Para elementos colados no fim da página (contato/rodapé), que nunca subiriam 8%.
const VIEW_END = { once: true, margin: "0px" } as const;

/** Bloco genérico: sobe/desliza + desfoca → nítido. */
function Reveal({
    children,
    className,
    style,
    delay = 0,
    x = 0,
    y = 28,
    blur = 6,
    duration = 0.85,
    last = false,
}: {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    delay?: number;
    x?: number;
    y?: number;
    blur?: number;
    duration?: number;
    last?: boolean;
}) {
    return (
        <motion.div
            className={className}
            style={style}
            initial={{ opacity: 0, x, y, filter: `blur(${blur}px)` }}
            whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
            viewport={last ? VIEW_END : VIEW}
            transition={{ duration, delay, ease: EASE }}
        >
            {children}
        </motion.div>
    );
}

/** Linha divisória que "se desenha" da esquerda para a direita. */
function Rule({ color, delay = 0 }: { color: string; delay?: number }) {
    return (
        <motion.hr
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={VIEW}
            transition={{ duration: 1.1, delay, ease: EASE }}
            style={{ borderColor: color, originX: 0 }}
        />
    );
}

const wordVariants: Variants = {
    hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

/** Parágrafo que entra palavra por palavra (respeita \n como quebra de linha). */
function Words({
    text,
    className,
    delay = 0,
    stagger = 0.03,
    last = false,
}: {
    text: string;
    className?: string;
    delay?: number;
    stagger?: number;
    last?: boolean;
}) {
    const lines = text.split("\n");

    return (
        <motion.p
            className={className}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
            initial="hidden"
            whileInView="visible"
            viewport={last ? VIEW_END : VIEW}
        >
            <span className="sr-only">{text.replace(/\n/g, " ")}</span>
            <span aria-hidden="true">
                {lines.map((line, li) => (
                    <Fragment key={li}>
                        {li > 0 && <br />}
                        {line.split(" ").map((word, wi) => (
                            <Fragment key={wi}>
                                {wi > 0 && " "}
                                <motion.span variants={wordVariants} className="inline-block">
                                    {word}
                                </motion.span>
                            </Fragment>
                        ))}
                    </Fragment>
                ))}
            </span>
        </motion.p>
    );
}

/** Letras de título: cada uma sobe girando levemente e ganha nitidez, em cascata. */
const letterVariants: Variants = {
    hidden: { opacity: 0, y: "0.5em", rotate: 8, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, rotate: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};

const headingContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

function Letters({ text, style }: { text: string; style?: CSSProperties }) {
    return (
        <>
            {Array.from(text).map((ch, i) => (
                <motion.span key={i} aria-hidden="true" variants={letterVariants} className="inline-block" style={style}>
                    {ch}
                </motion.span>
            ))}
        </>
    );
}

/** Grupos com cascata (ícones sociais, pastas). */
const groupVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const riseItem: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const popItem: Variants = {
    hidden: { opacity: 0, y: 14, scale: 0.6 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 16 } },
};

const folderItem: Variants = {
    hidden: { opacity: 0, y: 44, scale: 0.8, rotate: -5 },
    visible: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 170, damping: 15 } },
};

/* ==========================================================================
   SEÇÕES
   ========================================================================== */

function Hero() {
    return (
        <section
            className="overflow-x-clip flex items-center justify-center min-h-[calc(100svh-44px)] lg:min-h-[calc(100vh-76px)] px-6"
            style={{ backgroundColor: BG }}
        >
            {/* max-w evita que o título cresça demais entre mobile e desktop */}
            <div className="relative w-[72vw] max-w-[26rem] -translate-x-[2vw] lg:translate-x-0 lg:w-[28rem]">
                {/* Estrela atrás do título: "abre" girando, depois do título */}
                <motion.img
                    src="/imgs/Star.png"
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    initial={{ opacity: 0, scale: 0.2, rotate: -140 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 70, damping: 13, delay: 0.7 }}
                    className="absolute w-[42%] left-[70%] top-[-130%] z-0 pointer-events-none select-none"
                />

                {/* Título: revelado da esquerda para a direita, como se fosse escrito */}
                <motion.img
                    src="/imgs/Title.png"
                    alt="Guará Estúdio — Arte, Design & Tecnologia"
                    draggable={false}
                    initial={{ opacity: 0, y: 24, clipPath: "inset(0 100% 0 0)" }}
                    animate={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
                    transition={{ duration: 1.3, delay: 0.15, ease: EASE }}
                    className="relative z-10 w-full select-none"
                />

                {/* Carimbo vermelho: "carimbado" por último, com um quique */}
                <motion.img
                    src="/imgs/GuaraCarinbo.png"
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    initial={{ opacity: 0, scale: 2, rotate: -30 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 14, delay: 1.15 }}
                    className="absolute z-20 w-[34%] left-[82%] top-[2%] lg:w-[38%] lg:left-[91%] pointer-events-none select-none"
                />
            </div>
        </section>
    );
}

function About() {
    const [emoticon, setEmoticon] = useState(":)");
    const [isDragging, setIsDragging] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const lastTapRef = useRef(0);

    const handleStampClick = () => {
        const now = Date.now();
        const delta = now - lastTapRef.current;
        if (delta < 300 && delta > 0) {
            animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
            animate(y, 0, { type: "spring", stiffness: 300, damping: 25 });
        }
        lastTapRef.current = now;
    };

    return (
        <section
            className="flex flex-col lg:flex-row items-stretch lg:min-h-screen font-sans text-black"
            style={{ backgroundColor: BG }}
        >
            {/* Coluna de texto */}
            <div className="flex flex-col justify-center w-full lg:w-[60%] px-5 py-10 lg:py-12 lg:pl-[70px] lg:pr-[60px]">
                <motion.h2
                    aria-label="Olá!"
                    className="text-6xl font-light tracking-tight mb-6 lg:mb-8"
                    variants={headingContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={VIEW}
                >
                    <Letters text="O" style={{ fontFamily: "var(--font-ribeye)" }} />
                    <Letters text="lá!" style={{ fontFamily: "var(--font-playfair)" }} />{" "}
                    {/* Wrapper cuida da entrada; o span interno mantém hover/tap originais */}
                    <motion.span
                        variants={{
                            hidden: { opacity: 0, scale: 0, rotate: -45 },
                            visible: {
                                opacity: 1,
                                scale: 1,
                                rotate: 0,
                                transition: { type: "spring", stiffness: 350, damping: 12 },
                            },
                        }}
                        className="inline-block"
                    >
                        <motion.span
                            aria-label="Emoticon interativo"
                            className="inline-block cursor-pointer select-none font-sans"
                            whileHover={{ scale: 1.25 }}
                            whileTap={{ scale: 1.1, rotate: 20 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            onTapStart={() => setEmoticon(";)")}
                            onTap={() => setEmoticon(":)")}
                            onTapCancel={() => setEmoticon(":)")}
                        >
                            {emoticon}
                        </motion.span>
                    </motion.span>
                </motion.h2>

                <div className="space-y-5 lg:space-y-6 text-[15px] leading-snug font-medium">
                    <Words
                        text={
                            "Somos um estúdio de design e tecnologia.\nPosicionamos sua empresa no mercado com uma boa comunicação, muito estilo e arte."
                        }
                        delay={0.2}
                    />
                    <Words
                        text="Administrada por Vitória Carvalho, designer e também serígrafa há mais de 8 anos, e por Frank Castro F., Desenvolvedor Full stack e entusiasta de Game Design / Game Development, temos como objetivo unir os dois mundos, arte física e digital, feita por mãos humanas."
                        delay={0.3}
                        stagger={0.018}
                    />
                    <Words text="Estamos em Curitiba/PR, a Capital do Design. ;)" className="lg:pt-4" delay={0.3} />
                </div>

                <div className="mt-10 lg:mt-14 w-full">
                    <Rule color={RED} />

                    <div className="flex items-center justify-between py-4 px-2 sm:px-4">
                        <Reveal className="font-semibold text-sm" x={-24} y={0} blur={0}>
                            Contato
                        </Reveal>
                        <Reveal x={24} y={0} blur={0} delay={0.12}>
                            <Link
                                href="/contato"
                                className="inline-block border-2 px-3 py-2.5 text-sm font-semibold hover:bg-[#5a7a8a] hover:text-[#FAFADC] transition-colors"
                                style={{ borderColor: BLUE, color: BLUE }}
                            >
                                Vamos Conversar
                            </Link>
                        </Reveal>
                    </div>
                    <Rule color="#000" delay={0.1} />

                    <div className="flex items-center justify-between py-5 lg:py-6 px-2 sm:px-4">
                        <Reveal className="font-semibold text-sm" x={-24} y={0} blur={0}>
                            Sobre
                        </Reveal>
                    </div>
                    <Rule color="#000" delay={0.1} />

                    <div className="flex items-center justify-between py-5 lg:py-6 px-2 sm:px-4">
                        <motion.div variants={groupVariants} initial="hidden" whileInView="visible" viewport={VIEW}>
                            <motion.p variants={riseItem} className="font-semibold text-sm mb-4">
                                SIGA @guaraestudio
                            </motion.p>
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-6 items-center">
                                    <motion.span variants={popItem} className="inline-flex">
                                        <svg className="hover:scale-105 transition-transform cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                    </motion.span>
                                    <motion.span variants={popItem} className="inline-flex">
                                        <span className="inline-block text-xl font-sans font-medium leading-none hover:scale-105 transition-transform cursor-pointer">Bē</span>
                                    </motion.span>
                                </div>
                                <div className="flex gap-6 items-center">
                                    <motion.span variants={popItem} className="inline-flex">
                                        <svg className="hover:scale-105 transition-transform cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                                    </motion.span>
                                    <motion.span variants={popItem} className="inline-flex">
                                        <svg className="hover:scale-105 transition-transform cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M10.5 17l1.5-6M9 13c0-3 5-4 5-1 0 2-2 3-3 2"></path></svg>
                                    </motion.span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Carimbo: wrapper faz a entrada girando; o interno mantém drag/hover */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0, rotate: -120 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={VIEW}
                            transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.45 }}
                            className="relative z-50"
                        >
                            <motion.div
                                drag
                                dragMomentum={false}
                                style={{ x, y }}
                                onDragStart={() => setIsDragging(true)}
                                onDragEnd={() => setIsDragging(false)}
                                onClick={handleStampClick}
                                whileHover={{ scale: 1.1 }}
                                whileDrag={{
                                    scale: 1.15,
                                    cursor: "grabbing",
                                    filter: "drop-shadow(0px 15px 20px rgba(0,0,0,0.3))",
                                }}
                                className="w-28 h-28 flex items-center justify-center relative cursor-grab z-50 touch-none select-none"
                            >
                                <img
                                    src="/icons/logo/logoCarimbo1.png"
                                    alt="Carimbo Guará Estúdio"
                                    className="w-full h-full object-contain p-2 animate-[spin_15s_linear_infinite]"
                                    style={{ animationPlayState: isDragging ? "paused" : "running" }}
                                    draggable={false}
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                    <Rule color={RED} delay={0.1} />
                </div>
            </div>

            {/* Divisória vertical (só no desktop) */}
            <div className="hidden lg:block my-[100px] border-r border-black" />

            {/* Ornamento: a imagem vem pela metade, então é duplicada e espelhada.
                Entrada: "abre" a partir da dobra central, como um livro.
                Para esconder no mobile, troque "flex" por "hidden lg:flex". */}
            <div className="flex w-full lg:w-[40%] items-center justify-center px-5 pb-10 pt-2 lg:p-16">
                <motion.div
                    className="flex w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[490px] aspect-square"
                    initial={{ opacity: 0, scale: 0.94, clipPath: "inset(0 50% 0 50%)" }}
                    whileInView={{ opacity: 1, scale: 1, clipPath: "inset(0 0% 0 0%)" }}
                    viewport={VIEW}
                    transition={{ duration: 1.5, ease: EASE }}
                >
                    <img
                        src="/imgs/Ornamento.png"
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        className="w-1/2 h-full object-fill select-none translate-x-[2px]"
                    />
                    <img
                        src="/imgs/Ornamento.png"
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        className="w-1/2 h-full object-fill select-none -scale-x-100"
                    />
                </motion.div>
            </div>
        </section>
    );
}

function ProjectFolder({ label, href }: { label: string; href: string }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            variants={folderItem}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex w-full justify-center lg:w-auto"
        >
            <Link
                href={href}
                className="group flex flex-col items-center gap-3 sm:gap-4 w-full max-w-[140px] lg:w-[140px] focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ outlineColor: BLUE }}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                onTouchStart={() => setOpen(true)}
                onTouchEnd={() => setOpen(false)}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
            >
                <span className="relative block w-20 h-[74px]">
                    <img
                        src="/icons/pastaFechada.png"
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-150 ${open ? "opacity-0" : "opacity-100"}`}
                    />
                    <img
                        src="/icons/pastaAberta.png"
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-150 ${open ? "opacity-100" : "opacity-0"}`}
                    />
                </span>
                <span className="text-sm sm:text-[15px] font-semibold uppercase text-black">{label}</span>
            </Link>
        </motion.div>
    );
}

function Projects() {
    return (
        <section
            className="relative overflow-hidden flex flex-col items-center px-5 py-14 lg:py-24 lg:min-h-[80vh] lg:justify-center"
            style={{ backgroundColor: BG }}
        >
            {/* Título + estrela: à esquerda no mobile/tablet, à direita no desktop */}
            <div className="relative max-w-[540px] text-center">
                <div className="relative inline-block mb-5">
                    {/* A estrela estoura logo depois das letras começarem a subir */}
                    <motion.img
                        src="/imgs/Star.png"
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        initial={{ opacity: 0, scale: 0.2, rotate: -90 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={VIEW}
                        transition={{ type: "spring", stiffness: 60, damping: 12, delay: 0.35 }}
                        className="absolute z-0 right-full -mr-3 -top-[56px] w-24 lg:right-auto lg:left-full lg:-ml-2 lg:-top-[112px] lg:w-[185px] pointer-events-none select-none"
                    />
                    <motion.h2
                        aria-label="Projetos"
                        className="relative z-10 text-[28px] lg:text-[32px] font-semibold uppercase tracking-tight leading-none"
                        variants={headingContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={VIEW}
                    >
                        <Letters text="Projetos" />
                    </motion.h2>
                </div>
                <Words
                    text="Desenvolvimento de Sites e Landing pages, desenvolvimento de jogos e aplicativos, design gráfico & Serigrafia"
                    className="relative z-10 text-sm lg:text-[15px] leading-snug font-medium"
                    delay={0.45}
                />
            </div>

            {/* Pastas: 2x2 até o lg, em linha só no desktop. Entram em cascata. */}
            <motion.div
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.11, delayChildren: 0.2 } } }}
                initial="hidden"
                whileInView="visible"
                viewport={VIEW}
                className="mt-14 lg:mt-28 w-full max-w-[340px] lg:max-w-none grid grid-cols-2 justify-items-center gap-x-4 gap-y-10 lg:flex lg:items-start lg:justify-center lg:gap-8"
            >
                {PROJECTS.map((p) => (
                    <ProjectFolder key={p.label} {...p} />
                ))}
            </motion.div>

            {/* Carimbo gigante cortado na borda direita (só no desktop): desliza girando */}
            <motion.img
                src="/icons/logo/logoCarimbo1.png"
                alt=""
                aria-hidden="true"
                draggable={false}
                initial={{ opacity: 0, x: 140, rotate: -45 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={VIEW}
                transition={{ duration: 1.6, delay: 0.2, ease: EASE }}
                className="hidden lg:block absolute top-[12%] -right-[8%] w-[22rem] pointer-events-none select-none"
                style={{ filter: "grayscale(1) sepia(1) hue-rotate(170deg) saturate(1.2)" }}
            />
        </section>
    );
}

function Contact() {
    return (
        <section
            className="border-t px-5 sm:px-[54px] py-10 lg:py-14 lg:min-h-[310px] flex flex-col justify-center"
            style={{ backgroundColor: BG, borderColor: RED }}
        >
            <div className="flex flex-wrap items-end gap-x-6 sm:gap-x-8 gap-y-1">
                {/* Máscara: "CONTATO" sobe de dentro de uma janela, em bloco único */}
                <div className="py-2 -my-2">
                    <motion.h2
                        initial={{ y: "125%" }}
                        whileInView={{ y: "0%" }}
                        viewport={VIEW_END}
                        transition={{ duration: 1, ease: EASE }}
                        className="text-[64px] sm:text-[88px] leading-[0.9] uppercase"
                        style={{ fontFamily: "var(--font-anton, Impact, 'Arial Narrow Bold', sans-serif)", color: BLUE }}
                    >
                        Contato
                    </motion.h2>
                </div>

                {/* Manuscrito: "escrito" da esquerda para a direita e assenta em -2° */}
                <motion.span
                    initial={{ opacity: 0, rotate: -10, scale: 0.85, clipPath: "inset(-10% 100% -10% -10%)" }}
                    whileInView={{ opacity: 1, rotate: -2, scale: 1, clipPath: "inset(-10% -10% -10% -10%)" }}
                    viewport={VIEW_END}
                    transition={{ duration: 1.2, delay: 0.55, ease: EASE }}
                    className="inline-block font-beth-ellen text-[26px] sm:text-[34px] pb-1 text-red-600"
                >
                    Manda um olá!!!
                </motion.span>
            </div>

            <Words
                text={"Ficou com alguma dúvida? entre em contato.\nFicaremos felizes em te atender ;)"}
                className="mt-3 text-[15px] leading-snug"
                delay={0.35}
                last
            />

            <Reveal className="mt-6 self-start" delay={0.5} y={20} blur={0} last>
                <Link
                    href="/contato"
                    className="inline-block border px-5 py-2 text-[15px] hover:bg-[#5a7a8a] hover:text-[#FAFADC] transition-colors"
                    style={{ borderColor: BLUE, color: BLUE }}
                >
                    Entrar em contato
                </Link>
            </Reveal>
        </section>
    );
}

function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEW_END}
            transition={{ duration: 0.8, ease: EASE }}
            className="border-t px-5 py-5 lg:py-6 text-center text-sm lg:text-[15px]"
            style={{ backgroundColor: BG, borderColor: RED, color: BLUE }}
        >
            © {new Date().getFullYear()} Guará Estúdio. Todos os direitos reservados.
        </motion.footer>
    );
}

export default function MainPage() {
    return (
        // reducedMotion="user": quem ativa "reduzir movimento" no sistema vê só fades, sem deslocamentos/rotações.
        <MotionConfig reducedMotion="user">
            <div className="w-full overflow-x-clip" style={{ backgroundColor: BG }}>
                <Hero />
                <About />
                <Projects />
                <Contact />
                <Footer />
            </div>
        </MotionConfig>
    );
}