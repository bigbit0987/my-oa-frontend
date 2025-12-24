import { create } from 'zustand';

interface ConfigState {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
    theme: 'light',
    toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
