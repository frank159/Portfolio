import type { ComponentPropsWithoutRef, ElementType } from "react";
import { withDefaultFontSize } from "@/src/lib/fontSize";

const FONTS = {
    display: { className: "font-display tracking-tight font-normal", weights: false },
    nunito: { className: "font-nunito", weights: true },
} as const;

const WEIGHTS = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
} as const;

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