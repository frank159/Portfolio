"use client";

import {
    Fragment,
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from "react";
import {
    motion,
    useMotionValue,
    useAnimationControls,
    useInView,
    animate,
    MotionConfig,
    type Variants,
} from "framer-motion";
import Link from "next/link";
import Text from "@/src/components/Text/Text";
import Title from "@/src/components/Title/Title";
import Contact from "../components/Contact/Contact";
import StampBurst from "../components/StampBurst/StampBurst";
import { clearHomeScroll, readHomeScroll, saveHomeScroll } from "../lib/homeScroll";
import Button from "../components/Button/Button";

const BG = "#FAFADC";
const BLUE = "#5a7a8a";
const RED = "#8b0000";

const PROJECTS = [
    { label: "Website", href: "/projetos/webdesing" },
    { label: "Design", href: "/projetos/desing" },
    { label: "Serigrafia", href: "/projetos/serigrafia" },
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

/** Bloco que sobe de baixo para cima (rápido e suave, sem blur). */
function Reveal({
    children,
    className,
    style,
    delay = 0,
    x = 0,
    y = 32,
    duration = 0.6,
    last = false,
}: {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    delay?: number;
    x?: number;
    y?: number;
    duration?: number;
    last?: boolean;
}) {
    return (
        <motion.div
            className={className}
            style={style}
            initial={{ opacity: 0, x, y }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={last ? VIEW_END : VIEW}
            transition={{ duration, delay, ease: EASE }}
        >
            {children}
        </motion.div>
    );
}

/** Linha divisória: aparece de baixo para cima, igual aos blocos. */
function Rule({ color, delay = 0 }: { color: string; delay?: number }) {
    return (
        <motion.hr
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEW}
            transition={{ duration: 0.6, delay, ease: EASE }}
            style={{ borderColor: color }}
        />
    );
}

function Handwritten({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "0px" });

    return (
        // Wrapper sem recorte: observado pelo useInView e responsável por posição/rotação.
        <span ref={ref} className={className}>
            <motion.span
                initial={{ clipPath: "inset(-10% 100% -10% -10%)" }}
                animate={{
                    clipPath: inView
                        ? "inset(-10% -10% -10% -10%)"
                        : "inset(-10% 100% -10% -10%)",
                }}
                transition={{ duration: 1.2, delay: 0.55, ease: EASE }}
                className="inline-block font-beth-ellen text-[26px] sm:text-[34px] leading-none text-[#7D0103]"
            >
                {children}
            </motion.span>
        </span>
    );
}

const wordVariants: Variants = {
    hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

/** Parágrafo que entra palavra por palavra (respeita \n como quebra de linha). */
function Words({
    text,
    className = "",
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
            className={`font-sans ${className}`}
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

/* ==========================================================================
   ORNAMENTO — animação Lottie exportada do EffectCraft
   ========================================================================== */

/**
 * >>> AJUSTES DO ORNAMENTO <<<
 * ORNAMENT_SRC     = caminho do JSON dentro de /public (sem a palavra "public").
 * ORNAMENT_IS_HALF = true  → o JSON tem só a METADE do desenho (renderiza duas
 *                            cópias, a segunda espelhada, como era com o PNG).
 *                    false → o JSON já tem o desenho COMPLETO (uma única cópia).
 * ORNAMENT_SPEED   = velocidade de reprodução (1 = normal, 0.5 = metade, 2 = dobro).
 */
const ORNAMENT_SRC = "/animation/Ornamento.json";
const ORNAMENT_IS_HALF = true;
const ORNAMENT_SPEED = 1;

type LottieLayerData = {
    ty?: number; // 4 = camada de forma
    ip: number; // quadro de entrada
    op: number; // quadro de saída
    hd?: boolean; // camada oculta
};

type LottieAnimation = {
    setSpeed: (speed: number) => void;
    addEventListener: (name: string, callback: (event: { currentTime: number }) => void) => void;
    goToAndStop: (value: number, isFrame: boolean) => void;
    play: () => void;
    destroy: () => void;
    totalFrames: number;
    firstFrame?: number;
    animationData?: { ip?: number; op?: number; layers?: LottieLayerData[] };
};

type LottieAPI = {
    loadAnimation: (options: {
        container: HTMLElement;
        renderer: "svg";
        loop: boolean;
        autoplay: boolean;
        path: string;
        rendererSettings: { preserveAspectRatio: string };
    }) => LottieAnimation;
};

declare global {
    interface Window {
        lottie?: LottieAPI;
    }
}

let lottieScriptPromise: Promise<LottieAPI> | undefined;

function loadLottie(): Promise<LottieAPI> {
    if (window.lottie) return Promise.resolve(window.lottie);
    if (!lottieScriptPromise) {
        lottieScriptPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js";
            script.async = true;
            script.onload = () => window.lottie
                ? resolve(window.lottie)
                : reject(new Error("Lottie failed to initialize"));
            script.onerror = () => reject(new Error("Unable to load Lottie"));
            document.head.appendChild(script);
        });
    }
    return lottieScriptPromise;
}

/**
 * Prepara a animação logo depois de carregada. Faz duas coisas:
 *
 * 1) ENQUADRAMENTO: a composição exportada costuma ter margens vazias em volta do desenho
 *    (por isso ele aparecia pequeno). Vamos ao último quadro desenhado, medimos o desenho
 *    inteiro (getBBox) e ajustamos o viewBox do SVG para ficar exatamente no tamanho dele.
 *
 * 2) QUADRO FINAL: se as camadas "saem" antes do fim da composição, o desenho some no final.
 *    Descobrimos o último quadro em que ainda existe desenho e devolvemos ele para congelar ali.
 *
 * Retorna o número do quadro em que a animação deve parar.
 */
function prepareArtwork(anim: LottieAnimation, container: HTMLElement): number {
    const total = anim.totalFrames;
    const first = anim.firstFrame ?? anim.animationData?.ip ?? 0;
    let stop = Math.max(total - 1, 0);

    // 2) Último quadro com desenho: antes de qualquer camada de forma sair.
    const shapeOuts = (anim.animationData?.layers ?? [])
        .filter((layer) => layer.ty === 4 && !layer.hd && layer.op > layer.ip)
        .map((layer) => layer.op);
    if (shapeOuts.length > 0) {
        const lastWithArt = Math.min(...shapeOuts) - first - 1;
        if (lastWithArt >= 1 && lastWithArt < stop) stop = lastWithArt;
    }

    // 1) Enquadramento no tamanho real do desenho.
    let viewBox: string | null = null;
    try {
        const svg = container.querySelector("svg");
        const root = svg?.querySelector(":scope > g") as SVGGraphicsElement | null | undefined;

        if (svg && root) {
            anim.goToAndStop(stop, true); // desenho completo na tela para medir
            const box = root.getBBox();

            if (box.width > 0 && box.height > 0) {
                // getBBox ignora a espessura do traço: soma metade da maior espessura.
                let maxStroke = 0;
                svg.querySelectorAll("path").forEach((path) => {
                    const w = parseFloat(path.getAttribute("stroke-width") ?? "0");
                    if (w > maxStroke) maxStroke = w;
                });
                const pad = maxStroke / 2 + 0.5;

                viewBox = [
                    box.x - pad,
                    box.y - pad,
                    box.width + pad * 2,
                    box.height + pad * 2,
                ].join(" ");
                svg.setAttribute("viewBox", viewBox);
            }
        }
    } catch {
        // getBBox falha se o elemento estiver escondido; mantém o enquadramento original.
    }

    anim.goToAndStop(0, true); // volta ao início (traço ainda em 0%)

    if (process.env.NODE_ENV !== "production") {
        console.info("[Ornamento]", { totalFrames: total, stopFrame: stop, viewBox });
    }

    return stop;
}

/**
 * Toca um arquivo Lottie uma única vez, quando entra na tela, e para no último quadro com desenho.
 * - A biblioteca é carregada só no navegador (evita erro de "document is not defined" no SSR).
 * - Quem tem "reduzir movimento" ativado no sistema vê direto o quadro final.
 * - preserveAspectRatio: "xMidYMid meet" mantém a proporção; "none" estica (como o object-fill).
 */
function LottieOrnament({
    src,
    className,
    speed = 1,
    preserveAspectRatio = "xMidYMid meet",
}: {
    src: string;
    className?: string;
    speed?: number;
    preserveAspectRatio?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<LottieAnimation | null>(null);
    const stopFrameRef = useRef(0);
    const [ready, setReady] = useState(false);
    const inView = useInView(containerRef, { once: true, amount: 0.3 });

    // Carrega a animação (pausada no quadro 0).
    useEffect(() => {
        let cancelled = false;
        let anim: LottieAnimation | undefined;

        (async () => {
            const lottie = await loadLottie();
            if (cancelled || !containerRef.current) return;

            anim = lottie.loadAnimation({
                container: containerRef.current,
                renderer: "svg",
                loop: false,
                autoplay: false,
                path: src,
                rendererSettings: { preserveAspectRatio },
            });
            anim.setSpeed(speed);
            const item = anim;
            item.addEventListener("DOMLoaded", () => {
                if (cancelled || !containerRef.current) return;

                const stop = prepareArtwork(item, containerRef.current);
                stopFrameRef.current = stop;

                // Congela no último quadro com desenho, para o ornamento não sumir no fim.
                let frozen = false;
                item.addEventListener("enterFrame", (event) => {
                    if (frozen || event.currentTime < stop) return;
                    frozen = true;
                    item.goToAndStop(stop, true);
                });

                animRef.current = item;
                setReady(true);
            });
        })();

        return () => {
            cancelled = true;
            animRef.current = null;
            setReady(false);
            anim?.destroy();
        };
    }, [src, speed, preserveAspectRatio]);

    // Toca quando já carregou E entrou na tela.
    useEffect(() => {
        const anim = animRef.current;
        if (!ready || !inView || !anim) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
            anim.goToAndStop(stopFrameRef.current, true);
        } else {
            anim.play();
        }
    }, [ready, inView]);

    // [&>svg]:block tira o espaço em branco que o SVG "inline" deixa embaixo.
    return (
        <div
            ref={containerRef}
            className={`${className ?? ""} [&>svg]:block`}
            aria-hidden="true"
        />
    );
}

/* ==========================================================================
   CARIMBO — estrela central parada + anel de texto girando
   ========================================================================== */

/**
 * Usa o mesmo PNG nas duas camadas, separadas por máscara radial.
 *
 * >>> AJUSTE AQUI <<<
 * STAMP_CENTER = raio (em %) da área que fica parada.
 * Aumente se o texto estiver sendo cortado pelo centro,
 * diminua se pedaços da estrela estiverem girando junto.
 */
const STAMP_SRC = "/logo/logoCarimbo.png";
const STAMP_CENTER = 76;
const STAMP_FEATHER = 1.5; // suaviza a emenda entre as duas camadas

const centerMask = `radial-gradient(circle closest-side, #000 ${STAMP_CENTER}%, transparent ${STAMP_CENTER + STAMP_FEATHER}%)`;
const ringMask = `radial-gradient(circle closest-side, transparent ${STAMP_CENTER}%, #000 ${STAMP_CENTER + STAMP_FEATHER}%)`;

function RotatingStamp({ paused }: { paused: boolean }) {
    const layer: CSSProperties = {
        backgroundImage: `url(${STAMP_SRC})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
    };

    return (
        <div
            role="img"
            aria-label="Carimbo Guará Estúdio"
            className="relative h-full w-full p-2"
        >
            <div className="relative h-full w-full">
                {/* Centro (estrela): parado */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                        ...layer,
                        maskImage: centerMask,
                        WebkitMaskImage: centerMask,
                    }}
                />

                {/* Anel de texto: gira */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 animate-[spin_15s_linear_infinite] motion-reduce:animate-none"
                    style={{
                        ...layer,
                        maskImage: ringMask,
                        WebkitMaskImage: ringMask,
                        animationPlayState: paused ? "paused" : "running",
                    }}
                />
            </div>
        </div>
    );
}

/* ==========================================================================
   SEÇÕES
   ========================================================================== */

function Hero() {
    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        const saved = readHomeScroll();
        if (saved === null) {
            window.scrollTo(0, 0); // chegada normal: topo
            return;
        }

        // Volta de uma pasta: espera o layout assentar e restaura a altura
        let raf2 = 0;
        const raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => {
                window.scrollTo(0, saved);
                clearHomeScroll();
            });
        });
        return () => {
            cancelAnimationFrame(raf1);
            cancelAnimationFrame(raf2);
        };
    }, []);

    return (
        <section
            className="overflow-x-clip flex items-center justify-center min-h-[calc(100svh-44px)] lg:min-h-[calc(100vh-76px)] px-6"
            style={{ backgroundColor: BG }}
        >
            {/* max-w evita que o título cresça demais entre mobile e desktop */}
            <div className="relative w-[72vw] max-w-[26rem] -translate-x-[2vw] lg:translate-x-0 lg:w-[28rem]">
                {/* Estrela atrás do título: abre girando, sem efeito elástico */}
                <motion.img
                    src="/imgs/Star.png"
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    initial={{ opacity: 0, scale: 0.2, rotate: -140 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1.1, delay: 0.6, ease: EASE }}
                    className="absolute w-[42%] left-[70%] top-[-130%] z-0 pointer-events-none select-none"
                />

                {/* Título: revelado da esquerda para a direita, como se fosse escrito */}
                <motion.img
                    src="/SVGs/main_logo.svg"
                    alt="Guará Estúdio — Arte, Design & Tecnologia"
                    draggable={false}
                    initial={{ opacity: 0, y: 24, clipPath: "inset(0 100% 0 0)" }}
                    animate={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
                    transition={{ duration: 1.3, delay: 0.15, ease: EASE }}
                    className="relative z-10 w-full select-none"
                />

                {/* Carimbo: desce de cima, bate no papel (aperta um pouco) e assenta.
                    Sem mola: ease-in na descida, ease-out na acomodação. */}
                <motion.img
                    src="/imgs/GuaraCarinbo.png"
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    initial={{ opacity: 0, scale: 1.6, rotate: -10 }}
                    animate={{ opacity: 1, scale: [1.6, 0.94, 1], rotate: [-10, 0, 0] }}
                    transition={{
                        delay: 1.0,
                        duration: 0.45,
                        times: [0, 0.6, 1],
                        ease: ["easeIn", "easeOut"],
                        opacity: { delay: 1.0, duration: 0.1 },
                    }}
                    className="absolute z-20 w-[34%] left-[82%] top-[2%] lg:w-[38%] lg:left-[91%] pointer-events-none select-none"
                />
            </div>
        </section>
    );
}

function About() {
    const [emoticon, setEmoticon] = useState(":)");
    const [isDragging, setIsDragging] = useState(false);
    const [coarse, setCoarse] = useState(false);

    const titleRef = useRef<HTMLHeadingElement>(null);
    const titleInView = useInView(titleRef, { once: true, amount: 0.8 });
    const emoticonControls = useAnimationControls();

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const lastTapRef = useRef(0);

    // Detecta telas de toque (celular/tablet) para o comportamento "sobe acima do dedo".
    useEffect(() => {
        const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
        setCoarse(mq.matches);
        const onChange = (e: MediaQueryListEvent) => setCoarse(e.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    // Pisca (:) → ;) → :)) uma vez quando a carinha entra na tela,
    // com uma leve rotação suave que volta ao ponto inicial.
    useEffect(() => {
        if (!titleInView) return;

        const WINK_DELAY = 450; // quando começa
        const WINK_TIME = 380;  // quanto dura o ";)"

        const t1 = setTimeout(() => {
            setEmoticon(";)");
            emoticonControls.start({
                rotate: [0, 14, 0],
                transition: {
                    type: "tween",
                    duration: WINK_TIME / 1000,
                    ease: "easeInOut",
                },
            });
        }, WINK_DELAY);

        const t2 = setTimeout(() => setEmoticon(":)"), WINK_DELAY + WINK_TIME);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [titleInView, emoticonControls]);

    const handleEmoticonStart = () => {
        setEmoticon(";)");
        if (coarse) {
            // No toque, o dedo cobre a carinha: ela sobe acima do dedo e fica maior.
            emoticonControls.start({
                y: -56,
                scale: 1.5,
                transition: { type: "spring", stiffness: 420, damping: 24 },
            });
        } else {
            // Desktop: gira ao clicar
            emoticonControls.start({
                rotate: 20,
                transition: { type: "spring", stiffness: 400, damping: 15 },
            });
        }
    };

    // Ao soltar, volta na hora para o emote e a posição originais.
    const handleEmoticonEnd = () => {
        setEmoticon(":)");
        if (coarse) {
            emoticonControls.start({
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 500, damping: 30 },
            });
        } else {
            emoticonControls.start({
                rotate: 0,
                transition: { type: "spring", stiffness: 400, damping: 15 },
            });
        }
    };
    // const handleStampClick = () => {
    //     const now = Date.now();
    //     const delta = now - lastTapRef.current;
    //     if (delta < 300 && delta > 0) {
    //         animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
    //         animate(y, 0, { type: "spring", stiffness: 300, damping: 25 });
    //     }
    //     lastTapRef.current = now;
    // };

    return (
        <section
            className="flex flex-col lg:flex-row items-stretch lg:min-h-screen font-sans text-black"
            style={{ backgroundColor: BG }}
        >
            {/* Coluna de texto */}
            <div className="flex flex-col justify-center w-full lg:w-[60%] px-5 py-10 lg:py-12 lg:pl-[70px] lg:pr-[60px]">
                {/* "Olá! :)" mantém as fontes próprias (Ribeye + Playfair), é um título estilizado */}
                <h2 ref={titleRef} className="text-6xl font-light tracking-tight mb-6 lg:mb-8">
                    <span style={{ fontFamily: "var(--font-ribeye)" }}>O</span>
                    <span style={{ fontFamily: "var(--font-playfair)" }}>lá!</span>{" "}
                    <motion.span
                        aria-label="Emoticon interativo"
                        className="relative z-20 inline-block cursor-pointer select-none font-sans [-webkit-touch-callout:none]"
                        animate={emoticonControls}
                        whileHover={coarse ? undefined : { scale: 1.25 }}
                        whileTap={coarse ? undefined : { scale: 1.1, rotate: 20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        onTapStart={handleEmoticonStart}
                        onTap={handleEmoticonEnd}
                        onTapCancel={handleEmoticonEnd}
                    >
                        {emoticon}
                    </motion.span>
                </h2>

                {/* Parágrafos */}
                <div className="space-y-5 lg:space-y-6 text-[15px] leading-snug font-medium">
                    <Text>
                        Somos um estúdio de design e tecnologia.
                        <br />
                        Posicionamos sua empresa no mercado com uma boa comunicação, muito estilo e arte.
                    </Text>
                    <Text>
                        Administrada por Vitória Carvalho, designer e também serígrafa há mais de 8 anos, e por
                        Frank Castro F., Desenvolvedor Full stack e entusiasta de Game Design / Game Development,
                        temos como objetivo unir os dois mundos, arte física e digital, feita por mãos humanas.
                    </Text>
                    <Text className="lg:pt-4 text-[#5a7a8a]">Estamos em Curitiba/PR, a Capital do Design. ;)</Text>
                </div>

                <div className="mt-10 lg:mt-14 w-full">
                    <Rule color={RED} />

                    <Reveal className="flex items-center justify-between py-4 px-2 sm:px-4" delay={0.05}>
                        <Text as="span" className="font-semibold text-sm">Contato</Text>
                        <Button
                            href="https://wa.me/5541996262562?text=Olá!%20Gostaria%20de%20mais%20informações."
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Vamos Conversar
                        </Button>
                    </Reveal>
                    {/* <Rule color={RED} delay={0.08} />

                    <Reveal className="flex items-center justify-between py-5 lg:py-6 px-2 sm:px-4" delay={0.05}>
                        <Text as="span" className="font-semibold text-sm">Sobre</Text>
                    </Reveal> */}
                    <Rule color={RED} delay={0.08} />

                    <Reveal className="flex items-center justify-between py-5 lg:py-6 px-2 sm:px-4" delay={0.05}>
                        <div>
                            <Text className="font-semibold text-sm mb-4">SIGA @guaraestudio</Text>
                            <div className="flex gap-6 items-center">
                                <a
                                    href="https://www.behance.net/vitriacarvalho23"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Abrir perfil do Behance"
                                    className="inline-flex"
                                >
                                    <img src="/logo/logo_behance.png" alt="Behance" className="h-[22px] w-auto hover:scale-105 transition-transform" />
                                </a>
                                <a
                                    href="https://github.com/frank159"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Abrir perfil do Behance"
                                    className="inline-flex"
                                >
                                    <img src="/logo/logo_github.png" alt="Behance" className="h-[22px] w-auto hover:scale-105 transition-transform" />
                                </a>
                            </div>
                        </div>

                        <StampBurst className="h-28 w-28 shrink-0">
                            <RotatingStamp paused={false} />
                        </StampBurst>
                    </Reveal>
                    <Rule color={RED} delay={0.08} />
                </div>
            </div>

            {/* Divisória vertical (só no desktop) */}
            <div className="hidden lg:block my-[100px] border-r" style={{ borderColor: RED }} />

            {/* Ornamento: animação Lottie (/public/animation/Ornamento.json).
                Toca uma vez ao entrar na tela e fica parada no último quadro.
                ORNAMENT_IS_HALF = true → duplica e espelha (JSON com só metade do desenho).
                ORNAMENT_IS_HALF = false → uma única cópia (JSON com o desenho completo).
                Para esconder no mobile, troque "flex" por "hidden lg:flex". */}
            <div className="flex w-full lg:w-[40%] items-center justify-center px-5 pb-10 pt-2 lg:p-16">
                <div className="flex w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[490px] aspect-square">
                    {ORNAMENT_IS_HALF ? (
                        <>
                            <LottieOrnament
                                src={ORNAMENT_SRC}
                                speed={ORNAMENT_SPEED}
                                preserveAspectRatio="none"
                                className="w-1/2 h-full select-none translate-x-[2px]"
                            />
                            <LottieOrnament
                                src={ORNAMENT_SRC}
                                speed={ORNAMENT_SPEED}
                                preserveAspectRatio="none"
                                className="w-1/2 h-full select-none -scale-x-100"
                            />
                        </>
                    ) : (
                        <LottieOrnament
                            src={ORNAMENT_SRC}
                            speed={ORNAMENT_SPEED}
                            className="w-full h-full select-none"
                        />
                    )}
                </div>
            </div>
        </section>
    );
}

const OPEN_SCALE_X = 1.12;
const OPEN_ORIGIN = "left center";

function ProjectFolder({ label, href }: { label: string; href: string }) {
    const [open, setOpen] = useState(false);

    return (
        <Link
            href={href}
            onClick={saveHomeScroll}
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
                    className={`absolute inset-0 w-full h-full object-contain ${open ? "opacity-0" : "opacity-100"}`}
                />
                <img
                    src="/icons/pastaAberta.png"
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className={`absolute inset-0 w-full h-full object-contain ${open ? "opacity-100" : "opacity-0"}`}
                    style={{
                        transform: `scaleX(${OPEN_SCALE_X})`,
                        transformOrigin: OPEN_ORIGIN,
                    }}
                />
            </span>
            <Text as="span" className="text-sm sm:text-[15px] font-semibold uppercase text-black">
                {label}
            </Text>
        </Link>
    );
}

function Projects() {
    return (
        <section
            className="relative overflow-hidden flex flex-col items-center px-5 py-14 lg:py-24 lg:min-h-[80vh] lg:justify-center"
            style={{ backgroundColor: BG }}
        >
            {/* Título + estrela: à esquerda no mobile/tablet, à direita no desktop.
                A estrela é o único elemento animado desta seção. */}
            <div className="relative max-w-[540px] text-center">
                <div className="relative inline-block mb-5">
                    <motion.img
                        src="/imgs/Star.png"
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        initial={{ opacity: 0, scale: 0.2, rotate: -90 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={VIEW}
                        transition={{ type: "spring", stiffness: 60, damping: 12, delay: 0.2 }}
                        className="absolute z-0 right-full -mr-3 -top-[56px] w-24 lg:right-auto lg:left-full lg:-ml-2 lg:-top-[112px] lg:w-[185px] pointer-events-none select-none"
                    />
                    <Title
                        as="h2"
                        font="nunito"
                        weight="semibold"
                        className="relative z-10 text-[28px] lg:text-[32px] font-normal uppercase leading-none"
                    >
                        Projetos
                    </Title>
                </div>
                <Text className="relative z-10 text-sm lg:text-[15px] leading-snug font-medium">
                    Desenvolvimento de Sites e Landing pages, desenvolvimento de jogos e aplicativos, design
                    gráfico &amp; Serigrafia
                </Text>
            </div>

            {/* Pastas: 2x2 até o lg, em linha só no desktop */}
            <div className="mt-14 lg:mt-28 w-full max-w-[340px] lg:max-w-none grid grid-cols-2 justify-items-center gap-x-4 gap-y-10 lg:flex lg:items-start lg:justify-center lg:gap-8">
                {PROJECTS.map((p) => (
                    <ProjectFolder key={p.label} {...p} />
                ))}
            </div>

            {/* Carimbo gigante cortado na borda direita (só no desktop) */}
            <img
                src="/logo/logoCarimbo.png"
                alt=""
                aria-hidden="true"
                draggable={false}
                className="hidden lg:block absolute top-[12%] -right-[8%] w-[22rem] pointer-events-none select-none"
                style={{ filter: "grayscale(1) sepia(1) hue-rotate(170deg) saturate(1.2)" }}
            />
        </section>
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
            </div>
        </MotionConfig>
    );
}