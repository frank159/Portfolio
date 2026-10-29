const KEY = "guara:home-scroll";

/** Chamado ao clicar numa pasta: guarda a altura atual da home. */
export const saveHomeScroll = () => {
    try {
        sessionStorage.setItem(KEY, String(window.scrollY));
    } catch {}
};

/** Lê a altura salva sem apagar (null se a ida não foi por uma pasta). */
export const readHomeScroll = (): number | null => {
    try {
        const v = sessionStorage.getItem(KEY);
        return v === null ? null : Number(v);
    } catch {
        return null;
    }
};

/** Apaga o registro (após restaurar, ou quando o header é usado). */
export const clearHomeScroll = () => {
    try {
        sessionStorage.removeItem(KEY);
    } catch {}
};