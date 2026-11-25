"use client";

import Image from "next/image";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
    type KeyboardEvent,
    type MouseEvent,
    type PointerEvent,
} from "react";
import {
    animate,
    motion,
    useInView,
    useMotionValue,
    useReducedMotion,
    useTransform,
    type MotionValue,
    type PanInfo,
} from "framer-motion";

export type CarouselImage = {
    src: string;
    alt: string;
    type?: "image" | "video";
    poster?: string;
};

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i;

const isVideo = (item: CarouselImage) =>
    item.type === "video" || (item.type === undefined && VIDEO_EXTENSIONS.test(item.src));

type CarouselProps = {
    images: CarouselImage[];
    label?: string;
    className?: string;
    overlayColor?: string;
    overlayOpacity?: number;
    slideClassName?: string;
    slidesFromLg?: 1 | 2;
    /** Troca as imagens sozinho. */
    autoPlay?: boolean;
    /** Tempo médio entre as trocas, em ms. O tempo real varia a cada troca. */
    interval?: number;
};

const BLUE = "#5b7a8c";

const SPRING = { type: "spring", stiffness: 140, damping: 24, mass: 0.9 } as const;
/** Movimento máximo (px) para o gesto ainda contar como clique/toque. */
const TAP_SLOP = 6;
const mod = (value: number, divisor: number) =>
    ((value % divisor) + divisor) % divisor;

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
                    if (event.detail > 0 && Math.abs(event.clientX - pointerStartX.current) > TAP_SLOP) return;
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
    x: MotionValue<number>;
    slideWidth: MotionValue<number>;
    overlayColor: string;
    overlayOpacity: number;
    slideClassName: string;
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
        const natural = index * width + xValue;
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
    autoPlay = true,
    interval = 4000,
}: CarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef(0);
    const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
    const pressedRef = useRef(false);
    const hoveredRef = useRef(false);
    const pressStartRef = useRef({ x: 0, y: 0 });
    const x = useMotionValue(0);
    const slideWidthValue = useMotionValue(0);

    const [width, setWidth] = useState(0);
    /** Muda a cada interação manual para reiniciar a contagem da troca automática. */
    const [timerReset, setTimerReset] = useState(0);
    const visible = useVisibleSlides(slidesFromLg);
    const inView = useInView(containerRef, { amount: 0.5 });
    const reducedMotion = useReducedMotion();

    const count = images.length;
    const canSlide = count > visible;
    const slideWidth = width / visible;

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new ResizeObserver(() => setWidth(el.offsetWidth));
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        controlsRef.current?.stop();
        slideWidthValue.set(slideWidth);

        const target = canSlide ? mod(targetRef.current, count) : 0;
        targetRef.current = target;
        x.set(-target * slideWidth);
    }, [slideWidth, canSlide, count, x, slideWidthValue]);

    const goTo = useCallback(
        (target: number, velocity = 0) => {
            if (!canSlide || !slideWidth) return;
            if (target !== targetRef.current) {
                containerRef.current?.querySelectorAll("video").forEach((video) => video.pause());
            }
            targetRef.current = target;
            controlsRef.current?.stop();
            controlsRef.current = animate(x, -target * slideWidth, {
                ...SPRING,
                velocity,
            });
        },
        [canSlide, slideWidth, x],
    );

    const restartTimer = () => setTimerReset((value) => value + 1);

    // Troca automática. Cada carrossel sorteia o próprio tempo a cada troca,
    // por isso vários na mesma tela não andam juntos.
    useEffect(() => {
        if (!autoPlay || reducedMotion || !inView || !canSlide) return;
        let timeout: number;

        const schedule = (delay: number) => {
            timeout = window.setTimeout(() => {
                const videoPlaying = Array.from(
                    containerRef.current?.querySelectorAll("video") ?? [],
                ).some((video) => !video.paused);

                if (!document.hidden && !pressedRef.current && !hoveredRef.current && !videoPlaying) {
                    goTo(targetRef.current + 1);
                }
                schedule(interval * (0.7 + Math.random() * 0.8));
            }, delay);
        };

        // A primeira espera varia mais, para já começarem desencontrados.
        schedule(interval * (0.35 + Math.random()));
        return () => window.clearTimeout(timeout);
    }, [autoPlay, reducedMotion, inView, canSlide, interval, goTo, timerReset]);

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) return;
        pressedRef.current = true;
        pressStartRef.current = { x: event.clientX, y: event.clientY };

        // Escuta na janela porque o dedo/mouse pode ser solto fora do carrossel.
        const release = (end: globalThis.PointerEvent) => {
            pressedRef.current = false;
            window.removeEventListener("pointerup", release);
            window.removeEventListener("pointercancel", release);
            // Ex.: a página rolou no meio do gesto; encaixa o slide de volta.
            if (end.type === "pointercancel") goTo(targetRef.current);
        };
        window.addEventListener("pointerup", release);
        window.addEventListener("pointercancel", release);
    };

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        const start = pressStartRef.current;
        // Arrasto não é clique.
        if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > TAP_SLOP) return;
        // No vídeo o clique continua sendo play/pause; só garante o slide encaixado.
        if ((event.target as HTMLElement).closest("button")) {
            goTo(targetRef.current);
            return;
        }
        goTo(targetRef.current + 1);
        restartTimer();
    };

    const handleDragEnd = (_event: unknown, info: PanInfo) => {
        if (!slideWidth) return;
        // Tremida de poucos pixels é um toque: quem troca é o handleClick.
        if (Math.hypot(info.offset.x, info.offset.y) <= TAP_SLOP) {
            goTo(targetRef.current);
            return;
        }
        const position = -x.get() / slideWidth;
        let target = Math.round(position);

        if (Math.abs(info.velocity.x) > 350) {
            target = info.velocity.x < 0 ? Math.ceil(position) : Math.floor(position);
        }
        goTo(target, info.velocity.x);
        restartTimer();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(targetRef.current - 1);
            restartTimer();
        }
        if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(targetRef.current + 1);
            restartTimer();
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
            <div
                ref={containerRef}
                className="-mx-1.5 overflow-hidden"
                onPointerDown={handlePointerDown}
                onClick={handleClick}
                // Pausa só com mouse: no celular não existe "passar por cima".
                onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") hoveredRef.current = true;
                }}
                onPointerLeave={() => {
                    hoveredRef.current = false;
                }}
            >
                <motion.div
                    className={`flex touch-pan-y select-none ${
                        canSlide ? "cursor-pointer active:cursor-grabbing" : ""
                    }`}
                    style={{ x }}
                    drag={canSlide ? "x" : false}
                    dragMomentum={false}
                    onDragEnd={handleDragEnd}
                >
                    {images.map((image, i) => (
                        <Slide
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