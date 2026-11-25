"use client";

import { useCallback, useEffect, useId, useRef } from "react";

// Medidas tiradas do design no Figma (losango ~578x263, íris r=114)
const W = 578;
const H = 263;
const CX = W / 2;
const CY = H / 2;

const IRIS_R = 114;
const SPIKES = 12; // número de pontas da estrela
const STAR_OUTER = 112;
const STAR_INNER = 14;

// ── Movimento do olho ──────────────────────────────────────────────
const MAX_X = 140; // alcance horizontal (unidades do SVG)
const MAX_Y = 48; // alcance vertical
const REACH_X = 220; // px: quanto menor, mais rápido o olho chega no limite lateral
const REACH_Y = 150; // px: o mesmo, para cima e para baixo
const STIFFNESS = 260; // força da mola (maior = mais rápido)
const DAMPING_RATIO = 0.65; // 1 = sem sobra; menor = passa um pouco do alvo
const STAR_PARALLAX = 0.12; // a estrela anda um pouco mais que a íris
const IDLE_MS = 5000; // sem mexer o mouse por esse tempo, o olho passeia sozinho

// ── Piscada ────────────────────────────────────────────────────────
const CLOSE_MS = 90;
const OPEN_MS = 170;
const MIN_OPEN = 0.04; // sobra uma linha fina quando fecha
const BLINK_MS = CLOSE_MS + OPEN_MS;
const AUTO_MIN_MS = 2500; // intervalo mínimo da piscada automática
const AUTO_MAX_MS = 6000; // intervalo máximo
const DOUBLE_CHANCE = 0.15; // chance de piscada dupla
const DOUBLE_GAP_MS = 320;

const randomBlinkDelay = () =>
  AUTO_MIN_MS + Math.random() * (AUTO_MAX_MS - AUTO_MIN_MS);

// 1 = aberto, MIN_OPEN = fechado
function lidOpenness(elapsed: number) {
  if (elapsed < 0 || elapsed >= BLINK_MS) return 1;
  if (elapsed < CLOSE_MS) {
    const t = elapsed / CLOSE_MS;
    return 1 - (1 - MIN_OPEN) * t * t; // fecha acelerando
  }
  const t = (elapsed - CLOSE_MS) / OPEN_MS;
  return MIN_OPEN + (1 - MIN_OPEN) * (1 - (1 - t) * (1 - t)); // abre desacelerando
}

// Forma da pálpebra: só os vértices de cima e de baixo se movem
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
  const lookRef = useRef<SVGGElement>(null); // íris + estrela
  const starRef = useRef<SVGPolygonElement>(null); // só a estrela (parallax)
  const lidClipRef = useRef<SVGPolygonElement>(null); // pálpebra usada como recorte
  const lidFillRef = useRef<SVGPolygonElement>(null); // pálpebra desenhada (cinza)
  const blinkStartRef = useRef(-Infinity);
  const nextBlinkRef = useRef(Infinity); // horário da próxima piscada automática

  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const lidId = `olho-palpebra-${id}`;
  const irisId = `olho-iris-${id}`;

  const blink = useCallback(() => {
    const now = performance.now();
    if (now - blinkStartRef.current < BLINK_MS) return; // já está piscando
    blinkStartRef.current = now;
  }, []);

  // Clique ou teclado: pisca e reinicia o timer da piscada automática
  const blinkAndRestartTimer = () => {
    blink();
    nextBlinkRef.current = performance.now() + randomBlinkDelay();
  };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const aim = { x: 0, y: 0 }; // para onde quer olhar, de -1 a 1
    const jitter = { x: 0, y: 0 }; // microtremor do olhar
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
      // cada eixo é independente, então o olho alcança também os cantos
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
        // Parado há um tempo: olha ao redor
        if (now - lastMove > IDLE_MS && now > nextWander) {
          aim.x = Math.random() * 2 - 1;
          aim.y = (Math.random() * 2 - 1) * 0.8;
          nextWander = now + 1200 + Math.random() * 2200;
        }
        // Microtremor: o olho nunca fica 100% parado
        if (now > nextJitter) {
          jitter.x = (Math.random() * 2 - 1) * 2.5;
          jitter.y = (Math.random() * 2 - 1) * 1.2;
          nextJitter = now + 400 + Math.random() * 800;
        }
        // Piscada automática (às vezes dupla)
        if (autoBlink && now >= nextBlinkRef.current) {
          blink();
          const isDouble: boolean = !wasDouble && Math.random() < DOUBLE_CHANCE;
          nextBlinkRef.current = now + (isDouble ? DOUBLE_GAP_MS : randomBlinkDelay());
          wasDouble = isDouble;
        }
      }

      // Mola amortecida
      const tx = aim.x * MAX_X + jitter.x;
      const ty = aim.y * MAX_Y + jitter.y;
      const c = 2 * Math.sqrt(STIFFNESS) * DAMPING_RATIO;
      vel.x += (STIFFNESS * (tx - pos.x) - c * vel.x) * dt;
      vel.y += (STIFFNESS * (ty - pos.y) - c * vel.y) * dt;
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;

      // Íris e estrela só se deslocam, sem mudar de formato
      lookRef.current?.setAttribute(
        "transform",
        `translate(${pos.x.toFixed(2)} ${pos.y.toFixed(2)})`
      );
      starRef.current?.setAttribute(
        "transform",
        `translate(${(pos.x * STAR_PARALLAX).toFixed(2)} ${(pos.y * STAR_PARALLAX).toFixed(2)})`
      );

      // Pálpebra: é a única forma que muda na piscada
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
        {/* A íris não amassa: ela some atrás da pálpebra */}
        <clipPath id={lidId}>
          <polygon ref={lidClipRef} points={lidPoints(1)} />
        </clipPath>
        {/* Mantém a estrela dentro da íris */}
        <clipPath id={irisId}>
          <circle cx={CX} cy={CY} r={IRIS_R} />
        </clipPath>
      </defs>

      <g
        onClick={blinkAndRestartTimer}
        onMouseDown={(e) => e.preventDefault()} // sem contorno preto ao clicar
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
        {/* Pálpebra (cinza) */}
        <polygon ref={lidFillRef} points={lidPoints(1)} fill="#D9D9D9" />

        {/* Íris + estrela, visíveis só pela abertura da pálpebra */}
        <g clipPath={`url(#${lidId})`}>
          <g ref={lookRef}>
            <circle cx={CX} cy={CY} r={IRIS_R} fill="#7A0000" />
            <g clipPath={`url(#${irisId})`}>
              <polygon ref={starRef} points={starPoints()} fill="#5F7F8C" />
            </g>
          </g>
        </g>

        {/* Área de clique fixa, funciona mesmo com o olho fechado */}
        <polygon points={lidPoints(1)} fill="transparent" />
      </g>
    </svg>
  );
}