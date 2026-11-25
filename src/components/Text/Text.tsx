import type { ComponentPropsWithoutRef, ElementType } from "react";
import { withDefaultFontSize } from "@/src/lib/fontSize";

const DEFAULT_SIZE = { size: "text-[16px]", leading: "leading-[24px]" };

type TextProps<T extends ElementType> = {
    as?: T;
    className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export default function Text<T extends ElementType = "p">({
    as,
    className = "",
    ...props
}: TextProps<T>) {
    const Component: ElementType = as ?? "p";

    return (
        <Component
            className={`font-sans ${withDefaultFontSize(className, DEFAULT_SIZE)}`}
            {...props}
        />
    );
}