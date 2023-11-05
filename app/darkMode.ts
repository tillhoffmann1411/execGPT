'use client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const useDarkMode = (): { colorTheme: 'dark' | 'light', setTheme: Dispatch<SetStateAction<"dark" | "light">> } => {
    const localStorageTheme = typeof window !== "undefined" ? localStorage.theme : "dark";
    const [theme, setTheme] = useState<'dark' | 'light'>(localStorageTheme === 'dark' ? 'dark' : 'light');
    const colorTheme = theme === 'dark' ? 'light' : 'dark';

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove(colorTheme);
        root.classList.add(theme);

        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', theme);
        }
    }, [theme, colorTheme]);

    return { colorTheme, setTheme };
}

export default useDarkMode;