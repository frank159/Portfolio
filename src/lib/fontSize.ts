// src/lib/fontSize.ts

type DefaultSize = {
    /** Classe de tamanho padrão (pode ser responsiva: "text-6xl md:text-8xl") */
    size: string;
    /** Classe de altura de linha padrão (opcional) */
    leading?: string;
};

// Tamanho de fonte "base" (sem prefixo de breakpoint): text-[16px], text-sm, text-xl, text-6xl...
// Não confunde com cor ("text-[#fff]", "text-black") nem com alinhamento ("text-center").
const BASE_SIZE =
    /(?:^|\s)!?text-(?:\[\.?\d[^\]\s]*\]|xs|sm|base|lg|xl|[2-9]xl)(?=\s|$)/;

// Altura de linha sem prefixo de breakpoint: leading-none, leading-snug, leading-[24px]...
const BASE_LEADING = /(?:^|\s)!?leading-\S+/;

/**
 * Aplica o tamanho padrão do componente, a menos que o `className` de quem usa
 * já defina o seu próprio:
 *  - className com tamanho base (ex.: "text-[15px]")  -> o padrão (tamanho e altura de linha) não é aplicado
 *  - className só com altura de linha (ex.: "leading-snug") -> aplica o tamanho padrão, mantém a sua altura
 *  - className só com tamanho de breakpoint (ex.: "lg:text-[20px]") -> o padrão vale no mobile e o seu no lg
 */
export function withDefaultFontSize(
    className: string,
    { size, leading = "" }: DefaultSize,
): string {
    const hasSize = BASE_SIZE.test(className);
    const hasLeading = BASE_LEADING.test(className);

    return [
        hasSize ? "" : size,
        hasSize || hasLeading ? "" : leading,
        className,
    ]
        .filter(Boolean)
        .join(" ");
}