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
import { animate, motion, useMotionValue, type PanInfo } from "framer-motion";

export type CarouselImage = {
    src: string;
    alt: string;
};

type CarouselProps = {
    images: CarouselImage[];
    label?: string;
    className?: string;
};

const BLUE = "#5b7a8c";

/** Mola mais macia: acelera suave e desacelera sem "quicar" */
const SPRING = { type: "spring", stiffness: 140, damping: 24, mass: 0.9 } as const;

/** 1 slide visível no mobile, 2 a partir de 640px (mesmo breakpoint do `sm:` do Tailwind). */
function useVisibleSlides() {
    return useSyncExternalStore(
        (onChange) => {
            const mq = window.matchMedia("(min-width: 640px)");
            mq.addEventListener("change", onChange);
            return () => mq.removeEventListener("change", onChange);
        },
        () => (window.matchMedia("(min-width: 640px)").matches ? 2 : 1),
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

export default function Carousel({
    images,
    label = "Galeria de imagens",
    className = "",
}: CarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const indexRef = useRef(0);
    const x = useMotionValue(0);

    const [width, setWidth] = useState(0);
    const [index, setIndex] = useState(0);
    const visible = useVisibleSlides();

    const maxIndex = Math.max(0, images.length - visible);
    const current = Math.min(index, maxIndex);
    const slideWidth = width / visible;
    const canSlide = maxIndex > 0;

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
        const clamped = Math.min(indexRef.current, maxIndex);
        indexRef.current = clamped;
        x.set(-clamped * slideWidth);
    }, [slideWidth, maxIndex, x]);

    const goTo = useCallback(
        (target: number, velocity = 0) => {
            const clamped = Math.min(Math.max(target, 0), maxIndex);
            indexRef.current = clamped;
            setIndex(clamped);
            // A velocidade do arrasto é passada para a mola, então o movimento continua de onde o dedo parou
            animate(x, -clamped * slideWidth, { ...SPRING, velocity });
        },
        [maxIndex, slideWidth, x],
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
            goTo(current - 1);
        }
        if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(current + 1);
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
                    drag={canSlide ? "x" : false}
                    dragConstraints={{ left: -maxIndex * slideWidth, right: 0 }}
                    dragElastic={0.2}
                    dragMomentum={false}
                    onDragEnd={handleDragEnd}
                >
                    {images.map((image, i) => (
                        <div
                            key={image.src}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${i + 1} de ${images.length}`}
                            className="shrink-0 basis-full px-1.5 sm:basis-1/2"
                        >
                            <div
                                className="relative aspect-[4/5] w-full overflow-hidden"
                                style={{ backgroundColor: `${BLUE}1a` }}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    draggable={false}
                                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 80vw"
                                    className="select-none object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Setas só a partir do tablet; no mobile a navegação é por arrastar */}
            {canSlide && (
                <div className="mt-5 hidden items-center justify-center gap-3 sm:flex">
                    <motion.button
                        type="button"
                        onClick={() => goTo(current - 1)}
                        disabled={current === 0}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Imagem anterior"
                        className="flex h-9 w-9 items-center justify-center border transition-colors hover:bg-[#5b7a8c] hover:text-[#f9fadb] disabled:pointer-events-none disabled:opacity-30"
                        style={{ borderColor: BLUE, color: BLUE }}
                    >
                        <Chevron direction="left" />
                    </motion.button>

                    <motion.button
                        type="button"
                        onClick={() => goTo(current + 1)}
                        disabled={current === maxIndex}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Próxima imagem"
                        className="flex h-9 w-9 items-center justify-center border transition-colors hover:bg-[#5b7a8c] hover:text-[#f9fadb] disabled:pointer-events-none disabled:opacity-30"
                        style={{ borderColor: BLUE, color: BLUE }}
                    >
                        <Chevron direction="right" />
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
}