import type { ComponentPropsWithoutRef, ElementType } from "react";
import { withDefaultFontSize } from "@/src/lib/fontSize";

// Tamanho padrão de todo texto: 16px.
// Para mudar em um uso específico, passe o tamanho no className: <Text className="text-[15px] leading-[18px]">
// (quando o className já tem um tamanho, o padrão não é aplicado).
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