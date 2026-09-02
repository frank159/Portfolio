"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function MainPage() {
    const [emoticon, setEmoticon] = useState(":)");
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        "bg-black",
        "bg-red-500",
        "bg-blue-500"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="flex flex-col items-center lg:flex-row min-h-screen font-sans text-black bg-[#FCFCFC]">

            <div className="flex flex-col w-full justify-center lg:w-1/2 px-8 py-12 lg:px-20 lg:py-16">
                <div>
                    <h2 className="text-6xl font-light tracking-tight mb-10">
                        <span style={{ fontFamily: 'var(--font-ribeye)' }}>O</span>
                        <span style={{ fontFamily: 'var(--font-playfair)' }}>lá!</span>{" "}
                        <motion.span
                            aria-label="Emoticon interativo"
                            className="inline-block cursor-pointer select-none font-sans"
                            whileHover={{ scale: 1.25 }}
                            whileTap={{ scale: 1.1, rotate: 20 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            onTapStart={() => setEmoticon(";)")}
                            onTap={() => setEmoticon(":)")}
                            onTapCancel={() => setEmoticon(":)")}
                        >
                            {emoticon}
                        </motion.span>
                    </h2>

                    <div className="space-y-4 text-[13px] leading-relaxed text-black font-medium pr-8">
                        <p>Somos um estúdio de design e tecnologia.<br />
                            Posicionamos sua empresa no mercado com uma boa comunicação, muito estilo e arte.</p>

                        <p>Administrada por Vitória Carvalho, designer e serígrafa há mais de 8 anos, e por Frank Castro F.,
                            Desenvolvedor Front-end e entusiasta de Game Design / Game Development, temos como objetivo
                            unir os dois mundos, arte física e digital, feita por mãos humanas.</p>

                        <p>Estamos em Curitiba/PR, a Capital do Design.</p>
                    </div>
                </div>
                <div className="mt-12 w-full">
                    <hr className="border-black" />

                    <div className="flex items-center justify-between py-4 pr-4 pl-4 ">
                        <span className="font-semibold text-sm">Contato</span>
                        <Link
                            href="/contato"
                            className="inline-block bg-[#5a6f75] text-white px-5 py-2 text-xs font-medium hover:bg-[#4a5c62] transition-colors"
                        >
                            Vamos Conversar
                        </Link>
                    </div>
                    <hr className="border-black" />

                    {/* Linha: Sobre */}
                    <div className="flex items-center justify-between py-4 pr-4 pl-4 ">
                        <span className="font-semibold text-sm">Sobre</span>
                    </div>
                    <hr className="border-black" />

                    {/* Linha: Redes Sociais e Selo */}
                    <div className="flex items-center justify-between py-6 pr-4 pl-4">
                        <div>
                            <p className="font-bold text-[14px] mb-4 uppercase tracking-widest">SIGA @guaraestudio</p>
                            <div className="flex flex-col gap-4 text-black">
                                <div className="flex gap-4 items-center">
                                    {/* Instagram */}
                                    <svg className="hover:scale-105 transition-transform cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                    {/* Behance */}
                                    <span className="text-xl font-serif font-bold leading-none hover:scale-105 transition-transform cursor-pointer">Bē</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                    {/* TikTok */}
                                    <svg className="hover:scale-105 transition-transform cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                                    {/* Pinterest */}
                                    <svg className="hover:scale-105 transition-transform cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                </div>
                            </div>
                        </div>

                        <div className="w-20 h-20 relative hover:scale-105 transition-transform cursor-pointer">
                            <img
                                src="/icons/logo/logoCarimbo.png"
                                alt="Carimbo Guará Estúdio"
                                className="w-full h-full object-contain animate-[spin_15s_linear_infinite]"
                            />
                        </div>
                    </div>
                    <hr className="border-black " />
                </div>
            </div>
            <div className="border-r h-160 " />
            {/* --- COLUNA DIREITA (Carrossel) --- */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8 lg:p-20">
                <div className="relative w-full aspect-[4/3] bg-zinc-100 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }} // Suavidade da transição
                            className={`absolute inset-0 w-full h-full ${slides[currentSlide]}`}
                        >
                            {/* QUANDO TIVER AS IMAGENS, USE A TAG ABAIXO EM VEZ DAS CORES DE FUNDO: */}
                            {/* <img src={slides[currentSlide]} alt="Carrossel Guará" className="w-full h-full object-cover" /> */}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

        </div>
    );
}