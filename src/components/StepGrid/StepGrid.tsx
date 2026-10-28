"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import StepCard from "../StepCard/StepCard";

const useIsoLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

// mínimo de caracteres por linha: quanto menor o texto, menos linhas ele ganha
const CHARS_PER_LINE = 22;

type Step = { title: string; description: string };

export default function StepGrid({ steps }: { steps: Step[] }) {
    const gridRef = useRef<HTMLDivElement>(null);

    useIsoLayoutEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const fit = () => {
            const texts = Array.from(
                grid.querySelectorAll<HTMLElement>("[data-step-text]"),
            );

            // 1. todos na largura total: a área de texto de cada card passa a ter
            //    a altura do card mais alto da linha
            texts.forEach((el) => (el.style.maxWidth = ""));
            const available = texts.map((el) => el.parentElement!.clientHeight);
            const fullWidths = texts.map((el) => el.offsetWidth);

            // 2. cada texto recebe um nº de linhas proporcional ao seu tamanho,
            //    limitado à altura disponível, e é estreitado até quebrar nele
            texts.forEach((el, i) => {
                const child = el.firstElementChild as HTMLElement | null;
                const lineHeight =
                    parseFloat(getComputedStyle(child ?? el).lineHeight) || 18;

                const maxLines = Math.max(1, Math.round(available[i] / lineHeight));
                const wantedLines = Math.max(
                    1,
                    Math.ceil((el.textContent ?? "").trim().length / CHARS_PER_LINE),
                );
                const target = Math.min(maxLines, wantedLines) * lineHeight;

                if (el.offsetHeight >= target - 1) return; // já tem linhas suficientes

                let lo = fullWidths[i] * 0.4;
                let hi = fullWidths[i];
                while (hi - lo > 1) {
                    const mid = (lo + hi) / 2;
                    el.style.maxWidth = `${mid}px`;
                    if (el.offsetHeight >= target - 1) lo = mid;
                    else hi = mid;
                }
                el.style.maxWidth = `${lo}px`;
            });
        };

        fit();

        let cancelled = false;
        let lastWidth = grid.offsetWidth;
        const observer = new ResizeObserver(() => {
            if (grid.offsetWidth === lastWidth) return;
            lastWidth = grid.offsetWidth;
            fit();
        });
        observer.observe(grid);

        document.fonts?.ready.then(() => {
            if (!cancelled) fit();
        });

        return () => {
            cancelled = true;
            observer.disconnect();
        };
    }, [steps]);

    return (
        <div
            ref={gridRef}
            className="mx-auto grid max-w-[1500px] auto-rows-fr grid-cols-1 gap-6 sm:auto-rows-auto sm:grid-cols-2 lg:grid-cols-4 lg:gap-[35px]"
        >
            {steps.map((step) => (
                <StepCard key={step.title} {...step} />
            ))}
        </div>
    );
}