"use client";

import Image from "next/image";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
    type KeyboardEvent,
} from "react";
import {
    animate,
    motion,
    useMotionValue,
    useTransform,
    type MotionValue,
    type PanInfo,
} from "framer-motion";

export type CarouselImage = {
    src: string;
    alt: string;
    /** "video" para tocar vídeo. Se omitido, é detectado pela extensão do arquivo (.mp4, .webm, .mov...) */
    type?: "image" | "video";
    /** Capa do vídeo: imagem mostrada antes de dar play (opcional) */
    poster?: string;
};

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i;

const isVideo = (item: CarouselImage) =>
    item.type === "video" || (item.type === undefined && VIDEO_EXTENSIONS.test(item.src));

type CarouselProps = {
    images: CarouselImage[];
    label?: string;
    className?: string;
    /** Cor do filtro por cima das imagens (só nas imagens, não nas setas) */
    overlayColor?: string;
    /** Intensidade do filtro: 0 = invisível, 1 = cor sólida */
    overlayOpacity?: number;
    /** Tamanho de cada slide (classes Tailwind). Padrão: proporção 4/5 */
    slideClassName?: string;
    /**
     * Quantos slides aparecem por tela a partir de 1024px (`lg:`).
     * Padrão 2 (igual ao tablet). Use 1 para mostrar uma foto por vez no desktop.
     */
    slidesFromLg?: 1 | 2;
};

const BLUE = "#5b7a8c";

/** Mola mais macia: acelera suave e desacelera sem "quicar" */
const SPRING = { type: "spring", stiffness: 140, damping: 24, mass: 0.9 } as const;

/** Resto da divisão que sempre dá resultado positivo (funciona com negativos) */
const mod = (value: number, divisor: number) =>
    ((value % divisor) + divisor) % divisor;

/**
 * 1 slide visível no mobile, 2 a partir de 640px (breakpoint `sm:`).
 * A partir de 1024px (`lg:`) vale `slidesFromLg` (padrão 2, ou seja, nada muda).
 */
function useVisibleSlides(slidesFromLg: 1 | 2) {
    return useSyncExternalStore(
        (onChange) => {
            const sm = window.matchMedia("(min-width: 640px)");
            const lg = window.matchMedia("(min-width: 1024px)");
            sm.addEventListener("change", onChange);
            lg.addEventListener("change", onChange);
            return () => {
                sm.removeEventListener("change", onChange);
                lg.removeEventListener("change", onChange);
            };
        },
        () => {
            if (window.matchMedia("(min-width: 1024px)").matches) return slidesFromLg;
            return window.matchMedia("(min-width: 640px)").matches ? 2 : 1;
        },
        () => 1,
    );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className={direction === "left" ? "" : "rotate-180"}
        >
            <path d="M15 5l-7 7 7 7" />
        </svg>
    );
}

function PlayIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5Z" />
        </svg>
    );
}

function PauseIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
    );
}

/**
 * Vídeo dentro de um slide. Em vez dos controles nativos (que brigariam com o arrasto do carrossel),
 * o slide inteiro vira um botão de play/pause. Arrastar continua trocando de slide normalmente.
 */
function SlideVideo({ src, poster, alt }: { src: string; poster?: string; alt: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const pointerStartX = useRef(0);
    const [playing, setPlaying] = useState(false);

    const toggle = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) void video.play();
        else video.pause();
    };

    return (
        <>
            <video
                ref={videoRef}
                // "#t=0.001" faz o Safari/iOS mostrar o primeiro quadro quando não há poster
                src={poster ? src : `${src}#t=0.001`}
                poster={poster}
                playsInline
                preload="metadata"
                loop
                aria-label={alt}
                draggable={false}
                className="absolute inset-0 h-full w-full select-none object-cover"
                onPlay={(event) => {
                    setPlaying(true);
                    // só um vídeo tocando por vez dentro do mesmo carrossel
                    const region = event.currentTarget.closest('[aria-roledescription="carousel"]');
                    region?.querySelectorAll("video").forEach((other) => {
                        if (other !== event.currentTarget) other.pause();
                    });
                }}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
            />

            <button
                type="button"
                aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
                onPointerDown={(event) => {
                    pointerStartX.current = event.clientX;
                }}
                onClick={(event) => {
                    // se o ponteiro andou (foi um arrasto, não um toque), não alterna o vídeo
                    // (detail 0 = ativado pelo teclado)
                    if (event.detail > 0 && Math.abs(event.clientX - pointerStartX.current) > 6) return;
                    toggle();
                }}
                className="absolute inset-0 flex items-center justify-center focus-visible:outline-none"
            >
                <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full bg-black/45 text-white transition-opacity duration-200 ${
                        playing ? "opacity-0 hover:opacity-100" : "opacity-100"
                    }`}
                >
                    {playing ? <PauseIcon /> : <PlayIcon />}
                </span>
            </button>
        </>
    );
}

type SlideProps = {
    image: CarouselImage;
    index: number;
    count: number;
    loop: boolean;
    /** Posição do trilho (arrasto/animação) */
    x: MotionValue<number>;
    /** Largura de um slide, como MotionValue para o cálculo nunca ficar desatualizado */
    slideWidth: MotionValue<number>;
    overlayColor: string;
    overlayOpacity: number;
    slideClassName: string;
    /** true = 1 slide por tela também no `lg:` */
    lgSingle: boolean;
};

/**
 * Cada slide se reposiciona de forma circular: quando sai por um lado da
 * janela visível, reaparece do outro. Como a imagem é a mesma, o loop é
 * contínuo e não existe "pulo" nem limite de arrasto.
 */
function Slide({
    image,
    index,
    count,
    loop,
    x,
    slideWidth,
    overlayColor,
    overlayOpacity,
    slideClassName,
    lgSingle,
}: SlideProps) {
    const offset = useTransform([x, slideWidth], ([xValue, width]: number[]) => {
        if (!loop || !width) return 0;

        const cycle = count * width;
        // posição na tela se o slide ficasse no lugar natural dele
        const natural = index * width + xValue;
        // mantém o slide dentro de [-1 slide, count - 1 slides): cobre toda a janela visível
        const wrapped = mod(natural + width, cycle) - width;

        return wrapped - natural;
    });

    return (
        <motion.div
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${count}`}
            className={`shrink-0 basis-full px-1.5 sm:basis-1/2 ${lgSingle ? "lg:basis-full" : ""}`}
            style={{ x: offset }}
        >
            <div
                className={`relative w-full overflow-hidden ${slideClassName}`}
                style={{ backgroundColor: `${BLUE}1a` }}
            >
                {isVideo(image) ? (
                    <SlideVideo src={image.src} poster={image.poster} alt={image.alt} />
                ) : (
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        draggable={false}
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 80vw"
                        className="select-none object-cover"
                    />
                )}
                {/* filtro de cor: só sobre a imagem */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
                />
            </div>
        </motion.div>
    );
}

export default function Carousel({
    images,
    label = "Galeria de imagens",
    className = "",
    overlayColor = "#000000",
    overlayOpacity = 0,
    slideClassName = "aspect-[4/5]",
    slidesFromLg = 2,
}: CarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef(0);
    const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
    const x = useMotionValue(0);
    const slideWidthValue = useMotionValue(0);

    const [width, setWidth] = useState(0);
    const visible = useVisibleSlides(slidesFromLg);

    const count = images.length;
    // só faz loop quando há mais slides do que cabem na tela
    const canSlide = count > visible;
    const slideWidth = width / visible;

    // Mede a largura do carrossel (e acompanha o resize da janela)
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new ResizeObserver(() => setWidth(el.offsetWidth));
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Reposiciona sem animar quando a largura ou a quantidade de slides visíveis muda
    useEffect(() => {
        controlsRef.current?.stop();
        slideWidthValue.set(slideWidth);

        const target = canSlide ? mod(targetRef.current, count) : 0;
        targetRef.current = target;
        x.set(-target * slideWidth);
    }, [slideWidth, canSlide, count, x, slideWidthValue]);

    /** `target` é um número inteiro de slides e pode ser qualquer valor (inclusive negativo ou maior que o total) */
    const goTo = useCallback(
        (target: number, velocity = 0) => {
            if (!canSlide || !slideWidth) return;
            // ao trocar de slide, pausa qualquer vídeo que esteja tocando
            if (target !== targetRef.current) {
                containerRef.current?.querySelectorAll("video").forEach((video) => video.pause());
            }
            targetRef.current = target;
            controlsRef.current?.stop();
            // A velocidade do arrasto é passada para a mola, então o movimento continua de onde o dedo parou
            controlsRef.current = animate(x, -target * slideWidth, {
                ...SPRING,
                velocity,
            });
        },
        [canSlide, slideWidth, x],
    );

    const handleDragEnd = (_event: unknown, info: PanInfo) => {
        if (!slideWidth) return;
        const position = -x.get() / slideWidth;
        let target = Math.round(position);

        // Um "flick" rápido troca de slide mesmo com pouco arrasto
        if (Math.abs(info.velocity.x) > 350) {
            target = info.velocity.x < 0 ? Math.ceil(position) : Math.floor(position);
        }
        goTo(target, info.velocity.x);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(targetRef.current - 1);
        }
        if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(targetRef.current + 1);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={className}
            role="region"
            aria-roledescription="carousel"
            aria-label={label}
            tabIndex={canSlide ? 0 : undefined}
            onKeyDown={handleKeyDown}
        >
            {/* -mx-1.5 compensa o px-1.5 dos slides, alinhando as imagens com as bordas do container */}
            <div ref={containerRef} className="-mx-1.5 overflow-hidden">
                <motion.div
                    className={`flex touch-pan-y ${canSlide ? "cursor-grab active:cursor-grabbing" : ""
                        }`}
                    style={{ x }}
                    // sem dragConstraints: o arrasto é livre nos dois sentidos (loop infinito)
                    drag={canSlide ? "x" : false}
                    dragMomentum={false}
                    onDragEnd={handleDragEnd}
                >
                    {images.map((image, i) => (
                        <Slide
                            // a key muda com o breakpoint para o cálculo do slide ser recriado
                            key={`${visible}-${i}-${image.src}`}
                            image={image}
                            index={i}
                            count={count}
                            loop={canSlide}
                            x={x}
                            slideWidth={slideWidthValue}
                            overlayColor={overlayColor}
                            overlayOpacity={overlayOpacity}
                            slideClassName={slideClassName}
                            lgSingle={slidesFromLg === 1}
                        />
                    ))}
                </motion.div>
            </div>            
        </motion.div>
    );
}