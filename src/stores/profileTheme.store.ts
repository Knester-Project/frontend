import { create } from 'zustand';

type Colors = {
    primary: string;
    secondary: string;
    isDark: boolean;
};

type ColorState = {
    colors: Colors;
    setColors: (patch: Partial<Colors>) => void; 
    replaceColors: (next: Colors) => void;
    resetColors: () => void;
};

const DEFAULT_COLORS: Colors = {
    primary: '#f0f0f0',
    secondary: '#e0e0e0',
    isDark: false,
};

export const useProfileTheme = create<ColorState>((set) => ({
    colors: DEFAULT_COLORS,
    setColors: (patch) => set((state) => ({ colors: { ...state.colors, ...patch } })),
    replaceColors: (next) => set({ colors: next }),
    resetColors: () => set({ colors: DEFAULT_COLORS }),
}));
