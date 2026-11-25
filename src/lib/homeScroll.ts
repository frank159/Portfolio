const KEY = "guara:home-scroll";

export const saveHomeScroll = () => {
    try {
        sessionStorage.setItem(KEY, String(window.scrollY));
    } catch {}
};

export const readHomeScroll = (): number | null => {
    try {
        const v = sessionStorage.getItem(KEY);
        return v === null ? null : Number(v);
    } catch {
        return null;
    }
};

export const clearHomeScroll = () => {
    try {
        sessionStorage.removeItem(KEY);
    } catch {}
};