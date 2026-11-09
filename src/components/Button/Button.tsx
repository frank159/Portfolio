import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
    href: string;
    children: ReactNode;
    className?: string;
    color?: string;
    target?: string;
    rel?: string;
};

export default function Button({
    href,
    children,
    className = "",
    target,
    rel,
}: ButtonProps) {
    const isExternal = /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

    const baseClass = `inline-block w-fit border px-3 py-2.5 text-sm font-semibold transition-colors border-[#5a7a8a] text-[#5a7a8a] hover:bg-[#5a7a8a] hover:text-white ${className}`;

    // Links externos usam <a> nativo com target/rel
    if (isExternal || target) {
        return (
            <a
                href={href}
                target={target ?? (isExternal ? "_blank" : undefined)}
                rel={rel ?? (isExternal ? "noopener noreferrer" : undefined)}
                className={baseClass}
            >
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={baseClass}>
            {children}
        </Link>
    );
}