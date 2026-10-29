import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
    href: string;
    children: ReactNode;
    className?: string;
    color?: string;
};

export default function Button({
    href,
    children,
    className = "",
}: ButtonProps) {
    return (
        <Link
            href={href}
            className={`inline-block w-fit border px-3 py-2.5 text-sm font-semibold transition-colors border-[#5a7a8a] text-[#5a7a8a] hover:bg-[#5a7a8a] hover:text-white ${className}`}
        >
            {children}
        </Link>
    );
}
