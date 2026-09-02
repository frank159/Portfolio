"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // position fixed e z-50 para flutuar no topo
    <header className="fixed top-0 left-0 flex w-full z-50 h-14 items-stretch border-b border-black bg-white font-semibold text-sm tracking-wide text-black transition-all">

      <div className="flex items-center px-8 border-r border-black lg:border-none lg:mr-100">
        <h1 className="m-0 text-base font-bold uppercase tracking-wider">
          Guará Estúdio
        </h1>
      </div>

      {/* Navegação Desktop (Escondida no Mobile) */}
      <nav className="hidden lg:flex flex-1 items-center justify-between border-l border-black px-8 uppercase">
        <Link href="/" className="hover:opacity-70 transition-opacity">INÍCIO</Link>
        <Link href="/" className="hover:opacity-70 transition-opacity">WEB SITE</Link>
        <Link href="/" className="hover:opacity-70 transition-opacity">SERIGRAFIA</Link>
        <Link href="/" className="hover:opacity-70 transition-opacity">DESEN. DE CÓDIGO</Link>
        <Link href="/" className="hover:opacity-70 transition-opacity">DESIGN</Link>
        <Link href="/" className="hover:opacity-70 transition-opacity">JOGOS</Link>
        <Link href="/" className="hover:opacity-70 transition-opacity">LOJA</Link>
        <Link href="/" className="hover:opacity-70 transition-opacity">CONTATO</Link>
      </nav>

      {/* Botão Sanduíche Mobile (Escondido no Desktop) */}
      <div className="flex lg:hidden flex-1 justify-end items-center px-6">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex flex-col justify-center items-center gap-1 w-10 h-10 border-2 border-black bg-transparent cursor-pointer"
          aria-label="Abrir menu"
        >
          {/* Linha superior: Rotaciona e desce (positivo) */}
          <span className={`block w-5 h-0.5 bg-black transition-all duration-300 ease-in-out origin-center ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>

          {/* Linha do meio: Fica transparente */}
          <span className={`block w-5 h-0.5 bg-black transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : ''}`}></span>

          {/* Linha inferior: Rotaciona pro lado oposto e SOBE (negativo) */}
          <span className={`block w-5 h-0.5 bg-black transition-all duration-300 ease-in-out origin-center ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>

      {/* Dropdown do Menu Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-14 left-0 w-full bg-white border-b border-black flex flex-col uppercase overflow-hidden lg:hidden"
          >
            {/* Adicionei bordas inferiores em cada link para manter a estética editorial do seu layout */}
            <Link href="/" className="px-8 py-4 border-b border-black hover:bg-zinc-100">INÍCIO</Link>
            <Link href="/" className="px-8 py-4 border-b border-black hover:bg-zinc-100">WEB SITE</Link>
            <Link href="/" className="px-8 py-4 border-b border-black hover:bg-zinc-100">SERIGRAFIA</Link>
            <Link href="/" className="px-8 py-4 border-b border-black hover:bg-zinc-100">DESEN. DE CÓDIGO</Link>
            <Link href="/" className="px-8 py-4 border-b border-black hover:bg-zinc-100">DESIGN</Link>
            <Link href="/" className="px-8 py-4 border-b border-black hover:bg-zinc-100">JOGOS</Link>
            <Link href="/" className="px-8 py-4 border-b border-black hover:bg-zinc-100">LOJA</Link>
            <Link href="/" className="px-8 py-4 hover:bg-zinc-100">CONTATO</Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}