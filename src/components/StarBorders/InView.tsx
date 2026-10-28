"use client";

import Image from "next/image";
import { motion, MotionConfig, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/* Se o seu projeto usa o pacote antigo, troque o import acima por:
   import { motion, MotionConfig, type Variants } from "framer-motion"; */

const LINE_COLOR = "#5b7a8c";
const SPARK_COLOR = "#5b7a8c";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const DRAW_DELAY = 0.01;
const DRAW_TIME = 1.6;

/**
 * Wrapper que dispara a animação dos filhos (StarMark / StarLine)
 * quando entra na tela, uma única vez.
 */
export function Reveal({
    children,
    className,
    ...rest
}: {
    children: ReactNode;
    className?: string;
    "aria-hidden"?: boolean;
}) {
    return (
        <MotionConfig reducedMotion="user">
            <motion.div
                className={className}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.5, margin: "0px 0px -12% 0px" }}
                {...rest}
            >
                {children}
            </motion.div>
        </MotionConfig>
    );
}

/* ---------- Estrela: gira ao entrar + anéis de pulso saindo do centro ---------- */
const starVariants: Variants = {
    hidden: { opacity: 0, scale: 0, rotate: -200 },
    show: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { type: "spring", stiffness: 140, damping: 11 },
    },
};

const ringVariants = (delay: number, duration: number): Variants => ({
    hidden: { opacity: 0, scale: 0.3 },
    show: {
        opacity: [0.65, 0],
        scale: [0.3, 2.8],
        transition: { duration, delay, ease: "easeOut" },
    },
});

/** Posição e tamanho vêm do className (a animação fica nos elementos internos). */
export function StarMark({ className = "" }: { className?: string }) {
    return (
        <span aria-hidden className={className}>

            <motion.span variants={starVariants} className="block h-full w-full">
                <Image
                    src="/imgs/Star.png"
                    alt=""
                    width={90}
                    height={90}
                    className="h-full w-full"
                />
            </motion.span>
        </span>
    );
}

/* ---------- Linha: cresce a partir do lado da estrela, com faísca na ponta ---------- */
type Side = "left" | "right" | "grow";

/**
 * left  -> lado esquerdo da estrela (cresce para a esquerda)
 * right -> lado direito da estrela (cresce para a direita)
 * grow  -> linha de título (cresce a partir do início, para a direita)
 */
export function StarLine({
    side = "grow",
    className = "",
}: {
    side?: Side;
    className?: string;
}) {
    const toLeft = side === "left";

    const barVariants: Variants = {
        hidden: { scaleX: 0 },
        show: {
            scaleX: 1,
            transition: { duration: DRAW_TIME, delay: DRAW_DELAY, ease: EASE_OUT },
        },
    };

    // a faísca usa o mesmo easing/duração da linha, então fica sempre na ponta
    const sparkVariants: Variants = {
        hidden: { opacity: 0, left: toLeft ? "100%" : "0%" },
        show: {
            left: toLeft ? ["100%", "0%"] : ["0%", "100%"],
            opacity: [0, 1, 1, 0],
            transition: {
                left: { duration: DRAW_TIME, delay: DRAW_DELAY, ease: EASE_OUT },
                opacity: {
                    duration: DRAW_TIME,
                    delay: DRAW_DELAY,
                    times: [0, 0.08, 0.72, 1],
                    ease: "linear",
                },
            },
        },
    };

    return (
        <div aria-hidden className={`relative h-px ${className}`}>
            <motion.div
                variants={barVariants}
                className="absolute inset-0"
                style={{
                    background: LINE_COLOR,
                    transformOrigin: toLeft ? "100% 50%" : "0% 50%",
                }}
            />
            <motion.span
                variants={sparkVariants}
                className="pointer-events-none absolute top-1/2 h-[3px] w-[72px] rounded-full"
                style={{
                    marginTop: -1.5,
                    x: toLeft ? "0%" : "-100%",
                    background: `linear-gradient(${toLeft ? 90 : 270}deg, ${SPARK_COLOR}, transparent)`,
                    filter: `drop-shadow(0 0 5px ${SPARK_COLOR})`,
                }}
            />
        </div>
    );
}