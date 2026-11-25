"use client";

import { useCallback, useEffect, useId, useRef } from "react";

const W = 578;
const H = 263;
const CX = W / 2;
const CY = H / 2;

const IRIS_R = 114;
const SPIKES = 12;
const STAR_OUTER = 112;
const STAR_INNER = 14;


const MAX_X = 140;
const MAX_Y = 48;
const REACH_X = 220;
const REACH_Y = 150;
const STIFFNESS = 260;
const DAMPING_RATIO = 0.65;
const STAR_PARALLAX = 0.12;
const IDLE_MS = 5000;


const CLOSE_MS = 90;
const OPEN_MS = 170;
const MIN_OPEN = 0.04;
const BLINK_MS = CLOSE_MS + OPEN_MS;
const AUTO_MIN_MS = 2500;
const AUTO_MAX_MS = 6000;
const DOUBLE_CHANCE = 0.15;
const DOUBLE_GAP_MS = 320;

const randomBlinkDelay = () =>
    AUTO_MIN_MS + Math.random() * (AUTO_MAX_MS - AUTO_MIN_MS);


function lidOpenness(elapsed: number) {
    if (elapsed < 0 || elapsed >= BLINK_MS) return 1;
    if (elapsed < CLOSE_MS) {
        const t = elapsed / CLOSE_MS;
        return 1 - (1 - MIN_OPEN) * t * t;
    }
    const t = (elapsed - CLOSE_MS) / OPEN_MS;
    return MIN_OPEN + (1 - MIN_OPEN) * (1 - (1 - t) * (1 - t));
}


const lidPoints = (open: number) =>
    `0,${CY} ${CX},${CY - CY * open} ${W},${CY} ${CX},${CY + CY * open}`;

function starPoints() {
    const pts: string[] = [];
    for (let i = 0; i < SPIKES * 2; i++) {
        const r = i % 2 === 0 ? STAR_OUTER : STAR_INNER;
        const a = (Math.PI * i) / SPIKES - Math.PI / 2;
        pts.push(`${(CX + Math.cos(a) * r).toFixed(1)},${(CY + Math.sin(a) * r).toFixed(1)}`);
    }
    return pts.join(" ");
}

type OlhoProps = {
    className?: string;
    autoBlink?: boolean;
};

export default function Olho({ className = "", autoBlink = true }: OlhoProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const lookRef = useRef<SVGGElement>(null);
    const starRef = useRef<SVGPolygonElement>(null);
    const lidClipRef = useRef<SVGPolygonElement>(null);
    const lidFillRef = useRef<SVGPolygonElement>(null);
    const blinkStartRef = useRef(-Infinity);
    const nextBlinkRef = useRef(Infinity);

    const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const lidId = `olho-palpebra-${id}`;
    const irisId = `olho-iris-${id}`;

    const blink = useCallback(() => {
        const now = performance.now();
        if (now - blinkStartRef.current < BLINK_MS) return;
        blinkStartRef.current = now;
    }, []);


    const blinkAndRestartTimer = () => {
        blink();
        nextBlinkRef.current = performance.now() + randomBlinkDelay();
    };

    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const aim = { x: 0, y: 0 };
        const jitter = { x: 0, y: 0 };
        const pos = { x: 0, y: 0 };
        const vel = { x: 0, y: 0 };

        let last = performance.now();
        let lastMove = last;
        let nextWander = 0;
        let nextJitter = 0;
        let wasDouble = false;
        let raf = 0;

        nextBlinkRef.current = last + randomBlinkDelay();

        const onMove = (e: PointerEvent) => {
            const svg = svgRef.current;
            if (!svg) return;
            const r = svg.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);

            aim.x = Math.tanh(dx / REACH_X);
            aim.y = Math.tanh(dy / REACH_Y);
            lastMove = performance.now();
        };

        const onLeave = () => {
            aim.x = 0;
            aim.y = 0;
        };

        const tick = (now: number) => {
            const dt = Math.min((now - last) / 1000, 1 / 30);
            last = now;

            if (!reduce) {

                if (now - lastMove > IDLE_MS && now > nextWander) {
                    aim.x = Math.random() * 2 - 1;
                    aim.y = (Math.random() * 2 - 1) * 0.8;
                    nextWander = now + 1200 + Math.random() * 2200;
                }

                if (now > nextJitter) {
                    jitter.x = (Math.random() * 2 - 1) * 2.5;
                    jitter.y = (Math.random() * 2 - 1) * 1.2;
                    nextJitter = now + 400 + Math.random() * 800;
                }

                if (autoBlink && now >= nextBlinkRef.current) {
                    blink();
                    const isDouble: boolean = !wasDouble && Math.random() < DOUBLE_CHANCE;
                    nextBlinkRef.current = now + (isDouble ? DOUBLE_GAP_MS : randomBlinkDelay());
                    wasDouble = isDouble;
                }
            }


            const tx = aim.x * MAX_X + jitter.x;
            const ty = aim.y * MAX_Y + jitter.y;
            const c = 2 * Math.sqrt(STIFFNESS) * DAMPING_RATIO;
            vel.x += (STIFFNESS * (tx - pos.x) - c * vel.x) * dt;
            vel.y += (STIFFNESS * (ty - pos.y) - c * vel.y) * dt;
            pos.x += vel.x * dt;
            pos.y += vel.y * dt;


            lookRef.current?.setAttribute(
                "transform",
                `translate(${pos.x.toFixed(2)} ${pos.y.toFixed(2)})`
            );
            starRef.current?.setAttribute(
                "transform",
                `translate(${(pos.x * STAR_PARALLAX).toFixed(2)} ${(pos.y * STAR_PARALLAX).toFixed(2)})`
            );


            const points = lidPoints(lidOpenness(now - blinkStartRef.current));
            lidClipRef.current?.setAttribute("points", points);
            lidFillRef.current?.setAttribute("points", points);

            raf = requestAnimationFrame(tick);
        };

        window.addEventListener("pointermove", onMove);
        document.documentElement.addEventListener("mouseleave", onLeave);
        raf = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("pointermove", onMove);
            document.documentElement.removeEventListener("mouseleave", onLeave);
            cancelAnimationFrame(raf);
        };
    }, [autoBlink, blink]);

    return (
        <svg
            ref={svgRef}
            className={className}
            viewBox={`0 0 ${W} ${H}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <clipPath id={lidId}>
                    <polygon ref={lidClipRef} points={lidPoints(1)} />
                </clipPath>
                <clipPath id={irisId}>
                    <circle cx={CX} cy={CY} r={IRIS_R} />
                </clipPath>
            </defs>

            <g
                onClick={blinkAndRestartTimer}
                onMouseDown={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        blinkAndRestartTimer();
                    }
                }}
                role="button"
                tabIndex={0}
                aria-label="Olho. Clique para piscar"
                style={{ cursor: "pointer" }}
            >
                <polygon ref={lidFillRef} points={lidPoints(1)} fill="#D9D9D9" />

                <g clipPath={`url(#${lidId})`}>
                    <g ref={lookRef}>
                        <circle cx={CX} cy={CY} r={IRIS_R} fill="#7A0000" />
                        <g clipPath={`url(#${irisId})`}>
                            <polygon ref={starRef} points={starPoints()} fill="#5F7F8C" />
                        </g>
                    </g>
                </g>

                <polygon points={lidPoints(1)} fill="transparent" />
            </g>
        </svg>
    );
}