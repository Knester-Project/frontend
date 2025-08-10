//Stores
import { useThemeStore } from "@/stores/theme.store";

//Icons
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
    const { theme, setTheme } = useThemeStore();

    const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

    return (
        <button onClick={toggle} className="hover:bg-muted/20 dark:hover:bg-muted/40 p-2 rounded-md transition-colors cursor-pointer">
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
    );
};
