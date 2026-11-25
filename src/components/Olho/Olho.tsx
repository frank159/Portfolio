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


const TOUCH_IDLE_MS = 2500;
const TOUCH_HOLD_MS = 1200;


const DILATE_MS = 1100;
const DILATE_SCALE = 0.22;
const STAR_INNER_FAT = 38;


const SWING_X = 0.55;
const SWING_Y = 0.8;
const SHAKE_COUNT = 16;
const SHAKE_WINDOW_MS = 2200;
const DIZZY_MS = 3200;
const DIZZY_COOLDOWN_MS = 900;


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

function starPoints(inner = STAR_INNER) {
    const pts: string[] = [];
    for (let i = 0; i < SPIKES * 2; i++) {
        const r = i % 2 === 0 ? STAR_OUTER : inner;
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
    const dilateUntilRef = useRef(0);

    const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const lidId = `olho-palpebra-${id}`;
    const irisId = `olho-iris-${id}`;

    const blink = useCallback(() => {
        const now = performance.now();
        if (now - blinkStartRef.current < BLINK_MS) return;
        blinkStartRef.current = now;
    }, []);


    const handlePress = () => {
        blink();
        dilateUntilRef.current = performance.now() + DILATE_MS;
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

        let idleMs = IDLE_MS;
        let releaseAt = Infinity;

        const dilate = { value: 0, vel: 0 };

        let dizzyStart = -Infinity;
        let swings: number[] = [];
        const axisX = { dir: 0, edge: 0 };
        const axisY = { dir: 0, edge: 0 };

        nextBlinkRef.current = last + randomBlinkDelay();


        const turned = (axis: { dir: number; edge: number }, value: number, min: number) => {
            const delta = value - axis.edge;
            if (axis.dir === 0) {

                if (Math.abs(delta) >= min / 2) {
                    axis.dir = Math.sign(delta);
                    axis.edge = value;
                }
                return false;
            }
            if (delta * axis.dir > 0) {
                axis.edge = value;
                return false;
            }
            if (Math.abs(delta) < min) return false;
            axis.dir = -axis.dir;
            axis.edge = value;
            return true;
        };

        const resetShake = (x: number, y: number) => {
            swings = [];
            Object.assign(axisX, { dir: 0, edge: x });
            Object.assign(axisY, { dir: 0, edge: y });
        };

        const lookAt = (clientX: number, clientY: number, isNewGesture = false) => {
            const svg = svgRef.current;
            if (!svg) return;
            const r = svg.getBoundingClientRect();
            const dx = clientX - (r.left + r.width / 2);
            const dy = clientY - (r.top + r.height / 2);
            const now = performance.now();



            const reachX = Math.min(REACH_X, Math.max(70, r.width * 0.75));
            const reachY = reachX * (REACH_Y / REACH_X);

            aim.x = Math.tanh(dx / reachX);
            aim.y = Math.tanh(dy / reachY);
            lastMove = now;
            releaseAt = Infinity;

            if (isNewGesture) {
                resetShake(aim.x, aim.y);
                return;
            }
            if (reduce || now < dizzyStart + DIZZY_MS + DIZZY_COOLDOWN_MS) return;

            const turnX = turned(axisX, aim.x, SWING_X);
            const turnY = turned(axisY, aim.y, SWING_Y);
            if (!turnX && !turnY) return;

            swings = swings.filter((t) => now - t < SHAKE_WINDOW_MS);
            swings.push(now);
            if (swings.length >= SHAKE_COUNT) {
                dizzyStart = now;
                swings = [];
            }
        };



        const onPointer = (e: PointerEvent) => {
            if (e.pointerType === "touch") return;
            idleMs = IDLE_MS;
            lookAt(e.clientX, e.clientY);
        };

        const onTouchStart = (e: TouchEvent) => {
            idleMs = TOUCH_IDLE_MS;
            lookAt(e.touches[0].clientX, e.touches[0].clientY, true);
        };

        const onTouchMove = (e: TouchEvent) => {
            lookAt(e.touches[0].clientX, e.touches[0].clientY);
        };

        const onTouchEnd = (e: TouchEvent) => {
            if (e.touches.length === 0) releaseAt = performance.now() + TOUCH_HOLD_MS;
        };

        const onLeave = () => {
            aim.x = 0;
            aim.y = 0;
            resetShake(0, 0);
        };

        const tick = (now: number) => {
            const dt = Math.max(0, Math.min((now - last) / 1000, 1 / 30));
            last = now;

            if (now > releaseAt) {
                aim.x = 0;
                aim.y = 0;
                releaseAt = Infinity;
            }

            if (!reduce) {

                if (now - lastMove > idleMs && now > nextWander) {
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



            const progress = (now - dizzyStart) / DIZZY_MS;
            const dizzy = progress >= 0 && progress < 1;
            const strength = dizzy ? Math.min(1, progress * 8, (1 - progress) * 2.5) : 0;
            const spin = dizzy ? (now - dizzyStart) / 130 : 0;

            let tx = aim.x * MAX_X + jitter.x;
            let ty = aim.y * MAX_Y + jitter.y;

            tx += (Math.cos(spin) * 80 - tx) * strength;
            ty += (Math.sin(spin) * 40 - ty) * strength;

            const c = 2 * Math.sqrt(STIFFNESS) * DAMPING_RATIO;
            vel.x += (STIFFNESS * (tx - pos.x) - c * vel.x) * dt;
            vel.y += (STIFFNESS * (ty - pos.y) - c * vel.y) * dt;
            pos.x += vel.x * dt;
            pos.y += vel.y * dt;

            const dilateTarget = now < dilateUntilRef.current ? 1 : 0;
            if (reduce) {
                dilate.value = dilateTarget;
            } else {
                dilate.vel += (220 * (dilateTarget - dilate.value) - 17 * dilate.vel) * dt;
                dilate.value += dilate.vel * dt;
            }
            const scale = 1 + DILATE_SCALE * dilate.value;
            const inner = STAR_INNER + (STAR_INNER_FAT - STAR_INNER) * dilate.value;

            lookRef.current?.setAttribute(
                "transform",
                `translate(${(pos.x + CX).toFixed(2)} ${(pos.y + CY).toFixed(2)}) scale(${scale.toFixed(3)}) translate(${-CX} ${-CY})`
            );
            starRef.current?.setAttribute("points", starPoints(inner));
            starRef.current?.setAttribute(
                "transform",
                `translate(${(pos.x * STAR_PARALLAX).toFixed(2)} ${(pos.y * STAR_PARALLAX).toFixed(2)})`
            );



            const open = lidOpenness(now - blinkStartRef.current) * (1 - 0.35 * strength);
            const points = lidPoints(open);
            lidClipRef.current?.setAttribute("points", points);
            lidFillRef.current?.setAttribute("points", points);

            raf = requestAnimationFrame(tick);
        };

        const passive = { passive: true };
        window.addEventListener("pointermove", onPointer);
        window.addEventListener("pointerdown", onPointer);
        window.addEventListener("touchstart", onTouchStart, passive);
        window.addEventListener("touchmove", onTouchMove, passive);
        window.addEventListener("touchend", onTouchEnd, passive);
        window.addEventListener("touchcancel", onTouchEnd, passive);
        document.documentElement.addEventListener("mouseleave", onLeave);
        raf = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("pointermove", onPointer);
            window.removeEventListener("pointerdown", onPointer);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("touchcancel", onTouchEnd);
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
                onClick={handlePress}
                onMouseDown={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handlePress();
                    }
                }}
                role="button"
                tabIndex={0}
                aria-label="Olho. Clique para piscar e dilatar a pupila"
                style={{
                    cursor: "pointer",
                    touchAction: "none",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    WebkitTouchCallout: "none",
                    WebkitTapHighlightColor: "transparent",
                }}
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