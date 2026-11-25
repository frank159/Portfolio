
type DefaultSize = {
    size: string;
    leading?: string;
};

const BASE_SIZE =
    /(?:^|\s)!?text-(?:\[\.?\d[^\]\s]*\]|xs|sm|base|lg|xl|[2-9]xl)(?=\s|$)/;

const BASE_LEADING = /(?:^|\s)!?leading-\S+/;

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