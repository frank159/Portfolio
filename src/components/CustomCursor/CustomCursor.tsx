"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Variant = "default" | "hover" | "down";

const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, label, [data-cursor='hover']";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<Variant>("default");
  const [isOverLight, setIsOverLight] = useState(false); // Renomeado para "Light" (claro/azul)

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 400, damping: 35, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 400, damping: 35, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("has-custom-cursor");

    const style = document.createElement("style");
    style.id = "custom-cursor-styles";
    style.innerHTML = `
      .has-custom-cursor,
      .has-custom-cursor *,
      .has-custom-cursor *::before,
      .has-custom-cursor *::after {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      setVariant(el?.closest(INTERACTIVE) ? "hover" : "default");

      let current = el;
      let foundLight = false;
      
      while (current && current !== document.documentElement) {
        // 1. Verifica se o elemento tem o atributo mágico "data-cursor-light"
        if (current.hasAttribute("data-cursor-light")) {
          foundLight = true;
          break;
        }
        
        // 2. Verifica se o elemento tem background CSS vermelho (rgb 125, 1, 3)
        const bg = window.getComputedStyle(current).backgroundColor;
        if (bg.includes("125, 1, 3")) {
          foundLight = true;
          break;
        }
        
        current = current.parentElement;
      }
      
      setIsOverLight(foundLight);
    };

    const onDown = () => setVariant("down");
    const onUp = (e: PointerEvent) => {
      const el = e.target as Element | null;
      setVariant(el?.closest(INTERACTIVE) ? "hover" : "default");
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      const styleEl = document.getElementById("custom-cursor-styles");
      if (styleEl) styleEl.remove();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const scale = variant === "hover" ? 1.2 : variant === "down" ? 0.7 : 1;
  const activeColor = isOverLight ? "#5C7A85" : "#7D0103";

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ x, y, opacity: visible ? 1 : 0 }}
      >
        <div 
          className="-ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full transition-colors duration-200" 
          style={{ backgroundColor: activeColor }} 
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className="-ml-4 -mt-4 h-8 w-8 rounded-full border transition-colors duration-200"
          style={{ borderColor: activeColor }}
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </motion.div>
    </>
  );
}