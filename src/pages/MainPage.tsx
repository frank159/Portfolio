"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
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

function Hero() {
    return (
        <section
            className="overflow-x-clip flex items-center justify-center min-h-[calc(100svh-44px)] lg:min-h-[calc(100vh-76px)] px-6"
            style={{ backgroundColor: BG }}
        >
            {/* max-w evita que o título cresça demais entre mobile e desktop */}
            <div className="relative w-[72vw] max-w-[26rem] -translate-x-[2vw] lg:translate-x-0 lg:w-[28rem]">
                {/* Estrela atrás do título */}
                <img
                    src="/imgs/Star.png"
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className="absolute w-[42%] left-[70%] top-[-130%] z-0 pointer-events-none select-none"
                />

                {/* Título */}
                <img
                    src="/imgs/Title.png"
                    alt="Guará Estúdio — Arte, Design & Tecnologia"
                    draggable={false}
                    className="relative z-10 w-full select-none"
                />

                {/* Carimbo vermelho sobre a ponta do título */}
                <img
                    src="/imgs/GuaraCarinbo.png"
                    alt=""
                    aria-hidden="true"
                    draggable={false}
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
                <h2 className="text-6xl font-light tracking-tight mb-6 lg:mb-8">
                    <span style={{ fontFamily: "var(--font-ribeye)" }}>O</span>
                    <span style={{ fontFamily: "var(--font-playfair)" }}>lá!</span>{" "}
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
                </h2>

                <div className="space-y-5 lg:space-y-6 text-[15px] leading-snug font-medium">
                    <p>
                        Somos um estúdio de design e tecnologia.
                        <br />
                        Posicionamos sua empresa no mercado com uma boa comunicação, muito estilo e arte.
                    </p>
                    <p>
                        Administrada por Vitória Carvalho, designer e também serígrafa há mais de 8 anos, e por
                        Frank Castro F., Desenvolvedor Full stack e entusiasta de Game Design / Game Development,
                        temos como objetivo unir os dois mundos, arte física e digital, feita por mãos humanas.
                    </p>
                    <p className="lg:pt-4">Estamos em Curitiba/PR, a Capital do Design. ;)</p>
                </div>

                <div className="mt-10 lg:mt-14 w-full">
                    <hr style={{ borderColor: RED }} />

                    <div className="flex items-center justify-between py-4 px-2 sm:px-4">
                        <span className="font-semibold text-sm">Contato</span>
                        <Link
                            href="/contato"
                            className="inline-block border-2 px-3 py-2.5 text-sm font-semibold hover:bg-[#5a7a8a] hover:text-[#FAFADC] transition-colors"
                            style={{ borderColor: BLUE, color: BLUE }}
                        >
                            Vamos Conversar
                        </Link>
                    </div>
                    <hr style={{ borderColor: "#000" }} />

                    <div className="flex items-center justify-between py-5 lg:py-6 px-2 sm:px-4">
                        <span className="font-semibold text-sm">Sobre</span>
                    </div>
                    <hr style={{ borderColor: "#000" }} />

                    <div className="flex items-center justify-between py-5 lg:py-6 px-2 sm:px-4">
                        <div>
                            <p className="font-semibold text-sm mb-4">SIGA @guaraestudio</p>
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-6 items-center">
                                    <svg className="hover:scale-105 transition-transform cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                    <span className="text-xl font-sans font-medium leading-none hover:scale-105 transition-transform cursor-pointer">Bē</span>
                                </div>
                                <div className="flex gap-6 items-center">
                                    <svg className="hover:scale-105 transition-transform cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                                    <svg className="hover:scale-105 transition-transform cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M10.5 17l1.5-6M9 13c0-3 5-4 5-1 0 2-2 3-3 2"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Carimbo interativo */}
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
                    </div>
                    <hr style={{ borderColor: RED }} />
                </div>
            </div>

            {/* Divisória vertical (só no desktop) */}
            <div className="hidden lg:block my-[100px] border-r border-black" />

            {/* Ornamento: a imagem vem pela metade, então é duplicada e espelhada.
                Para esconder no mobile, troque "flex" por "hidden lg:flex". */}
            <div className="flex w-full lg:w-[40%] items-center justify-center px-5 pb-10 pt-2 lg:p-16">
                <div className="flex w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[490px] aspect-square">
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
                </div>
            </div>
        </section>
    );
}

function ProjectFolder({ label, href }: { label: string; href: string }) {
    const [open, setOpen] = useState(false);

    return (
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
                    <img
                        src="/imgs/Star.png"
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        className="absolute z-0 right-full -mr-3 -top-[56px] w-24 lg:right-auto lg:left-full lg:-ml-2 lg:-top-[112px] lg:w-[185px] pointer-events-none select-none"
                    />
                    <h2 className="relative z-10 text-[28px] lg:text-[32px] font-semibold uppercase tracking-tight leading-none">
                        Projetos
                    </h2>
                </div>
                <p className="relative z-10 text-sm lg:text-[15px] leading-snug font-medium">
                    Desenvolvimento de Sites e Landing pages, desenvolvimento de jogos e aplicativos, design
                    gráfico &amp; Serigrafia
                </p>
            </div>

            {/* Pastas: 2x2 até o lg, em linha só no desktop */}
            <div className="mt-14 lg:mt-28 w-full max-w-[340px] lg:max-w-none grid grid-cols-2 justify-items-center gap-x-4 gap-y-10 lg:flex lg:items-start lg:justify-center lg:gap-8">
                {PROJECTS.map((p) => (
                    <ProjectFolder key={p.label} {...p} />
                ))}
            </div>

            {/* Carimbo gigante cortado na borda direita (só no desktop) */}
            <img
                src="/icons/logo/logoCarimbo1.png"
                alt=""
                aria-hidden="true"
                draggable={false}
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
                <h2
                    className="text-[64px] sm:text-[88px] leading-[0.9] uppercase"
                    style={{ fontFamily: "var(--font-anton, Impact, 'Arial Narrow Bold', sans-serif)", color: BLUE }}
                >
                    Contato
                </h2>
                <span className="font-beth-ellen text-[26px] sm:text-[34px] pb-1 -rotate-2 text-red-600">
                    Manda um olá!!!
                </span>
            </div>

            <p className="mt-3 text-[15px] leading-snug">
                Ficou com alguma dúvida? entre em contato.
                <br />
                Ficaremos felizes em te atender ;)
            </p>

            <Link
                href="/contato"
                className="mt-6 self-start border px-5 py-2 text-[15px] hover:bg-[#5a7a8a] hover:text-[#FAFADC] transition-colors"
                style={{ borderColor: BLUE, color: BLUE }}
            >
                Entrar em contato
            </Link>
        </section>
    );
}

function Footer() {
    return (
        <footer
            className="border-t px-5 py-5 lg:py-6 text-center text-sm lg:text-[15px]"
            style={{ backgroundColor: BG, borderColor: RED, color: BLUE }}
        >
            © {new Date().getFullYear()} Guará Estúdio. Todos os direitos reservados.
        </footer>
    );
}

export default function MainPage() {
    return (
        <div className="w-full overflow-x-clip" style={{ backgroundColor: BG }}>
            <Hero />
            <About />
            <Projects />
            <Contact />
            <Footer />
        </div>
    );
}