import type { ComponentPropsWithoutRef, ElementType } from "react";

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

    return <Component className={`font-sans ${className}`} {...props} />;
}