"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";

const BG = "#FAFADC";
const RED = "#8b0000";

const NAV = [
  { href: "#inicio", label: "INÍCIO" },
  { href: "#website", label: "WEB SITE" },
  { href: "#serigrafia", label: "SERIGRAFIA" },
  { href: "#desenvolvimento", label: "DESEN. DE CÓDIGO" },
  { href: "#design", label: "DESIGN" },
  { href: "#loja", label: "LOJA" },
  { href: "#sobre", label: "SOBRE NÓS" },
  { href: "#contato", label: "CONTATO" },
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

/* ---------- Link do desktop com sublinhado animado ---------- */
function DesktopLink({ href, label }: { href: string; label: string }) {
  return (
    <motion.div initial="rest" whileHover="hover" whileTap={{ scale: 0.97 }} className="relative">
      <Link href={href} className="block whitespace-nowrap tracking-wide py-1">
        {label}
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
        className="flex flex-1 items-center px-4 lg:w-[40%] lg:flex-none lg:shrink-0 lg:border-r lg:px-8"
        style={{ borderColor: RED }}
      >
        <Link
          href="#inicio"
          onClick={close}
          className="whitespace-nowrap text-[15px] font-semibold uppercase tracking-tight text-black lg:text-2xl lg:font-bold"
        >
          GUARÁ ESTÚDIO
          <span className="lg:hidden"> &nbsp;•&nbsp; PORTFÓLIO</span>
        </Link>
      </div>

      {/* Navegação desktop */}
      <nav className="hidden flex-1 items-center justify-between px-8 text-[12px] font-bold text-black lg:flex xl:px-12">
        {NAV.map((item) => (
          <DesktopLink key={item.href} {...item} />
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
            <motion.div
              key="backdrop"
              aria-hidden="true"
              className="fixed inset-0 -z-10 bg-black/25 lg:hidden"
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
              className="absolute left-0 right-0 top-full max-h-[calc(100svh-44px)] overflow-y-auto border-b lg:hidden"
              style={{ backgroundColor: BG, borderColor: RED }}
              variants={reduceMotion ? panelVariantsReduced : panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.ul variants={listVariants} className="flex flex-col px-5 py-3">
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.href}
                    variants={reduceMotion ? undefined : itemVariants}
                    className="border-b last:border-b-0"
                    style={{ borderColor: "rgba(139,0,0,0.25)" }}
                  >
                    <motion.div whileTap={{ x: 6 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className="flex justify-end items-baseline gap-3 py-4 text-lg font-bold uppercase text-black"
                      >
                        {item.label}
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