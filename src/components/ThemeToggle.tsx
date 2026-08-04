//Stores
import { useThemeStore } from "@/stores/theme.store";

//Icons
import { Moon, Sun } from "iconsax-reactjs";

export const ThemeToggle = () => {
    const { theme, setTheme } = useThemeStore();

    const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

    return (
        <button onClick={toggle} className="hover:bg-muted/20 dark:hover:bg-muted/40 p-2 rounded-md transition-colors cursor-pointer">
            {theme === "dark" ? <Sun className="size-4 md:size-4.5 xl:size-5" /> : <Moon className="size-4 md:size-4.5 xl:size-5" />}
        </button>
    );
};
