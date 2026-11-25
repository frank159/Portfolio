"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * <main> que ocupa exatamente o espaço entre o cabeçalho e o rodapé.
 * Mede os dois na tela em vez de supor a altura, então não sobra rolagem
 * quando o rodapé quebra em duas linhas ou o cabeçalho muda de tamanho.
 */
export default function TelaCheia({
    className = "",
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const main = ref.current;
        if (!main) return;
        const footer = Array.from(document.querySelectorAll("footer")).pop();

        if (!footer) return;

        const update = () => {
            const above = main.getBoundingClientRect().top + window.scrollY;
            const below = footer.getBoundingClientRect().height;
            main.style.minHeight = `calc(100dvh - ${Math.ceil(above + below)}px)`;
        };

        const observer = new ResizeObserver(update);
        observer.observe(footer);
        observer.observe(document.body);
        window.addEventListener("resize", update);
        update();

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", update);
            main.style.minHeight = "";
        };
    }, []);

    return (
        <main ref={ref} className={className}>
            {children}
        </main>
    );
}