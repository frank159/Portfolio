"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

type ProjectModalProps = {
  open: boolean;
  name: string;
  /** Imagens na ordem em que aparecem, de cima para baixo */
  images: string[];
  onClose: () => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;

// cor usada enquanto a dominante ainda não foi calculada (ou se falhar)
const FALLBACK_BG = "#f9fadb";

// px rolados para baixo até esconder o botão
const HIDE_THRESHOLD = 40;
// px rolados para cima até mostrar o botão (menor = reaparece mais rápido)
const SHOW_THRESHOLD = 25;
// perto do topo o botão fica sempre visível
const ALWAYS_SHOW_BELOW = 80;

// fundo: fade in / fade out
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3, delay: 0.1 } },
};

// painel: sobe com scale ao abrir, desce com scale ao fechar
const panelVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: EASE,
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.96,
    transition: { duration: 0.3, ease: EASE },
  },
};

// cada imagem entra em cascata
const imageVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

type Bucket = { r: number; g: number; b: number; n: number };

// Desenha a imagem numa miniatura e retorna a cor que mais aparece.
// Agrupa cores parecidas em "baldes" (16 níveis por canal) e tira a média do balde vencedor.
function getDominantColor(img: HTMLImageElement): string | null {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  const buckets = new Map<string, Bucket>();

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue; // ignora pixels transparentes

    const key = `${data[i] >> 4}-${data[i + 1] >> 4}-${data[i + 2] >> 4}`;
    const bucket = buckets.get(key) ?? { r: 0, g: 0, b: 0, n: 0 };
    bucket.r += data[i];
    bucket.g += data[i + 1];
    bucket.b += data[i + 2];
    bucket.n++;
    buckets.set(key, bucket);
  }

  let best: Bucket | null = null;
  for (const bucket of buckets.values()) {
    if (!best || bucket.n > best.n) best = bucket;
  }
  if (!best) return null;

  const r = Math.round(best.r / best.n);
  const g = Math.round(best.g / best.n);
  const b = Math.round(best.b / best.n);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function ProjectModal({
  open,
  name,
  images,
  onClose,
}: ProjectModalProps) {
  const reduceMotion = useReducedMotion();
  const lastScrollY = useRef(0);
  const [showClose, setShowClose] = useState(true);
  const [bg, setBg] = useState(FALLBACK_BG);

  const firstImage = images[0];

  // trava o scroll da página e fecha com ESC enquanto o modal estiver aberto
  useEffect(() => {
    if (!open) return;

    // sempre abre com o botão visível e a referência de scroll zerada
    setShowClose(true);
    lastScrollY.current = 0;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  // descobre a cor que mais aparece na primeira imagem e usa como fundo do painel
  useEffect(() => {
    if (!open || !firstImage) return;

    // não reaproveita a cor do projeto anterior
    setBg(FALLBACK_BG);

    let cancelled = false;
    const img = new window.Image();

    img.onload = () => {
      if (cancelled) return;
      try {
        const color = getDominantColor(img);
        if (color) setBg(color);
      } catch {
        // canvas "tainted" (imagem de outro domínio sem CORS): mantém o fallback
      }
    };

    // se o servidor for outro domínio, descomente:
    // img.crossOrigin = "anonymous";
    img.src = firstImage;

    return () => {
      cancelled = true;
    };
  }, [open, firstImage]);

  // rolando para baixo esconde o botão; rolando para cima mostra em qualquer altura
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;

    // clamp evita falsos positivos com o "bounce" do iOS no topo e no fim
    const maxScroll = Math.max(el.scrollHeight - el.clientHeight, 0);
    const y = Math.min(Math.max(el.scrollTop, 0), maxScroll);

    // perto do topo: sempre visível
    if (y < ALWAYS_SHOW_BELOW) {
      setShowClose(true);
      lastScrollY.current = y;
      return;
    }

    const delta = y - lastScrollY.current;

    if (delta <= -SHOW_THRESHOLD) {
      // rolou para cima
      setShowClose(true);
      lastScrollY.current = y;
    } else if (delta >= HIDE_THRESHOLD) {
      // rolou para baixo
      setShowClose(false);
      lastScrollY.current = y;
    }
    // movimentos menores que o limite são acumulados (ignora tremidas)
  };

  return (
    <AnimatePresence>
      {open && (
        // Overlay externo: só fundo + blur + fade. NÃO rola, então o botão
        // posicionado dentro dele fica sempre ancorado à tela.
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={name}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Contêiner que rola (irmão do botão) */}
          <div
            onScroll={handleScroll}
            // clicar em qualquer lugar (fundo, imagens) fecha o modal
            onClick={onClose}
            // evita que libs de smooth scroll (ex.: Lenis) capturem a rolagem do modal
            data-lenis-prevent
            className="absolute inset-0 cursor-pointer overflow-y-auto overscroll-contain"
          >
            {/* Coluna única: as imagens se encostam e formam uma imagem longa */}
            <motion.div
              className="mx-auto w-full max-w-[1100px] transition-colors duration-300 sm:my-10"
              // cor dominante da primeira imagem (dinâmica, então vai via style)
              style={{ backgroundColor: bg }}
              variants={panelVariants}
            >
              {images.map((src, i) => (
                <motion.div key={src} variants={imageVariants}>
                  <Image
                    src={src}
                    alt={`${name} - imagem ${i + 1} de ${images.length}`}
                    width={0}
                    height={0}
                    sizes="(min-width: 1100px) 1100px, 100vw"
                    // block remove o espacinho que imagens inline deixam embaixo
                    className="block h-auto w-full"
                    priority={i === 0}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Botão fechar: irmão do contêiner de scroll, ancorado ao overlay */}
          <motion.button
            type="button"
            onClick={onClose}
            aria-label="Fechar projeto"
            // escondido: sem foco por teclado e sem interceptar cliques
            tabIndex={showClose ? 0 : -1}
            aria-hidden={!showClose}
            initial={false}
            animate={
              showClose
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: -20, scale: 0.8 }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: showClose ? 0.35 : 0.25, ease: EASE }
            }
            whileHover={showClose ? { scale: 1.1 } : undefined}
            whileTap={showClose ? { scale: 0.95 } : undefined}
            style={{ pointerEvents: showClose ? "auto" : "none" }}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#f9fadb] text-xl leading-none text-black shadow-lg will-change-transform lg:right-8 lg:top-6"
          >
            ✕
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}