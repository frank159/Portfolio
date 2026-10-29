"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type ProjectModalProps = {
  open: boolean;
  name: string;
  /** Imagens na ordem em que aparecem, de cima para baixo */
  images: string[];
  onClose: () => void;
};

export default function ProjectModal({
  open,
  name,
  images,
  onClose,
}: ProjectModalProps) {
  // trava o scroll da página e fecha com ESC enquanto o modal estiver aberto
  useEffect(() => {
    if (!open) return;

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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={name}
          className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar projeto"
            className="fixed right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#f9fadb] text-xl leading-none text-black shadow-lg transition-transform hover:scale-110 lg:right-8 lg:top-6"
          >
            ✕
          </button>

          {/* Coluna única: as imagens se encostam e formam uma imagem longa */}
          <motion.div
            className="mx-auto w-full max-w-[1100px] bg-[#f9fadb] sm:my-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={`${name} - imagem ${i + 1} de ${images.length}`}
                width={0}
                height={0}
                sizes="(min-width: 1100px) 1100px, 100vw"
                // block remove o espacinho que imagens inline deixam embaixo
                className="block h-auto w-full"
                priority={i === 0}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}