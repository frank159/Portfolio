// src/components/Title/Title.tsx
import type { ComponentPropsWithoutRef, ElementType } from "react";

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

    return (
        <Component
            className={`${config.className} ${weightClass} ${className}`}
            {...props}
        />
    );
}