"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { clearHomeScroll } from "@/src/lib/homeScroll";

const BG = "#FAFADC";
const RED = "#8b0000";

type NavItem = { href: string; label: string; scrollToBottom?: boolean };

function scrollToPageBottom() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: reduce ? "auto" : "smooth",
  });
}

const NAV: NavItem[] = [
  { href: "/", label: "INÍCIO" },
  { href: "/projetos/webdesing", label: "WEB SITE" },
  { href: "/projetos/serigrafia", label: "SERIGRAFIA" },
  { href: "/projetos/desing", label: "DESIGN" },
  { href: "/contato", label: "CONTATO", scrollToBottom: true },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1];

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

function DesktopLink({ href, label, scrollToBottom }: NavItem) {
  return (
    <motion.div initial="rest" whileHover="hover" whileTap={{ scale: 0.97 }} className="relative">
      {scrollToBottom ? (
        <button
          type="button"
          onClick={scrollToPageBottom}
          className="block whitespace-nowrap tracking-wide py-1 font-bold"
        >
          {label}
        </button>
      ) : (
        <Link href={href} onClick={clearHomeScroll} className="block whitespace-nowrap tracking-wide py-1">
          {label}
        </Link>
      )}
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

const panelVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
      <div
        className="flex flex-1 items-center px-4 lg:w-[55%] lg:flex-none lg:shrink-0 lg:border-r lg:px-8"
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

      <nav className="hidden flex-1 items-center justify-between px-8 text-[12px] font-bold text-black lg:flex xl:px-12">
        {NAV.map((item) => (
          <DesktopLink key={item.label} {...item} />
        ))}
      </nav>

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

      <AnimatePresence>
        {open && (
          <>
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
                      {(() => {
                        const cls =
                          "flex w-full justify-end items-baseline gap-3 py-4 text-lg font-bold uppercase text-black";
                        const content = (
                          <>
                            {item.label}
                            <span className="w-6 text-[11px] font-semibold" style={{ color: RED }}>
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          </>
                        );

                        return item.scrollToBottom ? (
                          <button
                            type="button"
                            className={cls}
                            onClick={() => {
                              close();
                              setTimeout(scrollToPageBottom, 120);
                            }}
                          >
                            {content}
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => { clearHomeScroll(); close(); }}
                            className={cls}
                          >
                            {content}
                          </Link>
                        );
                      })()}
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