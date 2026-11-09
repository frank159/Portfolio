"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { clearHomeScroll } from "@/src/lib/homeScroll";

const BG = "#FAFADC";
const RED = "#8b0000"; // também é a cor do sublinhado de hover de todos os itens

/* ==========================================================================
   ✦ CONFIGURAÇÃO DO EFEITO HOLOGRÁFICO ✦
   Tudo que controla o visual e a velocidade do efeito está aqui.
   O efeito fica 100% dentro das letras (background-clip: text).
   ========================================================================== */
type HoloConfig = {
  // --- Gradiente das letras ---
  colors: string[];            // cores do gradiente, em ordem (qualquer quantidade, qualquer formato CSS)
  gradientAngle: number;       // ângulo em graus (90 = horizontal, 115 = levemente diagonal, 180 = vertical)
  gradientSize: number;        // % da largura do texto que o gradiente ocupa. Maior = cores mais esticadas e suaves
  gradientSpeed: number;       // segundos para um ciclo completo do gradiente. Menor = mais rápido
  gradientReverse: boolean;    // true = o gradiente desliza para o outro lado

  // --- Variação de matiz (hue-rotate) ---
  hueShift: number;            // graus de variação de cor ao longo do ciclo. 0 = desliga
  hueSpeed: number;            // segundos do ciclo de variação
  saturation: [number, number]; // [mínima, máxima]. 1 = normal, 2 = bem vivo

  // --- Brilho branco que cruza as letras ---
  sheenEnabled: boolean;       // false = remove o brilho
  sheenColor: string;          // "R, G, B". Ex.: "255, 255, 255" (branco)
  sheenOpacity: number;        // 0 a 1. Intensidade no centro do brilho
  sheenWidth: number;          // largura da faixa (0 a 50). Maior = faixa mais larga
  sheenAngle: number;          // inclinação da faixa em graus
  sheenDuration: number;       // segundos que o brilho leva para atravessar o texto
  sheenPause: number;          // segundos de pausa entre uma passada e outra
  sheenDirection: "ltr" | "rtl"; // ltr = esquerda -> direita, rtl = direita -> esquerda
  sheenEase: "linear" | "easeIn" | "easeOut" | "easeInOut"; // curva de aceleração
};

const HOLO_CONFIG: HoloConfig = {
  // Gradiente: mais rápido e com mais contraste entre as cores
  colors: ["#5c7a85", "#7D0103", "#5c7a85", "#7D0103"],
  gradientAngle: 115,
  gradientSize: 180,
  gradientSpeed: 4.5,
  gradientReverse: false,

  // Matiz: variação pequena, só para dar vida sem sair muito da paleta
  hueShift: 25,
  hueSpeed: 4,
  saturation: [1.3, 1.7],

  // Brilho: mais forte, mais largo e mais frequente
  sheenEnabled: true,
  sheenColor: "255, 255, 255",
  sheenOpacity: 0.9,
  sheenWidth: 12,
  sheenAngle: 100,
  sheenDuration: 1.2,
  sheenPause: 1.8,
  sheenDirection: "ltr",
  sheenEase: "easeInOut",
};

// Gradiente final: repete a 1ª cor no fim para o loop não ter emenda.
const HOLO_GRADIENT = `linear-gradient(${HOLO_CONFIG.gradientAngle}deg, ${[
  ...HOLO_CONFIG.colors,
  HOLO_CONFIG.colors[0],
].join(", ")})`;

const SHEEN_GRADIENT = `linear-gradient(${HOLO_CONFIG.sheenAngle}deg, transparent ${50 - HOLO_CONFIG.sheenWidth
  }%, rgba(${HOLO_CONFIG.sheenColor}, ${HOLO_CONFIG.sheenOpacity}) 50%, transparent ${50 + HOLO_CONFIG.sheenWidth
  }%)`;

/* ==========================================================================
   ITENS DO MENU
   holo: true -> o texto do item ganha o efeito holográfico.
   ========================================================================== */
type NavItem = { href: string; label: string; holo?: boolean };

// Todos os href começam com "/" para serem absolutos (substituem a rota atual
// em vez de serem somados a ela).
const NAV: NavItem[] = [
  { href: "/", label: "INÍCIO" },
  { href: "/projetos/webdesing", label: "WEB SITE" },
  { href: "/projetos/serigrafia", label: "SERIGRAFIA" },
  // { href: "/projetos/desenvolvimento", label: "DESEN. DE CÓDIGO" },
  { href: "/projetos/desing", label: "DESIGN" },
  // { href: "/loja", label: "LOJA" },
  // { href: "/sobre", label: "SOBRE NÓS" },
  { href: "/contato", label: "CONTATO" },
  { href: "/formulario", label: "FORMULÁRIO", holo: true }, // ajuste a rota/link do formulário
];

// Abertura: arranca rápido e assenta devagar.
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
// Fechamento: começa devagar, acelera e termina suave (easeInOutQuart).
const EASE_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1];

/* ---------- Ícone sanduíche -> X ---------- */
const topBar: Variants = {
  closed: { y: 0, rotate: 0 },
  open: { y: 7, rotate: 45 },
};
const midBar: Variants = {
  closed: { opacity: 1, scaleX: 1 },
  open: { opacity: 0, scaleX: 0 },
};
const botBar: Variants = {
  closed: { y: 0, rotate: 0 },
  open: { y: -7, rotate: -45 },
};

function BurgerIcon({ open }: { open: boolean }) {
  const state = open ? "open" : "closed";
  const t = { duration: 0.35, ease: EASE };
  const bar = "block h-[2px] w-6 origin-center bg-black";

  return (
    <span className="flex h-[16px] w-6 flex-col justify-between" aria-hidden="true">
      <motion.span className={bar} variants={topBar} animate={state} transition={t} />
      <motion.span className={bar} variants={midBar} animate={state} transition={t} />
      <motion.span className={bar} variants={botBar} animate={state} transition={t} />
    </span>
  );
}

/* ---------- Texto holográfico (estilo carta holo/polychrome do Balatro) ----------
   Camadas, de baixo para cima (tudo recortado na forma das letras):
   1. Letras preenchidas com um gradiente iridescente que desliza + hue-rotate.
   2. Um brilho branco diagonal ("sheen") que cruza as letras de tempos em tempos.
   Para ajustar o efeito, edite o HOLO_CONFIG no topo do arquivo. */
function HoloText({ label }: { label: string }) {
  const reduceMotion = useReducedMotion();
  const c = HOLO_CONFIG;

  const clipText = {
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
  } as const;

  // Posições do gradiente (o fim = tamanho do gradiente => loop sem emenda)
  // Posição final que faz o loop emendar sem salto (exige gradientSize > 100)
  const loopEnd = (100 * c.gradientSize) / (c.gradientSize - 100);
  const gradFrom = c.gradientReverse ? `${loopEnd}% 50%` : "0% 50%";
  const gradTo = c.gradientReverse ? "0% 50%" : `${loopEnd}% 50%`;
  
  // Posições do brilho (o brilho nasce e termina fora do texto)
  const sheenFrom = c.sheenDirection === "ltr" ? "100% 50%" : "0% 50%";
  const sheenTo = c.sheenDirection === "ltr" ? "0% 50%" : "100% 50%";

  const filterStart = `hue-rotate(0deg) saturate(${c.saturation[0]})`;
  const filterMid = `hue-rotate(${c.hueShift}deg) saturate(${c.saturation[1]})`;

  return (
    <span className="relative inline-block">
      {/* 1. Letras iridescentes */}
      <motion.span
        className="relative inline-block"
        style={{
          backgroundImage: HOLO_GRADIENT,
          backgroundSize: `${c.gradientSize}% 100%`,
          ...clipText,
        }}
        animate={
          reduceMotion
            ? undefined
            : {
              backgroundPosition: [gradFrom, gradTo],
              filter: [filterStart, filterMid, filterStart],
            }
        }
        transition={{
          backgroundPosition: { duration: c.gradientSpeed, ease: "linear", repeat: Infinity },
          filter: { duration: c.hueSpeed, ease: "easeInOut", repeat: Infinity },
        }}
      >
        {label}
      </motion.span>

      {/* 2. Brilho que cruza as letras */}
      {!reduceMotion && c.sheenEnabled && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 inline-block"
          style={{
            backgroundImage: SHEEN_GRADIENT,
            backgroundSize: "250% 100%", // mantenha >= 220% para o brilho começar/terminar fora do texto
            backgroundRepeat: "no-repeat",
            ...clipText,
          }}
          initial={{ backgroundPosition: sheenFrom }}
          animate={{ backgroundPosition: [sheenFrom, sheenTo] }}
          transition={{
            duration: c.sheenDuration,
            ease: c.sheenEase,
            repeat: Infinity,
            repeatDelay: c.sheenPause,
          }}
        >
          {label}
        </motion.span>
      )}
    </span>
  );
}

/* ---------- Link do desktop com sublinhado animado ---------- */
function DesktopLink({ href, label, holo }: NavItem) {
  return (
    <motion.div initial="rest" whileHover="hover" whileTap={{ scale: 0.97 }} className="relative">
      <Link href={href} onClick={clearHomeScroll} className="block whitespace-nowrap tracking-wide py-1">
        {holo ? <HoloText label={label} /> : label}
      </Link>
      <motion.span
        aria-hidden="true"
        className="absolute left-0 -bottom-0.5 h-[2px] w-full origin-left"
        style={{ backgroundColor: RED }}
        variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
        transition={{ duration: 0.3, ease: EASE }}
      />
    </motion.div>
  );
}

/* ---------- Variants do menu mobile ----------
   Os três níveis (painel > lista > itens) compartilham os mesmos rótulos
   "hidden" / "visible" / "exit", então a orquestração é feita só por variants.

   Abrir:  o painel desce e os itens entram em cascata de cima para baixo.
   Fechar: os itens saem em blocos de baixo para cima (cada um sobe e some);
           só depois que o último termina o painel recolhe para cima
           (when: "afterChildren") e o fundo escurecido desaparece. */
const panelVariants: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    transition: { duration: 0.5, ease: EASE },
  },
  exit: {
    clipPath: "inset(0 0 100% 0)",
    opacity: 0,
    transition: { when: "afterChildren", duration: 0.45, ease: EASE_IN_OUT },
  },
};

// Versão para quem prefere menos movimento: só fade, sem deslocamento.
const panelVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
  // staggerDirection -1: o último item sai primeiro (de baixo para cima).
  exit: { transition: { staggerChildren: 0.035, staggerDirection: -1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
  exit: {
    opacity: 0,
    y: -14,
    transition: { duration: 0.26, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const close = () => setOpen(false);

  // Fecha com ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Trava o scroll da página enquanto o menu está aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Fecha ao passar para o breakpoint desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 flex h-11 w-full items-stretch border-b lg:h-[76px]"
      style={{ borderColor: RED, backgroundColor: BG }}
    >
      {/* Logo / Nome: no desktop ocupa ~40% com divisória vertical */}
      <div
        className="flex flex-1 items-center px-4 lg:w-[45%] lg:flex-none lg:shrink-0 lg:border-r lg:px-8"
        style={{ borderColor: RED }}
      >
        <Link
          href="/"
          onClick={() => { clearHomeScroll(); close(); }}
          className="flex items-center"
        >
          <img src="/SVGs/header_logo.svg" alt="Guará Estúdio" className="h-7 w-auto pb-2 lg:h-10" />
        </Link>
      </div>

      {/* Navegação desktop */}
      <nav className="hidden flex-1 items-center justify-between px-8 text-[12px] font-bold text-black lg:flex xl:px-12">
        {NAV.map((item) => (
          <DesktopLink key={item.label} {...item} />
        ))}
      </nav>

      {/* Botão sanduíche (só mobile/tablet) */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        whileTap={{ scale: 0.9 }}
        className="flex h-full w-14 shrink-0 items-center justify-center lg:hidden"
      >
        <BurgerIcon open={open} />
      </motion.button>

      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <>
            {/* Fundo escurecido (fica atrás do header por causa do -z-10).
                Ao fechar, só começa a sumir quando o painel já está recolhendo. */}
            {/* Blur do fundo: começa abaixo do header para não alterá-lo */}
            <motion.div
              key="blur"
              aria-hidden="true"
              className="fixed inset-x-0 bottom-0 top-11 -z-10 bg-black/30 backdrop-blur-md lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: reduceMotion ? 0 : 0.3 } }}
              exit={{
                opacity: 0,
                transition: { duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.3 },
              }}
              onClick={close}
            />

            {/* Painel */}
            <motion.nav
              key="panel"
              id="mobile-menu"
              className="absolute border-t left-0 right-0 top-full max-h-[calc(100svh-44px)] overflow-y-auto border-b lg:hidden"
              style={{ backgroundColor: BG, borderColor: RED }}
              variants={reduceMotion ? panelVariantsReduced : panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.ul variants={listVariants} className="flex flex-col px-5 py-3">
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.label}
                    variants={reduceMotion ? undefined : itemVariants}
                    className="border-b last:border-b-0"
                    style={{ borderColor: "rgba(139,0,0,0.25)" }}
                  >
                    <motion.div whileTap={{ x: 6 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                      <Link
                        href={item.href}
                        onClick={() => { clearHomeScroll(); close(); }}
                        className="flex justify-end items-baseline gap-3 py-4 text-lg font-bold uppercase text-black"
                      >
                        {item.holo ? <HoloText label={item.label} /> : item.label}
                        <span className="w-6 text-[11px] font-semibold" style={{ color: RED }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </Link>
                    </motion.div>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}