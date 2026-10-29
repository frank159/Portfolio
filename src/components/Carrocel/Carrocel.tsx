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
};

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
};

const BLUE = "#5b7a8c";

/** Mola mais macia: acelera suave e desacelera sem "quicar" */
const SPRING = { type: "spring", stiffness: 140, damping: 24, mass: 0.9 } as const;

/** Resto da divisão que sempre dá resultado positivo (funciona com negativos) */
const mod = (value: number, divisor: number) =>
    ((value % divisor) + divisor) % divisor;

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
            className="shrink-0 basis-full px-1.5 sm:basis-1/2"
            style={{ x: offset }}
        >
            <div
                className={`relative w-full overflow-hidden ${slideClassName}`}
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
}: CarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef(0);
    const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
    const x = useMotionValue(0);
    const slideWidthValue = useMotionValue(0);

    const [width, setWidth] = useState(0);
    const visible = useVisibleSlides();

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
                        />
                    ))}
                </motion.div>
            </div>

            {/* Setas só a partir do tablet; no mobile a navegação é por arrastar */}
            {canSlide && (
                <div className="mt-5 hidden items-center justify-center gap-3 sm:flex">
                    <motion.button
                        type="button"
                        onClick={() => goTo(targetRef.current - 1)}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Imagem anterior"
                        className="flex h-9 w-9 items-center justify-center border transition-colors hover:bg-[#5b7a8c] hover:text-[#f9fadb]"
                        style={{ borderColor: BLUE, color: BLUE }}
                    >
                        <Chevron direction="left" />
                    </motion.button>

                    <motion.button
                        type="button"
                        onClick={() => goTo(targetRef.current + 1)}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Próxima imagem"
                        className="flex h-9 w-9 items-center justify-center border transition-colors hover:bg-[#5b7a8c] hover:text-[#f9fadb]"
                        style={{ borderColor: BLUE, color: BLUE }}
                    >
                        <Chevron direction="right" />
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
}