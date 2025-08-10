import { useEffect } from "react";

//Stores
import { useThemeStore } from "@/stores/theme.store";

export const ThemeProviderEffect = () => {

    const setTheme = useThemeStore((state) => state.setTheme);

    useEffect(() => {
        const saved = localStorage.getItem("theme") as "light" | "dark" | null;

        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const preferredTheme = saved ?? (systemPrefersDark ? "dark" : "light");

        setTheme(preferredTheme);
    }, [setTheme]);

    return null;
};
