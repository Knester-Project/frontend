import { create } from "zustand";

type ThemeStore = {
    theme: "light" | "dark";
    setTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: "light",
    setTheme: (theme) => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        localStorage.setItem("theme", theme);
        set({ theme });
    },
}));
