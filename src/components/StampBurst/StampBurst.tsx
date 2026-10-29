"use client";

import {
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";

/* ==========================================================================
   FOGOS DO CARIMBO (100% Original + Performance Otimizada)
   ========================================================================== */

const RED = "#8b0000";
const BLUE = "#5a7a8a";

const OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const RAYS = 12;
const BURST_LIFETIME = 1300;
const MAX_BURSTS = 4;

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const rad = (deg: number) => (deg * Math.PI) / 180;

type Streak = {
    angle: number;
    color: string;
    length: number;
    from: number;
    to: number;
    delay: number;
    duration: number;
};

type Ember = {
    sx: number;
    sy: number;
    ex: number;
    ey: number;
    size: number;
    color: string;
    delay: number;
    duration: number;
};

type Sparkle = {
    x: number;
    y: number;
    size: number;
    color: string;
    delay: number;
    rotate: number;
};

type Burst = {
    id: number;
    streaks: Streak[];
    embers: Ember[];
    sparkles: Sparkle[];
};

function makeBurst(id: number): Burst {
    const step = 360 / RAYS;
    const spin = rand(0, step);

    const streaks: Streak[] = Array.from({ length: RAYS }, (_, i) => {
        const long = i % 2 === 0;
        return {
            angle: spin + i * step + rand(-3, 3),
            color: long ? RED : BLUE,
            length: long ? 13 : 8,
            from: 44,
            to: long ? rand(72, 78) : rand(60, 66),
            delay: rand(0, 0.04),
            duration: rand(0.7, 0.85),
        };
    });

    const embers: Ember[] = Array.from({ length: RAYS }, (_, i) => {
        const a = rad(spin + i * step + step / 2 + rand(-5, 5));
        const from = 38;
        const to = rand(54, 70);
        return {
            sx: Math.cos(a) * from,
            sy: Math.sin(a) * from,
            ex: Math.cos(a) * to,
            ey: Math.sin(a) * to + rand(6, 12),
            size: rand(2.5, 3.6),
            color: i % 2 === 0 ? BLUE : RED,
            delay: rand(0.05, 0.14),
            duration: rand(0.85, 1.05),
        };
    });

    const sparkles: Sparkle[] = Array.from({ length: 4 }, (_, i) => {
        const a = rad(spin + step / 2 + i * 90 + rand(-12, 12));
        const r = rand(66, 76);
        return {
            x: Math.cos(a) * r,
            y: Math.sin(a) * r,
            size: rand(9, 12),
            color: i % 2 === 0 ? RED : BLUE,
            delay: rand(0.12, 0.26),
            rotate: rand(60, 120) * (i % 2 === 0 ? 1 : -1),
        };
    });

    return { id, streaks, embers, sparkles };
}

/* ---------- Uma explosão (Layout original exato + aceleração GPU) ---------- */
const BurstLayer = memo(function BurstLayer({ burst }: { burst: Burst }) {
    return (
        <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10"
        >
            {/* Clarão suave no centro */}
            <motion.span
                className="absolute inset-[14%] rounded-full will-change-[transform,opacity]"
                style={{
                    background:
                        "radial-gradient(circle, rgba(139,0,0,0.22) 0%, rgba(139,0,0,0) 70%)",
                }}
                initial={{ scale: 0.4, opacity: 1 }}
                animate={{ scale: 1.25, opacity: 0 }}
                transition={{ duration: 0.5, ease: OUT }}
            />

            {/* Anel azul fino */}
            <motion.span
                className="absolute inset-0 rounded-full border will-change-[transform,opacity]"
                style={{ borderColor: BLUE }}
                initial={{ scale: 0.8, opacity: 0.55 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.8, ease: OUT }}
            />

            {/* Anel vermelho, menor e um instante depois */}
            <motion.span
                className="absolute inset-[8%] rounded-full border will-change-[transform,opacity]"
                style={{ borderColor: RED }}
                initial={{ scale: 0.7, opacity: 0.45 }}
                animate={{ scale: 1.25, opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.06, ease: OUT }}
            />

            {/* Raios */}
            {burst.streaks.map((s, i) => (
                <span
                    key={`s${i}`}
                    className="absolute left-1/2 top-1/2 h-0 w-0"
                    style={{ transform: `rotate(${s.angle}deg)` }}
                >
                    <motion.span
                        className="absolute block rounded-full will-change-[transform,opacity]"
                        style={{
                            left: 0,
                            top: -0.75,
                            height: 1.5,
                            width: s.length,
                            background: s.color,
                            transformOrigin: "100% 50%",
                        }}
                        initial={{ x: s.from, scaleX: 0.25, opacity: 0 }}
                        animate={{
                            x: s.to,
                            scaleX: [0.25, 1, 0.2],
                            opacity: [0, 1, 1, 0],
                        }}
                        transition={{
                            x: { duration: s.duration, delay: s.delay, ease: OUT },
                            scaleX: {
                                duration: s.duration,
                                delay: s.delay,
                                times: [0, 0.2, 1],
                                ease: "easeOut",
                            },
                            opacity: {
                                duration: s.duration,
                                delay: s.delay,
                                times: [0, 0.08, 0.55, 1],
                                ease: "linear",
                            },
                        }}
                    />
                </span>
            ))}

            {/* Brasas */}
            {burst.embers.map((e, i) => (
                <motion.span
                    key={`e${i}`}
                    className="absolute left-1/2 top-1/2 rounded-full will-change-[transform,opacity]"
                    style={{
                        width: e.size,
                        height: e.size,
                        marginLeft: -e.size / 2,
                        marginTop: -e.size / 2,
                        background: e.color,
                    }}
                    initial={{ x: e.sx, y: e.sy, scale: 0.4, opacity: 0 }}
                    animate={{
                        x: e.ex,
                        y: e.ey,
                        scale: [0.4, 1, 0.3],
                        opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                        x: { duration: e.duration, delay: e.delay, ease: OUT },
                        y: { duration: e.duration, delay: e.delay, ease: "easeOut" },
                        scale: {
                            duration: e.duration,
                            delay: e.delay,
                            times: [0, 0.2, 1],
                            ease: "easeOut",
                        },
                        opacity: {
                            duration: e.duration,
                            delay: e.delay,
                            times: [0, 0.1, 0.6, 1],
                            ease: "linear",
                        },
                    }}
                />
            ))}

            {/* Brilhos de 4 pontas */}
            {burst.sparkles.map((s, i) => (
                <motion.svg
                    key={`k${i}`}
                    viewBox="0 0 10 10"
                    className="absolute left-1/2 top-1/2 will-change-[transform,opacity]"
                    style={{
                        width: s.size,
                        height: s.size,
                        marginLeft: -s.size / 2,
                        marginTop: -s.size / 2,
                    }}
                    initial={{ x: s.x * 0.7, y: s.y * 0.7, scale: 0, rotate: 0, opacity: 0 }}
                    animate={{
                        x: s.x,
                        y: s.y,
                        scale: [0, 1, 0],
                        rotate: s.rotate,
                        opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                        x: { duration: 0.7, delay: s.delay, ease: OUT },
                        y: { duration: 0.7, delay: s.delay, ease: OUT },
                        rotate: { duration: 0.7, delay: s.delay, ease: OUT },
                        scale: {
                            duration: 0.7,
                            delay: s.delay,
                            times: [0, 0.35, 1],
                            ease: "easeInOut",
                        },
                        opacity: {
                            duration: 0.7,
                            delay: s.delay,
                            times: [0, 0.15, 0.7, 1],
                            ease: "linear",
                        },
                    }}
                >
                    <path
                        d="M5 0C5.5 3.2 6.8 4.5 10 5C6.8 5.5 5.5 6.8 5 10C4.5 6.8 3.2 5.5 0 5C3.2 4.5 4.5 3.2 5 0Z"
                        fill={s.color}
                    />
                </motion.svg>
            ))}
        </span>
    );
});

/* ---------- Wrapper clicável ---------- */
export default function StampBurst({
    children,
    className = "h-28 w-28",
}: {
    children: ReactNode;
    className?: string;
}) {
    const reduceMotion = useReducedMotion();
    const controls = useAnimationControls();
    const [bursts, setBursts] = useState<Burst[]>([]);
    const idRef = useRef(0);
    const timersRef = useRef<number[]>([]);

    useEffect(() => {
        const timers = timersRef.current;
        return () => timers.forEach((t) => window.clearTimeout(t));
    }, []);

    const fire = useCallback(() => {
        if (reduceMotion) return;

        controls.start({
            scale: [1, 0.92, 1.04, 1],
            transition: { duration: 0.5, times: [0, 0.22, 0.6, 1], ease: "easeOut" },
        });

        const burst = makeBurst(++idRef.current);
        setBursts((prev) => [...prev.slice(-(MAX_BURSTS - 1)), burst]);

        const t = window.setTimeout(() => {
            setBursts((prev) => prev.filter((b) => b.id !== burst.id));
        }, BURST_LIFETIME);
        timersRef.current.push(t);
    }, [reduceMotion, controls]);

    return (
        <div className={`relative select-none ${className}`}>
            <button
                type="button"
                onClick={fire}
                aria-label="Carimbo Guará Estúdio. Clique para ver um efeito de fogos."
                className="block h-full w-full cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 [-webkit-tap-highlight-color:transparent]"
                style={{ outlineColor: BLUE }}
            >
                <motion.span animate={controls} className="block h-full w-full">
                    {children}
                </motion.span>
            </button>

            {bursts.map((b) => (
                <BurstLayer key={b.id} burst={b} />
            ))}
        </div>
    );
}