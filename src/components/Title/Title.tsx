// src/components/Title/Title.tsx
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { withDefaultFontSize } from "@/src/lib/fontSize";

// Config das fontes. `weights: false` = a fonte só tem um peso, então `weight` é ignorado.
const FONTS = {
    display: { className: "font-display tracking-tight font-normal", weights: false }, // Anton SC
    nunito: { className: "font-nunito", weights: true }, // Nunito Sans
} as const;

// Config dos pesos. Classes escritas por inteiro para o Tailwind enxergá-las no build.
const WEIGHTS = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
} as const;

// Tamanhos padrão. O h1 é o título da página; qualquer outra tag usa o tamanho de título de seção.
// Para mudar em um uso específico, passe o tamanho no className: <Title className="text-7xl md:text-8xl">
// (quando o className já tem um tamanho, o padrão não é aplicado).
const DEFAULT_SIZES = {
    h1: { size: "text-6xl md:text-8xl" },
    other: { size: "text-[24px]", leading: "leading-none" },
} as const;

export type TitleFont = keyof typeof FONTS;
export type TitleWeight = keyof typeof WEIGHTS;

type TitleProps<T extends ElementType> = {
    as?: T;
    font?: TitleFont;
    weight?: TitleWeight;
    className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "font" | "weight" | "className">;

export default function Title<T extends ElementType = "h1">({
    as,
    font = "display",
    weight,
    className = "",
    ...props
}: TitleProps<T>) {
    const Component: ElementType = as ?? "h1";
    const config = FONTS[font];
    const weightClass = config.weights && weight ? WEIGHTS[weight] : "";
    const sizes = Component === "h1" ? DEFAULT_SIZES.h1 : DEFAULT_SIZES.other;

    return (
        <Component
            className={`${config.className} ${weightClass} ${withDefaultFontSize(className, sizes)}`}
            {...props}
        />
    );
}