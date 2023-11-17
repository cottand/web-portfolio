// app/ThemeRegistry.tsx
'use client';
import createCache from '@emotion/cache';
import {useServerInsertedHTML} from 'next/navigation';
import {CacheProvider} from '@emotion/react';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React, {createContext, useMemo, useState} from "react";
import {createTheme, useMediaQuery} from "@mui/material";
import {getCookie, setCookie} from "cookies-next";

const ColorModeContext = createContext({
    toggleColorMode: () => {
    }
});
// This implementation is from emotion-js
// https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902
export default function ThemeRegistry(props: { options: any, children: React.ReactNode }) {

    const cookie = getCookie("theme")
    const resultOfMedia = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    const initialMode = cookie === 'light' ? 'light' : (cookie === 'dark' ? 'dark' : resultOfMedia)
    const [mode, setMode] = useState<'light' | 'dark'>(initialMode);
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = (prevMode === 'light' ? 'dark' : 'light')

                    setCookie("theme", newMode)
                    return newMode
                });
            },
        }),
        [],
    );
    const theme = useMemo(
        () => {
            const commonOptions = {
                palette: {mode},
                typography: {
                    fontSize: 15
                },
                shadows: {}
            }
            const shadows = Array.apply(null, Array(25)).map((_, i) => [`${i}`, "none"])
            commonOptions.shadows = Object.fromEntries(shadows)
            const specificOptions = mode === 'dark' ? {} : {
                palette: {
                    primary: {
                        main: "#B24F31",// orange-y ish
                        light: "rgb(166, 212, 250)",
                        dark: "rgb(100, 141, 174)",

                    },
                    secondary: {
                        main: "#651fff",
                        light: "#834bff",
                        dark: "#4615b2",
                    },
                },
            }
            //@ts-ignore
            return createTheme({...commonOptions, ...specificOptions})
        },
        [mode],
    );


    const {options, children} = props;
    const [{cache, flush}] = React.useState(() => {
        const cache = createCache(options);
        cache.compat = true;
        const prevInsert = cache.insert;
        let inserted: string[] = [];
        cache.insert = (...args) => {
            const serialized = args[1];
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push(serialized.name);
            }
            return prevInsert(...args);
        };
        const flush = () => {
            const prevInserted = inserted;
            inserted = [];
            return prevInserted;
        };
        return {cache, flush};
    });

    useServerInsertedHTML(() => {
        const names = flush();
        if (names.length === 0) {
            return null;
        }
        let styles = '';
        for (const name of names) {
            styles += cache.inserted[name];
        }
        return (
            <style
                key={cache.key}
                data-emotion={`${cache.key} ${names.join(' ')}`}
                dangerouslySetInnerHTML={{
                    __html: styles,
                }}
            />
        );
    });

    return (
        <CacheProvider value={cache}>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    {children}
                </ThemeProvider>
            </ColorModeContext.Provider>
        </CacheProvider>
    );
}
